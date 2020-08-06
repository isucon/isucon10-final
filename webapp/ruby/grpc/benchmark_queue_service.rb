require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def receive_benchmark_job(request, _call)
    db = Xsuportal::Database.connection
    job_handle = nil
    Xsuportal::Database.transaction do
      job = db.xquery("SELECT * FROM `benchmark_jobs` WHERE `status` = 'ready' ORDER BY `id` LIMIT 1 FOR UPDATE").first
      unless job
        break
      end
      puts "Sending job_id=#{job[:id]}"

      job_handle = {
        job_id: job[:id],
        target_hostname: job[:target_hostname], # TODO: tekitou
      }
    end

    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: job_handle
    )
  end
end
