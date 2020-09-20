require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'
require 'database'
require 'notifier'

class BenchmarkReportService < Xsuportal::Proto::Services::Bench::BenchmarkReport::Service
  def report_benchmark_result(call)
    db = Xsuportal::Database.connection
    notifier = Xsuportal::Notifier.new(db)
    call.each do |request|
      Xsuportal::Database.transaction_begin('report_benchmark_result')
      job = db.xquery(
        'SELECT * FROM `benchmark_jobs` WHERE `id` = ? AND `handle` = ? LIMIT 1 FOR UPDATE',
        request.job_id,
        request.handle,
      ).first

      unless job
        Xsuportal::Database.transaction_rollback('report_benchmark_result')
        GRPC.logger.error "Job not found: job_id=#{request.job_id}, handle=#{request.handle.inspect}"
        raise GRPC::NotFound.new("Job #{request.job_id} not found or handle is wrong")
      end

      if request.result.finished
        GRPC.logger.debug "#{request.job_id}: save as finished"
        save_as_finished(job, request)
        Xsuportal::Database.transaction_commit('report_benchmark_result')
        call.send_msg Xsuportal::Proto::Services::Bench::ReportBenchmarkResultResponse.new(
          acked_nonce: request.nonce,
        )
        notifier.notify_benchmark_job_finished(job)
        # TODO: これわざわざストリームこっちから切る理由はない気がする (本番では複数ジョブ跨いで受け付けてます) これやるなら1ストリームで複数ジョブ流してくるのは Bad Request であるということにしたい ~sorah
        break
      else
        GRPC.logger.debug "#{request.job_id}: save as running"
        save_as_running(job, request)
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
  def save_as_finished(job, request)
    if !job[:started_at] || job[:finished_at]
      Xsuportal::Database.transaction_rollback('report_benchmark_result')
      raise GRPC::Internal.new("Job #{request.job_id} has already finished or has not started yet")
    end

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

  def save_as_running(job, request)
    if job[:started_at]
      Xsuportal::Database.transaction_rollback('report_benchmark_result')
      raise GRPC::Internal.new("Job #{request.job_id} has been already running")
    end

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
