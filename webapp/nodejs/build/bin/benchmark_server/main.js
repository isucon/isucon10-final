"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const strftime_1 = __importDefault(require("strftime"));
const app_1 = require("../../app");
const grpc_1 = __importDefault(require("grpc"));
const receiving_grpc_pb_1 = __importDefault(require("../../../proto/xsuportal/services/bench/receiving_grpc_pb"));
const receiving_pb_1 = require("../../../proto/xsuportal/services/bench/receiving_pb");
const reporting_grpc_pb_1 = __importDefault(require("../../../proto/xsuportal/services/bench/reporting_grpc_pb"));
const benchmark_job_pb_1 = require("../../../proto/xsuportal/resources/benchmark_job_pb");
const reporting_pb_1 = require("../../../proto/xsuportal/services/bench/reporting_pb");
const sleep = util_1.default.promisify(setTimeout);
class BenchmarkQueueService {
    receiveBenchmarkJob(call, callback) {
        this.receiveBenchmarkJobPromise(call.request).then((res) => {
            callback(null, res);
        }).catch((e) => {
            callback(e, null);
        });
    }
    async receiveBenchmarkJobPromise(request) {
        const db = await app_1.getDB();
        let jobHandle = null;
        try {
            while (true) {
                await db.beginTransaction();
                const job = await this.pollBenchmarkJobs(db);
                if (job == null) {
                    await db.rollback();
                    break;
                }
                const [gotLock] = await db.query('SELECT 1 FROM `benchmark_jobs` WHERE `id` = ? AND `status` = ? FOR UPDATE', [job.id, benchmark_job_pb_1.BenchmarkJob.Status.PENDING]);
                if (gotLock != null) {
                    const handle = app_1.secureRandom(16);
                    await db.query('UPDATE `benchmark_jobs` SET `status` = ?, handle = ? WHERE `id` = ? AND `status` = ? LIMIT 1', [
                        benchmark_job_pb_1.BenchmarkJob.Status.SENT, handle, job.id, benchmark_job_pb_1.BenchmarkJob.Status.PENDING,
                    ]);
                    const [contest] = await db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1');
                    jobHandle = {
                        jobId: job.id,
                        handle,
                        targetHostName: job.target_hostname,
                        contestStartedAt: contest.contest_started_at,
                        jobCreatedAt: job.created_at,
                    };
                    await db.commit();
                    break;
                }
                else {
                    await db.rollback();
                    continue;
                }
            }
            const response = new receiving_pb_1.ReceiveBenchmarkJobResponse();
            if (jobHandle != null) {
                console.log(`Dequeued: job_handle=${JSON.stringify(jobHandle)}`);
                const jobHandleResource = new receiving_pb_1.ReceiveBenchmarkJobResponse.JobHandle();
                jobHandleResource.setHandle(jobHandle.handle);
                jobHandleResource.setJobId(jobHandle.jobId);
                if (jobHandle.contestStartedAt) {
                    const contestStartedAt = app_1.convertDateToTimestamp(jobHandle.contestStartedAt);
                    jobHandleResource.setContestStartedAt(contestStartedAt);
                }
                if (jobHandle.jobCreatedAt) {
                    const jobCreatedAt = app_1.convertDateToTimestamp(jobHandle.jobCreatedAt);
                    jobHandleResource.setJobCreatedAt(jobCreatedAt);
                }
                response.setJobHandle(jobHandleResource);
            }
            await db.commit();
            return response;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
        finally {
            await db.release();
        }
    }
    async pollBenchmarkJobs(db) {
        let job = null;
        for (let i = 0; i < 10; i++) {
            if (i >= 1) {
                await sleep(50);
            }
            [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1', [benchmark_job_pb_1.BenchmarkJob.Status.PENDING]);
            if (job) {
                break;
            }
        }
        return job;
    }
}
class BenchmarkReportService {
    reportBenchmarkResult(call) {
        call.on("data", async (request) => {
            const response = await this.reportBenchmarkResultPromise(request);
            call.write(response);
        });
        call.on("end", () => {
            call.end();
        });
    }
    async reportBenchmarkResultPromise(request) {
        const db = await app_1.getDB();
        // TODO maybe we need to setup notifier.
        const notify = app_1.notifier;
        if (!request.hasResult()) {
            throw new Error("Invalid Argument result required");
        }
        try {
            await db.beginTransaction();
            const [job] = await db.query('SELECT * FROM `benchmark_jobs` WHERE `id` = ? AND `handle` = ? LIMIT 1 FOR UPDATE', [request.getJobId(), request.getHandle(),]);
            if (job == null) {
                await db.rollback();
                console.error(`Job not found: job_id=${request.getJobId()}, handle=${request.getHandle().toString()}`);
                throw new Error(`Job ${request.getJobId()} not found or handle is wrong`);
            }
            if (request.getResult()?.getFinished()) {
                console.debug(`${request.getJobId()}: save as finished`);
                await this.saveAsFinished(job, request, db);
                db.commit();
                app_1.notifier.notifyBenchmarkJobFinished(job);
            }
            else {
                console.debug(`${request.getJobId()}: save as running`);
                await this.saveAsRunning(job, request, db);
                db.commit();
            }
            const response = new reporting_pb_1.ReportBenchmarkResultResponse();
            response.setAckedNonce(request.getNonce());
            return response;
        }
        catch (e) {
            await db.rollback();
            throw e;
        }
        finally {
            await db.release();
        }
    }
    async saveAsFinished(job, request, db) {
        if (job.started_at == null || job.finished_at != null) {
            await db.rollback();
            throw new Error(`Job ${request.getJobId()} has already finished or has not started yet`);
        }
        const markedAtTimestamp = request.getResult()?.getMarkedAt();
        if (!markedAtTimestamp) {
            await db.rollback();
            throw new Error("marked_at is required");
        }
        const markedAt = new Date(markedAtTimestamp.getSeconds() * 1000 + markedAtTimestamp.getNanos() / 1000);
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
    `, [benchmark_job_pb_1.BenchmarkJob.Status.FINISHED, result?.getScoreBreakdown()?.getRaw(), result?.getScoreBreakdown()?.getDeduction(), result?.getPassed(), result?.getReason(), strftime_1.default('%Y-%m-%d %H:%M:%S.%L', markedAt), request.getJobId()]);
    }
    async saveAsRunning(job, request, db) {
        const markedAtTimestamp = request.getResult()?.getMarkedAt();
        if (!markedAtTimestamp) {
            await db.rollback();
            throw new Error("marked_at is required");
        }
        const markedAt = new Date(markedAtTimestamp.getSeconds() * 1000 + markedAtTimestamp.getNanos() / 1000);
        const result = request.getResult();
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
    `, [
            benchmark_job_pb_1.BenchmarkJob.Status.RUNNING,
            strftime_1.default('%Y-%m-%d %H:%M:%S.%L', new Date(job.started_at) || markedAt),
            request.getJobId()
        ]);
    }
}
function main() {
    const server = new grpc_1.default.Server();
    const port = process.env["PORT"] ?? 50051;
    server.addService(receiving_grpc_pb_1.default.BenchmarkQueueService, new BenchmarkQueueService());
    server.addService(reporting_grpc_pb_1.default.BenchmarkReportService, new BenchmarkReportService());
    server.bind(`0.0.0.0:${port}`, grpc_1.default.ServerCredentials.createInsecure());
    server.start();
}
main();
