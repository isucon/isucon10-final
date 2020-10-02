import mysql from "promise-mysql";
import util from "util";
import strftime from 'strftime'
import { getDB, secureRandom, notifier, convertDateToTimestamp } from "../../app";
import grpc, { callError, makeGenericClientConstructor } from "grpc";
import BenchmarkQueue from "../../../proto/xsuportal/services/bench/receiving_grpc_pb";
import { ReceiveBenchmarkJobRequest, ReceiveBenchmarkJobResponse } from "../../../proto/xsuportal/services/bench/receiving_pb";
import BenchmarkReport from "../../../proto/xsuportal/services/bench/reporting_grpc_pb";
import { BenchmarkJob } from "../../../proto/xsuportal/resources/benchmark_job_pb";
import { ReportBenchmarkResultRequest, ReportBenchmarkResultResponse } from "../../../proto/xsuportal/services/bench/reporting_pb";
import { Timestamp } from "../../../proto/google/protobuf/timestamp_pb";
import { start } from "repl";

const sleep = util.promisify(setTimeout);

class BenchmarkQueueService implements BenchmarkQueue.IBenchmarkQueueServer {
  receiveBenchmarkJob(
    call: grpc.ServerUnaryCall<ReceiveBenchmarkJobRequest>,
    callback: grpc.sendUnaryData<ReceiveBenchmarkJobResponse>,
  ) {
    this.receiveBenchmarkJobPromise(call.request).then((res) => {
      callback(null, res);
    }).catch((e) => {
      callback(e, null);
    });
  }

  async receiveBenchmarkJobPromise(request: ReceiveBenchmarkJobRequest): Promise<ReceiveBenchmarkJobResponse> {
    const db = await getDB();

    let jobHandle = null;
    try {
      while (true) {
        await db.beginTransaction();
        const job = await this.pollBenchmarkJobs(db);
        if (job == null) {
          await db.rollback();
          break;
        }
        const [gotLock] = await db.query('SELECT 1 FROM `benchmark_jobs` WHERE `id` = ? AND `status` = ? FOR UPDATE', [job.id, BenchmarkJob.Status.PENDING]);
        if (gotLock != null) {
          const handle = secureRandom(16);
          await db.query('UPDATE `benchmark_jobs` SET `status` = ?, handle = ? WHERE `id` = ? AND `status` = ? LIMIT 1', [
            BenchmarkJob.Status.SENT, handle, job.id, BenchmarkJob.Status.PENDING,
          ]);
          const [contest] = await db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1');
          jobHandle = {
            jobId: job.id,
            handle,
            targetHostName: job.target_hostname,
            contestStartedAt: contest.contest_started_at,
            jobCreatedAt: job.created_at,
          }
          await db.commit();
          break;
        } else {
          await db.rollback();
          continue;
        }
      }
      const response = new ReceiveBenchmarkJobResponse();
      if (jobHandle != null) {
        console.log(`Dequeued: job_handle=${JSON.stringify(jobHandle)}`);
        const jobHandleResource = new ReceiveBenchmarkJobResponse.JobHandle();
        jobHandleResource.setHandle(jobHandle.handle);
        jobHandleResource.setJobId(jobHandle.jobId);
        if (jobHandle.contestStartedAt) {
          const contestStartedAt = convertDateToTimestamp(jobHandle.contestStartedAt);
          jobHandleResource.setContestStartedAt(contestStartedAt);
        }
        if (jobHandle.jobCreatedAt) {
          const jobCreatedAt = convertDateToTimestamp(jobHandle.jobCreatedAt);
          jobHandleResource.setJobCreatedAt(jobCreatedAt);
        }
        jobHandleResource.setTargetHostname(jobHandle.targetHostName);
        response.setJobHandle(jobHandleResource);
      }
      await db.commit();
      return response;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await db.release();
    }
  }

  async pollBenchmarkJobs(db: mysql.PoolConnection) {
    let job = null
    for (let i = 0; i < 10; i++) {
      if (i >= 1) {
        await sleep(50);
      }
      [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1', [BenchmarkJob.Status.PENDING]);
      if (job) {
        break;
      }
    }
    return job;
  }
}

class BenchmarkReportService implements BenchmarkReport.IBenchmarkReportServer {
  reportBenchmarkResult(
    call: grpc.ServerDuplexStream<ReportBenchmarkResultRequest, ReportBenchmarkResultResponse>,
  ) {
    call.on("data", async (request: ReportBenchmarkResultRequest) => {
      const response = await this.reportBenchmarkResultPromise(request);
      call.write(response);
    });
    call.on("end", () => {
      call.end();
    });
  }

