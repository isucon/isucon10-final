require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'

class BenchmarkReportService < Xsuportal::Proto::Services::Bench::BenchmarkReport::Service
  def report_benchmark_result(call)
    db = Xsuportal::Database.connection
    Xsuportal::Database.transaction do
      call.each do |request|
        puts "Got reported: #{request.inspect}"
        job = db.xquery(
          'SELECT * FROM `benchmark_jobs` WHERE `id` = ? LIMIT 1 FOR UPDATE',
          request.job_id,
        ).first

        unless job
          puts "Job not found: job_id=#{request.job_id}"
          break
        end

        if request.result.finished
          puts "#{request.job_id}: save as finished"
          save_as_finished(request)
          break
        else
          puts "#{request.job_id}: save as started"
          save_as_started(request)
        end

        call.send_msg Xsuportal::Proto::Services::Bench::ReportBenchmarkResultResponse.new(
          acked_nonce: request.nonce,
        )
      end
    end
  end

  private
  def save_as_finished(request)
    db = Xsuportal::Database.connection
    result = request.result
    db.xquery(
      <<~SQL,
        INSERT `benchmark_results` (
          `benchmark_job_id`,
          `score`,
          `score_raw`,
          `score_deduction`,
          `finished`,
          `passed`,
          `marked_at`,
          `reason`,
          `stdout`,
          `stderr`,
          `created_at`,
          `updated_at`
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, NOW(), NOW())
      SQL
      request.job_id,
      result.score,
      result.score_breakdown&.base,
      result.score_breakdown&.deduction,
      true,
      result.passed,
      result.reason,
      result.stdout,
      result.stderr,
    )
    result_id = db.query('SELECT LAST_INSERT_ID() AS `id`').first.fetch(:id)
    db.xquery(
      <<~SQL,
        UPDATE `benchmark_jobs` SET
          `latest_benchmark_result_id` = ?,
          `status` = ?,
          `finished_at` = NOW(),
          `updated_at` = NOW()
        WHERE `id` = ? LIMIT 1
      SQL
      result_id,
      Proto::Resources::BenchmarkJob::Status::FINISHED,
      request.job_id,
    )
  end

  def save_as_running(request)
    db = Xsuportal::Database.connection
    db.xquery(
      <<~SQL,
        INSERT `benchmark_results` (
          `benchmark_job_id`,
          `finished`,
          `created_at`,
          `updated_at`
        ) VALUES (?, ?, NOW(), NOW())
      SQL
      request.job_id,
      false,
    )
    result_id = db.query('SELECT LAST_INSERT_ID() AS `id`').first.fetch(:id)
    db.xquery(
      <<~SQL,
        UPDATE `benchmark_jobs` SET
          `latest_benchmark_result_id` = ?,
          `status` = ?,
          `updated_at` = NOW()
        WHERE `id` = ? LIMIT 1
      SQL
      result_id,
      Proto::Resources::BenchmarkJob::Status::RUNNING,
      request.job_id,
    )
  end
end
