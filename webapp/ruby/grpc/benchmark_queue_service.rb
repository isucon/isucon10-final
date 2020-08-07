require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def receive_benchmark_job(request, _call)
    db = Xsuportal::Database.connection
    job_handle = nil
    Xsuportal::Database.transaction do
      job = db.xquery(
        'SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1 FOR UPDATE',
        Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
      ).first
      unless job
        Xsuportal::Database.transaction_rollback
        break
      end
      puts "Sending job_id=#{job[:id]}"
      db.xquery(
        'UPDATE `benchmark_jobs` SET `status` = ? WHERE `id` = ? LIMIT 1',
        Xsuportal::Proto::Resources::BenchmarkJob::Status::SENT,
        job[:id],
      )

      contest = db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1').first
      job_handle = {
        job_id: job[:id],
        target_hostname: job[:target_hostname],
        contest_started_at: contest[:contest_starts_at],
        job_created_at: job[:created_at],
      }
    end

    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: job_handle
    )
  end
end
