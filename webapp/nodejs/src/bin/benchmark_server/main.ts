import mysql from "promise-mysql";
import util from "util";
import strftime from 'strftime'
import {getDB, secureRandom, notifier} from "../../app";
import grpc, { callError, makeGenericClientConstructor } from "grpc";
import BenchmarkQueue from "../../proto/xsuportal/services/bench/receiving_grpc_pb";
import { ReceiveBenchmarkJobRequest, ReceiveBenchmarkJobResponse } from "../../proto/xsuportal/services/bench/receiving_pb";
import BenchmarkReport from "../../proto/xsuportal/services/bench/reporting_grpc_pb";
import { BenchmarkJob } from "../../proto/xsuportal/resources/benchmark_job_pb";
import { ReportBenchmarkResultRequest, ReportBenchmarkResultResponse } from "../../proto/xsuportal/services/bench/reporting_pb";

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
        console.log(`Dequeued: job_handle=${jobHandle}`);
        const jobHandleResource = new ReceiveBenchmarkJobResponse.JobHandle();
        jobHandleResource.setHandle(jobHandle.handle);
        jobHandleResource.setJobId(jobHandle.jobId);
        jobHandleResource.setContestStartedAt(jobHandle.contestStartedAt);
        jobHandleResource.setJobCreatedAt(jobHandle.jobCreatedAt);
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
    for (let i=0;i<10;i++) {
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
    // TODO maybe we need to setup notifier.
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
        await saveAsFinished(job, request, db);
        db.commit();
        notifier.notifyBenchmarkJobFinished(job);
      } else {
        console.debug(`${request.getJobId()}: save as running`);
        await saveAsRunning(job, request, db);
        db.commit();
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
    const markedAt = new Date(markedAtTimestamp.getSeconds()*1000 + markedAtTimestamp.getNanos() / 1000);

    const conn = await getDB();
    const result = request.getResult();
    await conn.query(`
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
    [BenchmarkJob.Status.FINISHED, result?.getScoreBreakdown()?.getRaw(), result?.getScoreBreakdown()?.getDeduction(), result?.getPassed(), result?.getReason(), strftime('%Y-%m-%d %H:%M:%S.%L', markedAt), request.getJobId()]
    );
  }

  async saveAsRunning(job: any, request: ReportBenchmarkResultRequest, db: mysql.PoolConnection) {
    const markedAtTimestamp = request.getResult()?.getMarkedAt();
    if (!markedAtTimestamp) {
      await db.rollback();
      throw new Error("marked_at is required");
    }
    const markedAt = new Date(markedAtTimestamp.getSeconds()*1000 + markedAtTimestamp.getNanos() / 1000);

    const conn = await getDB();
    const result = request.getResult();
    await conn.query(`
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
      strftime('%Y-%m-%d %H:%M:%S.%L', new Date(job.started_at) || markedAt),
      request.getJobId()]
    );
  }
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