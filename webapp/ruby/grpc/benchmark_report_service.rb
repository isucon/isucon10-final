require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'

class BenchmarkReportService < Xsuportal::Proto::Services::Bench::BenchmarkReport::Service
  def report_benchmark_result(call)
    db = Xsuportal::Database.connection
    call.each do |request|
      Xsuportal::Database.transaction_begin('report_benchmark_result')
      job = db.xquery(
        'SELECT * FROM `benchmark_jobs` WHERE `id` = ? LIMIT 1 FOR UPDATE',
        request.job_id,
      ).first

      unless job
        Xsuportal::Database.transaction_rollback('report_benchmark_result')
        GRPC.logger.error "Job not found: job_id=#{request.job_id}"
        break
      end

      if request.result.finished
        GRPC.logger.debug "#{request.job_id}: save as finished"
        save_as_finished(request)
        Xsuportal::Database.transaction_commit('report_benchmark_result')
        call.send_msg Xsuportal::Proto::Services::Bench::ReportBenchmarkResultResponse.new(
          acked_nonce: request.nonce,
        )
        break
      else
        GRPC.logger.debug "#{request.job_id}: save as running"
        save_as_running(request)
        Xsuportal::Database.transaction_commit('report_benchmark_result')
      end
      call.send_msg Xsuportal::Proto::Services::Bench::ReportBenchmarkResultResponse.new(
        acked_nonce: request.nonce,
      )
    end
  ensure
    Xsuportal::Database.ensure_transaction_close('report_benchmark_result')
  end

  private
  def save_as_finished(request)
    db = Xsuportal::Database.connection
    result = request.result
    db.xquery(
      <<~SQL,
        UPDATE `benchmark_jobs` SET
          `status` = ?,
          `score_raw` = ?,
          `score_deduction` = ?,
          `passed` = ?,
          `reason` = ?,
          `updated_at` = NOW(6),
          `finished_at` = NOW(6)
        WHERE `id` = ?
        LIMIT 1
      SQL
      Xsuportal::Proto::Resources::BenchmarkJob::Status::FINISHED,
      result.score_breakdown&.raw,
      result.score_breakdown&.deduction,
      result.passed,
      result.reason,
      request.job_id,
    )
  end

  def save_as_running(request)
    db = Xsuportal::Database.connection
    db.xquery(
      <<~SQL,
        UPDATE `benchmark_jobs` SET
          `status` = ?,
          `score_raw` = NULL,
          `score_deduction` = NULL,
          `passed` = FALSE,
          `reason` = NULL,
          `started_at` = NOW(6),
          `updated_at` = NOW(6),
          `finished_at` = NULL
        WHERE `id` = ?
        LIMIT 1
      SQL
      Xsuportal::Proto::Resources::BenchmarkJob::Status::RUNNING,
      request.job_id,
    )
  end
end
