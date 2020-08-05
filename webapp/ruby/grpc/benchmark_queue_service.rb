require 'xsuportal/services/bench/receiving_pb'
require 'xsuportal/services/bench/receiving_services_pb'

class BenchmarkQueueService < Xsuportal::Proto::Services::Bench::BenchmarkQueue::Service
  def receive_benchmark_job(request, _call)
    Xsuportal::Proto::Services::Bench::ReceiveBenchmarkJobResponse.new(
      job_handle: nil
    )
  end
end
