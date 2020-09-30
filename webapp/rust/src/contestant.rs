use crate::proto::services::contestant::{
    DashboardResponse, EnqueueBenchmarkJobRequest, EnqueueBenchmarkJobResponse,
    GetBenchmarkJobResponse, ListBenchmarkJobsResponse, ListClarificationsResponse,
    ListNotificationsResponse, LoginRequest, LoginResponse, LogoutResponse,
    RequestClarificationRequest, RequestClarificationResponse, SignupRequest, SignupResponse,
    SubscribeNotificationRequest, SubscribeNotificationResponse, UnsubscribeNotificationRequest,
    UnsubscribeNotificationResponse,
};
use actix_protobuf::{ProtoBuf, ProtoBufResponseBuilder};
use actix_session::Session;
use actix_web::{http::StatusCode, web, Error as AWError, HttpResponse};
use mysql::prelude::*;
use std::ops::DerefMut;

pub async fn login(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<LoginRequest>,
) -> Result<HttpResponse, AWError> {
    let message = message.0;
    let contestant_id = message.contestant_id.clone();

    let result: Option<(String,)> = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        Ok(conn.exec_first(
            "SELECT `password` FROM `contestants` WHERE `id` = ? LIMIT 1",
            (contestant_id,),
        )?)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    if let Some((password,)) = result {
        if ring::constant_time::verify_slices_are_equal(
            password.as_bytes(),
            crate::sha256_hexdigest(&message.password).as_bytes(),
        )
        .is_ok()
        {
            session.set("contestant_id", message.contestant_id)?;
            return HttpResponse::Ok().protobuf(LoginResponse {});
        }
    }
    Err(crate::Error::UserError(
        StatusCode::BAD_REQUEST,
        "ログインIDまたはパスワードが正しくありません",
    )
    .into())
}

pub async fn logout(session: Session) -> Result<HttpResponse, AWError> {
    if session.get::<String>("contestant_id")?.is_some() {
        session.remove("contestant_id");
        HttpResponse::Ok().protobuf(LogoutResponse {})
    } else {
        Err(crate::Error::UserError(StatusCode::UNAUTHORIZED, "ログインしていません").into())
    }
}

fn build_benchmark_job_pb(job: crate::BenchmarkJob) -> crate::proto::resources::BenchmarkJob {
    crate::proto::resources::BenchmarkJob {
        id: job.id,
        team_id: job.team_id,
        status: job.status,
        target_hostname: job.target_hostname,
        created_at: Some(crate::chrono_timestamp_to_protobuf(job.created_at)),
        updated_at: Some(crate::chrono_timestamp_to_protobuf(job.updated_at)),
        started_at: job.started_at.map(crate::chrono_timestamp_to_protobuf),
        finished_at: job.finished_at.map(crate::chrono_timestamp_to_protobuf),
        team: None,
        result: if job.finished_at.is_some() {
            let has_score =
                job.score_raw.as_ref().is_some() && job.score_deduction.as_ref().is_some();
            Some(crate::proto::resources::BenchmarkResult {
                finished: true,
                passed: job.passed.unwrap_or_default(),
                score: if has_score {
                    job.score_raw.unwrap() - job.score_deduction.unwrap()
                } else {
                    0
                },
                score_breakdown: if has_score {
                    Some(crate::proto::resources::benchmark_result::ScoreBreakdown {
                        raw: job.score_raw.unwrap(),
                        deduction: job.score_deduction.unwrap(),
                    })
                } else {
                    None
                },
                reason: job.reason.unwrap_or_default(),
                marked_at: None, // XXX: never used
            })
        } else {
            None
        },
    }
}

pub async fn signup(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<SignupRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = message.0.contestant_id.clone();
    let hashed_password = crate::sha256_hexdigest(&message.0.password);
    let result = web::block::<_, _, crate::Error>(move||{
        let mut conn = db.get().expect("Failed to checkout database connection");
        conn.exec_drop("INSERT INTO `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, FALSE, NOW(6))", (contestant_id, hashed_password))?;
        Ok(())
    }).await;
    if let Err(actix_web::error::BlockingError::Error(crate::Error::DatabaseError(
        mysql::Error::MySqlError(ref e),
    ))) = result
    {
        if e.code == mysql::ServerError::ER_DUP_ENTRY as u16 {
            return Err(crate::Error::UserError(
                StatusCode::BAD_REQUEST,
                "IDが既に登録されています",
            )
            .into());
        }
    }
    result.map_err(crate::unwrap_blocking_error)?;
    session.set("contestant_id", message.0.contestant_id)?;
    HttpResponse::Ok().protobuf(SignupResponse {})
}

