use crate::proto::resources::{benchmark_job::Status as BenchmarkJobStatus, BenchmarkResult};
use crate::proto::services::bench::benchmark_queue_server::BenchmarkQueue;
use crate::proto::services::bench::benchmark_report_server::BenchmarkReport;
use crate::proto::services::bench::receive_benchmark_job_response::JobHandle;
use crate::proto::services::bench::{
    ReceiveBenchmarkJobRequest, ReceiveBenchmarkJobResponse, ReportBenchmarkResultRequest,
    ReportBenchmarkResultResponse,
};
use chrono::NaiveDateTime;
use futures::Stream;
use mysql::prelude::*;
use std::ops::DerefMut;
use std::pin::Pin;
use std::sync::Arc;
use tonic::{Request, Response, Status as TonicStatus, Streaming};

#[derive(Debug)]
pub struct QueueService {
    pub db: Arc<crate::Pool>,
}

fn mysql_error_to_tonic_status(e: mysql::Error) -> TonicStatus {
    TonicStatus::internal(e.to_string())
}

#[tonic::async_trait]
impl BenchmarkQueue for QueueService {
    async fn receive_benchmark_job(
        &self,
        _request: Request<ReceiveBenchmarkJobRequest>,
    ) -> Result<Response<ReceiveBenchmarkJobResponse>, TonicStatus> {
        let mut conn = self
            .db
            .get()
            .expect("Failed to checkout database connection");
        let job_handle = loop {
            if let Some(h) = tokio::task::block_in_place(|| receive_benchmark_job(&mut conn))
                .map_err(mysql_error_to_tonic_status)?
            {
                break h;
            }
        };
        Ok(Response::new(ReceiveBenchmarkJobResponse { job_handle }))
    }
}

fn receive_benchmark_job(
    conn: &mut crate::PooledConnection,
) -> Result<Option<Option<JobHandle>>, mysql::Error> {
    let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
    let job: Option<crate::BenchmarkJob> = tx.exec_first(
        "SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1",
        (BenchmarkJobStatus::Pending as i32,),
    )?;
    if job.is_none() {
        return Ok(Some(None));
    }
    let job = job.unwrap();

    let got_lock: Option<(i32,)> = tx.exec_first(
        "SELECT 1 FROM `benchmark_jobs` WHERE `id` = ? AND `status` = ? FOR UPDATE",
        (job.id, BenchmarkJobStatus::Pending as i32),
    )?;

    if got_lock.is_some() {
        let rng = ring::rand::SystemRandom::new();
        let random_bytes: [u8; 16] = ring::rand::generate(&rng)
            .expect("Failed to generate random number")
            .expose();
        let handle = data_encoding::BASE64.encode(&random_bytes);
        tx.exec_drop("UPDATE `benchmark_jobs` SET `status` = ?, handle = ? WHERE `id` = ? AND `status` = ? LIMIT 1", (BenchmarkJobStatus::Sent as i32, &handle, job.id, BenchmarkJobStatus::Pending as i32))?;
        let contest: Option<(NaiveDateTime,)> =
            tx.query_first("SELECT `contest_starts_at` FROM `contest_config` LIMIT 1")?;
        let contest_starts_at = contest.expect("No contest_config found").0;
        tx.commit()?;
        Ok(Some(Some(JobHandle {
            job_id: job.id,
            handle,
            target_hostname: job.target_hostname,
            contest_started_at: Some(crate::chrono_timestamp_to_protobuf(contest_starts_at)),
            job_created_at: Some(crate::chrono_timestamp_to_protobuf(job.created_at)),
        })))
    } else {
        Ok(None)
    }
}

#[derive(Debug)]
pub struct ReportService {
    pub db: Arc<crate::Pool>,
}

#[tonic::async_trait]
impl BenchmarkReport for ReportService {
    type ReportBenchmarkResultStream = Pin<
        Box<
            dyn Stream<Item = Result<ReportBenchmarkResultResponse, TonicStatus>>
                + Send
                + Sync
                + 'static,
        >,
    >;

