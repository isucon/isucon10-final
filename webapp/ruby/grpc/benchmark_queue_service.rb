require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def measure(msg, &block)
    result = nil
    duration = Benchmark.realtime do
      result = block.call
    end

    GRPC.logger.debug "MEASURE(%s) %.3f" % [msg, duration]
    result
  end

  def receive_benchmark_job(request, _call)
    db = Xsuportal::Database.connection
    job_handle = nil
    measure('queue transaction') do
      Xsuportal::Database.transaction('benchmark_queue_service') do
        job = measure('queue sql 1') {db.xquery(
          # 'SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1 FOR UPDATE',
          'SELECT * FROM `benchmark_jobs` WHERE `status` = ? ORDER BY `id` LIMIT 1',
          Xsuportal::Proto::Resources::BenchmarkJob::Status::PENDING,
        ).first }
        unless job
          Xsuportal::Database.transaction_rollback('benchmark_queue_service')
          break
        end
        measure('queue sql 2') {
        db.xquery(
          'UPDATE `benchmark_jobs` SET `status` = ? WHERE `id` = ? LIMIT 1',
          Xsuportal::Proto::Resources::BenchmarkJob::Status::SENT,
          job[:id],
        )
        }

        contest = measure('queue sql 3') {db.query('SELECT `contest_starts_at` FROM `contest_config` LIMIT 1').first}
        job_handle = {
          job_id: job[:id],
          target_hostname: job[:target_hostname],
          contest_started_at: contest[:contest_starts_at],
          job_created_at: job[:created_at],
        }
      end
    end # measure

    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: job_handle
    )
  end
end