pub async fn list_benchmark_jobs(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;

    let jobs: Vec<crate::BenchmarkJob> = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (_, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        Ok(conn.exec(
            "SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? ORDER BY `created_at` DESC",
            (current_team.id,),
        )?)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(ListBenchmarkJobsResponse {
        jobs: jobs.into_iter().map(build_benchmark_job_pb).collect(),
    })
}

pub async fn enqueue_benchmark_job(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<EnqueueBenchmarkJobRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    let job: crate::BenchmarkJob = web::block(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
        let (_, current_team) = crate::require_current_contestant_and_team(&mut tx, &contestant_id, false)?;

        let contest_status = crate::get_current_contest_status(&mut tx)?;
        if contest_status.contest.status != crate::proto::resources::contest::Status::Started {
            return Err(crate::Error::UserError(StatusCode::FORBIDDEN,
                    "競技時間外はベンチマークを実行できません",
            ));
        }

        let job_count: Option<(i64,)> = tx.exec_first("SELECT COUNT(*) AS `cnt` FROM `benchmark_jobs` WHERE `team_id` = ? AND `finished_at` IS NULL", (current_team.id,))?;
        if let Some((c,)) = job_count {
            if c > 0 {
                return Err(crate::Error::UserError(StatusCode::FORBIDDEN, "既にベンチマークを実行中です"));
            }
        }

        tx.exec_drop("INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))", (current_team.id, message.target_hostname, crate::proto::resources::benchmark_job::Status::Pending as i32))?;

        let job = tx.query_first("SELECT * FROM `benchmark_jobs` WHERE `id` = (SELECT LAST_INSERT_ID()) LIMIT 1")?.expect("last bencmark job isn't found");
        tx.commit()?;
        Ok(job)
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(EnqueueBenchmarkJobResponse {
        job: Some(build_benchmark_job_pb(job)),
    })
}

pub async fn get_benchmark_job(
    session: Session,
    db: web::Data<crate::Pool>,
    info: web::Path<(i64,)>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let id = info.into_inner().0;

    let job: Option<crate::BenchmarkJob> = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (_, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        Ok(conn.exec_first(
            "SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? AND `id` = ? LIMIT 1",
            (current_team.id, id),
        )?)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    if let Some(job) = job {
        HttpResponse::Ok().protobuf(GetBenchmarkJobResponse {
            job: Some(build_benchmark_job_pb(job)),
        })
    } else {
        Err(
            crate::Error::UserError(StatusCode::NOT_FOUND, "ベンチマークジョブが見つかりません")
                .into(),
        )
    }
}

pub async fn dashboard(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;

    let leaderboard = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (_, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        Ok(crate::leaderboard::get_leaderboard(
            &mut conn,
            current_team.id,
        )?)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(DashboardResponse {
        leaderboard: Some(leaderboard),
    })
}

pub async fn list_clarifications(
    session: Session,
    db: web::Data<crate::Pool>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;

    let clarifications = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (_, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        let clars: Vec<crate::Clarification> = conn.exec("SELECT * FROM `clarifications` WHERE `team_id` = ? OR `disclosed` = TRUE ORDER BY `updated_at` DESC", (current_team.id,))?;
        let mut clar_pbs = Vec::new();
        for clar in clars {
            let team = conn
                .exec_first(
                    "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
                    (clar.team_id,),
                )?
                .expect("team is not found");
            clar_pbs.push(crate::proto::resources::Clarification {
                id: clar.id,
                team_id: clar.team_id,
                answered: clar.answered_at.is_some(),
                disclosed: clar.disclosed.unwrap_or_default(),
                question: clar.question.unwrap_or_default(),
                answer: clar.answer.unwrap_or_default(),
                created_at: Some(crate::chrono_timestamp_to_protobuf(clar.created_at)),
                answered_at: clar.answered_at.map(crate::chrono_timestamp_to_protobuf),
                team: Some(crate::build_team_pb(conn.deref_mut(), team, false)?),
            });
        }
        Ok(clar_pbs)
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(ListClarificationsResponse { clarifications })
}

pub async fn request_clarification(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<RequestClarificationRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    let clarification = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (_, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
        tx.exec_drop("INSERT INTO `clarifications` (`team_id`, `question`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))", (current_team.id, message.question))?;
        let clar: crate::Clarification = tx.query_first("SELECT * FROM `clarifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1")?.expect("clarification is not found");
        tx.commit()?;
        Ok(crate::proto::resources::Clarification {
            id: clar.id,
            team_id: clar.team_id,
            answered: clar.answered_at.is_some(),
            disclosed: clar.disclosed.unwrap_or_default(),
            question: clar.question.unwrap_or_default(),
            answer: clar.answer.unwrap_or_default(),
            created_at: Some(crate::chrono_timestamp_to_protobuf(clar.created_at)),
            answered_at: clar.answered_at.map(crate::chrono_timestamp_to_protobuf),
            team: Some(crate::build_team_pb(conn.deref_mut(), current_team, false)?),
        })
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(RequestClarificationResponse {
        clarification: Some(clarification),
    })
}

#[derive(serde::Deserialize)]
pub struct ListNotificationsQuery {
    after: Option<String>,
}

pub async fn list_notifications(
    session: Session,
    db: web::Data<crate::Pool>,
    query: web::Query<ListNotificationsQuery>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let after: Option<i64> = query.into_inner().after.and_then(|s| s.parse().ok());

    let resp = web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (current_contestant, current_team) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        let mut tx = conn.start_transaction(mysql::TxOpts::default())?;
        let notifications: Vec<crate::Notification> = if let Some(after) = after {
            tx.exec("SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `id` > ? ORDER BY `id`", (&current_contestant.id, after))?
        } else {
            tx.exec("SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `read` = FALSE ORDER BY `id`", (&current_contestant.id,))?
        };
        tx.exec_drop("UPDATE `notifications` SET `read` = TRUE WHERE `contestant_id` = ? AND `read` = FALSE", (&current_contestant.id,))?;
        tx.commit()?;

        let last_answered_clar: Option<(i64,)> = conn.exec_first("SELECT `id` FROM `clarifications` WHERE (`team_id` = ? OR `disclosed` = TRUE) AND `answered_at` IS NOT NULL ORDER BY `id` DESC LIMIT 1", (current_team.id,))?;
        Ok(ListNotificationsResponse {
            last_answered_clarification_id: last_answered_clar.map(|clar| clar.0).unwrap_or(0),
            notifications: notifications.into_iter().map(|n| {
                use prost::Message;
                let proto_message = data_encoding::BASE64.decode(n.encoded_message.as_bytes()).expect("Failed to decode notifications.encoded_message as base64");
                let mut notification = crate::proto::resources::Notification::decode(proto_message.as_slice()).expect("Failed to decode notifications.message as protobuf");
                notification.id = n.id;
                notification.created_at = Some(crate::chrono_timestamp_to_protobuf(n.created_at));
                notification
            }).collect(),
        })
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(resp)
}

pub async fn subscribe_notification(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<SubscribeNotificationRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    if !crate::notifier::is_webpush_available() {
        return Err(crate::Error::ServerError(
            StatusCode::SERVICE_UNAVAILABLE,
            "Web Push は未対応です",
        )
        .into());
    }

    web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (current_contestant, _) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        conn.exec_drop("INSERT INTO `push_subscriptions` (`contestant_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, NOW(6), NOW(6))", (current_contestant.id, message.endpoint, message.p256dh, message.auth))?;

        Ok(())
    })
    .await.map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(SubscribeNotificationResponse {})
}

pub async fn unsubscribe_notification(
    session: Session,
    db: web::Data<crate::Pool>,
    message: ProtoBuf<UnsubscribeNotificationRequest>,
) -> Result<HttpResponse, AWError> {
    let contestant_id = session.get("contestant_id")?;
    let message = message.0;

    if !crate::notifier::is_webpush_available() {
        return Err(crate::Error::ServerError(
            StatusCode::SERVICE_UNAVAILABLE,
            "Web Push は未対応です",
        )
        .into());
    }

    web::block::<_, _, crate::Error>(move || {
        let mut conn = db.get().expect("Failed to checkout database connection");
        let (current_contestant, _) =
            crate::require_current_contestant_and_team(conn.deref_mut(), &contestant_id, false)?;

        conn.exec_drop(
            "DELETE FROM `push_subscriptions` WHERE `contestant_id` = ? AND `endpoint` = ? LIMIT 1",
            (current_contestant.id, message.endpoint),
        )?;

        Ok(())
    })
    .await
    .map_err(crate::unwrap_blocking_error)?;

    HttpResponse::Ok().protobuf(UnsubscribeNotificationResponse {})
}
