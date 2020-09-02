require 'securerandom'
require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'
require 'xsu_redis'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def receive_benchmark_job(request, _call)
    job_handle = nil
    job_marshal = redis.brpop('xsuportal:pending_jobs', 2)
    if job_marshal
      job = Marshal.load(job_marshal[1])
      handle = SecureRandom.base64
      db.xquery(
        'UPDATE `benchmark_jobs` SET `status` = ?, handle = ? WHERE `id` = ? AND `status` = ? LIMIT 1',
        Xsuportal::Proto::Resources::BenchmarkJob::Status::SENT,
        handle,
        job[:id],
        Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
      )
      job_handle = {
        job_id: job[:id],
        handle: handle,
        target_hostname: job[:target_hostname],
        contest_started_at: contest[:contest_starts_at],
        job_created_at: job[:created_at],
      }
    end

    GRPC.logger.debug "Dequeued: job_handle=#{job_handle.inspect}"
    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: job_handle
    )
  end

  private
  def contest
    Thread.current[:contest] ||= db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1').first
  end

  def db
    Xsuportal::Database.connection
  end

  def redis
    Xsuportal::XsuRedis.connection
  end
end
