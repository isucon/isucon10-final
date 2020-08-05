require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'

class BenchmarkReportService < Xsuportal::Proto::Services::Bench::BenchmarkReport::Service
  def report_benchmark_result(call)
    call.each do |request|
      p request
      # job = BenchmarkJob.find_by!(id: request.job_id, handle: request.handle)
      # job.submit_result_from_pb!(request.result)
      call.send_msg Xsuportal::Proto::Services::Bench::ReportBenchmarkResultResponse.new(
        acked_nonce: request.nonce,
      )
    end
  end
end
