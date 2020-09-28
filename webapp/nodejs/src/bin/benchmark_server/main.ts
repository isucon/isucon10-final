import mysql from "promise-mysql";
import util from "util";
import {getDB, secureRandom} from "../../app";
import grpc from "grpc";
import BenchmarkQueue from "../../proto/xsuportal/services/bench/receiving_grpc_pb";
import { ReceiveBenchmarkJobRequest, ReceiveBenchmarkJobResponse } from "../../proto/xsuportal/services/bench/receiving_pb";
import { BenchmarkReportService } from "../../proto/xsuportal/services/bench/reporting_grpc_pb";
import { BenchmarkJob } from "../../proto/xsuportal/resources/benchmark_job_pb";

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

function main() {
  const server = new grpc.Server();
  const port = process.env["PORT"] ?? 50051;

  
  server.addService<BenchmarkQueue.IBenchmarkQueueServer>(BenchmarkQueue.BenchmarkQueueService, new BenchmarkQueueService());
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();
}

main();