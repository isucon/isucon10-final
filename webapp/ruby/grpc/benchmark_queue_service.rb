require 'securerandom'
require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'
require 'database'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def receive_benchmark_job(request, _call)
    db = Xsuportal::Database.connection
    job_handle = nil

    while true
      Xsuportal::Database.transaction_begin('receive_benchmark_job')
      job = poll_benchmark_jobs
      unless job
        Xsuportal::Database.transaction_rollback('receive_benchmark_job')
        break
      end

      got_lock = db.xquery(
        'SELECT 1 FROM `benchmark_jobs` WHERE `id` = ? AND `status` = ? FOR UPDATE',
        job[:id],
        Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
      ).first

      if got_lock
        handle = SecureRandom.base64
        db.xquery(
          'UPDATE `benchmark_jobs` SET `status` = ?, handle = ? WHERE `id` = ? AND `status` = ? LIMIT 1',
          Xsuportal::Proto::Resources::BenchmarkJob::Status::SENT,
          handle,
          job[:id],
          Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
        )
        contest = db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1').first
        job_handle = {
          job_id: job[:id],
          handle: handle,
          target_hostname: job[:target_hostname],
          contest_started_at: contest[:contest_starts_at],
          job_created_at: job[:created_at],
        }
        Xsuportal::Database.transaction_commit('receive_benchmark_job')
        break
      else
        Xsuportal::Database.transaction_rollback('receive_benchmark_job')
        next
      end
    end

    GRPC.logger.debug "Dequeued: job_handle=#{job_handle.inspect}"
    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: job_handle
    )
  ensure
    Xsuportal::Database.ensure_transaction_close('receive_benchmark_job')
  end

  private
  def poll_benchmark_jobs
    job = nil
    10.times do |i|
      sleep 0.05 if i >= 1
      job = Xsuportal::Database.connection.xquery(
        'SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1',
        Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
      ).first
      break if job
    end
    job
  end
end