    async fn report_benchmark_result(
        &self,
        request: Request<Streaming<ReportBenchmarkResultRequest>>,
    ) -> Result<Response<Self::ReportBenchmarkResultStream>, TonicStatus> {
        let mut conn = self
            .db
            .get()
            .expect("Failed to checkout database connection");
        let mut stream = request.into_inner();

        // TODO: Delete push_subscription when Webpush::ExpiredSubscription or Webpush::InvalidSubscription
        let output = async_stream::try_stream! {
            while let Some(message) = stream.message().await? {
                let job_id = message.job_id;
                let finished = message.result.as_ref().expect("result is missing").finished;
                if let Some((job, notifiers)) = tokio::task::block_in_place(|| handle_report(&mut conn, &message)).map_err(mysql_error_to_tonic_status)? {
                    for notifier in notifiers {
                        let _ = notifier.send().await;
                    }
                    yield ReportBenchmarkResultResponse { acked_nonce: message.nonce };
                    // TODO: これわざわざストリームこっちから切る理由はない気がする (本番では複数ジョブ跨いで受け付けてます) これやるなら1ストリームで複数ジョブ流してくるのは Bad Request であるということにしたい ~sorah
                    if finished {
                        break;
                    }
                } else {
                    Err(TonicStatus::not_found(format!(
                            "Job {} not found or handle is wrong",
                            job_id)))?;
                }
            }
        };
        Ok(Response::new(Box::pin(output)))
    }
}

fn handle_report(
    conn: &mut crate::PooledConnection,
    message: &ReportBenchmarkResultRequest,
) -> Result<Option<(crate::BenchmarkJob, Vec<crate::notifier::WebPushNotifier>)>, mysql::Error> {
    let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
    let job: Option<crate::BenchmarkJob> = tx.exec_first(
        "SELECT * FROM `benchmark_jobs` WHERE `id` = ? AND `handle` = ? LIMIT 1 FOR UPDATE",
        (message.job_id, &message.handle),
    )?;
    if job.is_none() {
        log::error!(
            "Job not found: job_id={}, handle={}",
            message.job_id,
            message.handle
        );
        return Ok(None);
    }
    let job = job.unwrap();

    let result = message.result.as_ref().expect("result is missing");
    if result.finished {
        log::debug!("{}: save as finished", message.job_id);
        save_as_finished(&mut tx, &job, result)?;
    } else {
        log::debug!("{}: save as running", message.job_id);
        save_as_running(&mut tx, &job)?;
    }
    tx.commit()?;
    let notifiers = crate::notifier::notify_benchmark_job_finished(conn.deref_mut(), &job)?;
    Ok(Some((job, notifiers)))
}

fn save_as_finished(
    tx: &mut mysql::Transaction,
    job: &crate::BenchmarkJob,
    result: &BenchmarkResult,
) -> Result<(), mysql::Error> {
    if job.started_at.is_none() || job.finished_at.is_some() {
        return Err(mysql::Error::from(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Job {} has already finished or has not started yet", job.id),
        )));
    }
    tx.exec_drop(
        r#"
        UPDATE `benchmark_jobs` SET
          `status` = ?,
          `score_raw` = ?,
          `score_deduction` = ?,
          `passed` = ?,
          `reason` = ?,
          `updated_at` = NOW(6),
          `finished_at` = NOW(6)
        WHERE `id` = ?
        LIMIT 1
    "#,
        (
            BenchmarkJobStatus::Finished as i32,
            result
                .score_breakdown
                .as_ref()
                .map(|breakdown| breakdown.raw),
            result
                .score_breakdown
                .as_ref()
                .map(|breakdown| breakdown.deduction),
            result.passed,
            &result.reason,
            job.id,
        ),
    )
}

fn save_as_running(
    tx: &mut mysql::Transaction,
    job: &crate::BenchmarkJob,
) -> Result<(), mysql::Error> {
    if job.started_at.is_some() {
        return Err(mysql::Error::from(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Job {} has been already running", job.id),
        )));
    }

    tx.exec_drop(
        r#"
        UPDATE `benchmark_jobs` SET
          `status` = ?,
          `score_raw` = NULL,
          `score_deduction` = NULL,
          `passed` = FALSE,
          `reason` = NULL,
          `started_at` = NOW(6),
          `updated_at` = NOW(6),
          `finished_at` = NULL
        WHERE `id` = ?
        LIMIT 1
    "#,
        (BenchmarkJobStatus::Running as i32, job.id),
    )
}