  async reportBenchmarkResultPromise(request: ReportBenchmarkResultRequest): Promise<ReportBenchmarkResultResponse> {
    const db = await getDB();
    const notify = notifier;

    if (!request.hasResult()) {
      throw new Error("Invalid Argument result required");
    }

    try {
      await db.beginTransaction();
      const [job] = await db.query(
        'SELECT * FROM `benchmark_jobs` WHERE `id` = ? AND `handle` = ? LIMIT 1 FOR UPDATE',
        [request.getJobId(), request.getHandle(),]
      );

      if (job == null) {
        await db.rollback();
        console.error(`Job not found: job_id=${request.getJobId()}, handle=${request.getHandle().toString()}`);
        throw new Error(`Job ${request.getJobId()} not found or handle is wrong`);
      }

      if (request.getResult()?.getFinished()) {
        console.debug(`${request.getJobId()}: save as finished`);
        await this.saveAsFinished(job, request, db);
        await db.commit();
        notifier.notifyBenchmarkJobFinished(job, db);
      } else {
        console.debug(`${request.getJobId()}: save as running`);
        await this.saveAsRunning(job, request, db);
        await db.commit();
      }
      const response = new ReportBenchmarkResultResponse();
      response.setAckedNonce(request.getNonce());
      return response;
    } catch (e) {
      await db.rollback();
      throw e;
    } finally {
      await db.release();
    }
  }

  async saveAsFinished(job: any, request: ReportBenchmarkResultRequest, db: mysql.PoolConnection) {
    if (job.started_at == null || job.finished_at != null) {
      await db.rollback();
      throw new Error(`Job ${request.getJobId()} has already finished or has not started yet`);
    }
    const markedAtTimestamp = request.getResult()?.getMarkedAt();
    if (!markedAtTimestamp) {
      await db.rollback();
      throw new Error("marked_at is required");
    }

    const markedAt = formatDate(markedAtTimestamp);

    const result = request.getResult();
    await db.query(`
        UPDATE benchmark_jobs SET
          status = ?,
          score_raw = ?,
          score_deduction = ?,
          passed = ?,
          reason = ?,
          updated_at = NOW(6),
          finished_at = ?
        WHERE id = ?
        LIMIT 1
    `,
      [BenchmarkJob.Status.FINISHED, result?.getScoreBreakdown()?.getRaw(), result?.getScoreBreakdown()?.getDeduction(), result?.getPassed(), result?.getReason(), markedAt, request.getJobId()]
    );
  }

  async saveAsRunning(job: any, request: ReportBenchmarkResultRequest, db: mysql.PoolConnection) {
    const markedAtTimestamp = request.getResult()?.getMarkedAt();
    if (!markedAtTimestamp) {
      await db.rollback();
      throw new Error("marked_at is required");
    }
    const markedAt = formatDate(markedAtTimestamp);
    const result = request.getResult();
    let startedAt = null;
    if (job.started_at) {
      startedAt = new Date(job.started_at);
    } else {
      startedAt = markedAt;
    }
    await db.query(`
        UPDATE benchmark_jobs SET
          status = ?,
          score_raw = NULL,
          score_deduction = NULL,
          passed = FALSE,
          reason = NULL,
          started_at = ?,
          updated_at = NOW(6),
          finished_at = NULL
        WHERE id = ?
        LIMIT 1
    `,
      [
        BenchmarkJob.Status.RUNNING,
        startedAt,
        request.getJobId()]
    );
  }
}

function formatDate(timestamp: Timestamp) {
  const date = new Date(timestamp.getSeconds() * 1000);
  const datestr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}:${String(date.getUTCSeconds()).padStart(2, "0")}.${String(timestamp.getNanos() / 1000).padStart(6,"0")}`;
  return datestr;
}

function main() {
  const server = new grpc.Server();
  const port = process.env["PORT"] ?? 50051;


  server.addService<BenchmarkQueue.IBenchmarkQueueServer>(BenchmarkQueue.BenchmarkQueueService, new BenchmarkQueueService());
  server.addService<BenchmarkReport.IBenchmarkReportServer>(BenchmarkReport.BenchmarkReportService, new BenchmarkReportService());
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
