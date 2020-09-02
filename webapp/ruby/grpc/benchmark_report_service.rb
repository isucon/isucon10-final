require 'xsuportal/resources/benchmark_job_pb'
require 'xsuportal/services/bench/reporting_pb'
require 'xsuportal/services/bench/reporting_services_pb'

class BenchmarkReportService < Xsuportal::Proto::Services::Bench::BenchmarkReport::Service
  def report_benchmark_result(call)
    db = Xsuportal::Database.connection
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
    leaderboard = db.xquery('SELECT * FROM `leaderboard` WHERE `team_id` = ? LIMIT 1', job[:team_id]).first
    score = result.score_breakdown&.raw - result.score_breakdown&.deduction
    is_new_record = leaderboard[:best_score].to_i < score
    contest = db.query('SELECT `contest_freezes_at` <= NOW(6) AND NOW(6) < `contest_ends_at` AS `frozen` FROM contest_config').first

    sql = 'UPDATE `leaderboard` SET `latest_score` = ?, `latest_score_started_at` = ?, `latest_score_marked_at` = NOW(6), `finish_count` = `finish_count` + 1'
    args = [score, job[:started_at]]

    if contest[:frozen] != 1
      sql += ", `frozen_latest_score` = ?, `frozen_latest_score_started_at` = ?, `frozen_latest_score_marked_at` = NOW(6) "
      args.concat([score, job[:started_at]])
    end

    if is_new_record
      sql += ", `best_score` = ?, `best_score_started_at` = ?, `best_score_marked_at` = NOW(6) "
      args.concat([score, job[:started_at]])
      if contest[:frozen] != 1
        sql += ", `frozen_best_score` = ?, `frozen_best_score_started_at` = ?, `frozen_best_score_marked_at` = NOW(6) "
        args.concat([score, job[:started_at]])
      end
    end

    sql += " WHERE `team_id` = ? LIMIT 1"
    args << job[:team_id]

    GRPC.logger.info("DEBUG: leaderboard=#{[sql, args].inspect}")
    db.xquery(sql, *args)
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
