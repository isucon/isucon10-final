require 'sinatra/base'
require 'google/protobuf'
require 'digest/sha2'
require 'securerandom'

$LOAD_PATH << File.join(File.expand_path('../', __FILE__), 'lib')
require 'routes'
require 'database'


module Xsuportal
  class App < Sinatra::Base
    include Xsuportal::Routes

    MYSQL_ER_DUP_ENTRY = 1062
    ADMIN_ID = 'admin'
    ADMIN_PASSWORD = 'admin'
    DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS'

    configure :development do
      require 'sinatra/reloader'

      register Sinatra::Reloader
      also_reload './utils.rb'

      %w[/ /dashboard /registration /signup /login /logout].each do |path|
        get path do
          File.read(File.join('public', 'index.html'))
        end
      end

    end

    set :session_secret, 'tagomoris'
    set :sessions, key: 'session_xsucon', expire_after: 3600
    set :show_exceptions, false

    helpers do
      def db
        Xsuportal::Database.connection
      end

      def current_contestant(lock: false)
        @current_contestant ||= begin
          if session[:contestant_id]
            db.xquery(
              "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1#{lock ? ' FOR UPDATE' : ''}",
              session[:contestant_id],
            ).first
          else
            nil
          end
        end
      end

      def current_team(lock: false)
        @current_team ||= begin
          if current_contestant
            db.xquery(
              "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1#{lock ? ' FOR UPDATE' : ''}",
              current_contestant[:team_id],
            ).first
          else
            nil
          end
        end
      end

      def login_required(team: true, lock: false)
        unless current_contestant(lock: lock)
          Database.ensure_transaction_close
          halt_pb 401, 'ログインが必要です'
        end
        if team && !current_team(lock: lock)
          Database.ensure_transaction_close
          halt_pb 403, '参加登録が必要です'
        end
      end

      def current_contest_status
        contest = db.query(
          <<~SQL
          SELECT
            *,
            NOW(6) AS `current_time`,
            CASE
              WHEN NOW(6) < `registration_open_at` THEN 'standby'
              WHEN `registration_open_at` <= NOW(6) AND NOW(6) < `contest_starts_at` THEN 'registration'
              WHEN `contest_starts_at` <= NOW(6) AND NOW(6) < `contest_freezes_at` THEN 'started'
              WHEN `contest_freezes_at` <= NOW(6) AND NOW(6) < `contest_ends_at` THEN 'frozen'
              WHEN `contest_ends_at` <= NOW(6) THEN 'finished'
              ELSE 'unknown'
            END AS `status`
          FROM `contest_config`
          SQL
        ).first

        contest_status_str = contest[:status]
        if ENV['APP_ENV'] != :production && File.exist?(DEBUG_CONTEST_STATUS_FILE_PATH)
          contest_status_str = File.read(DEBUG_CONTEST_STATUS_FILE_PATH).chomp
        end

        status = case contest_status_str
        when 'standby'
          :STANDBY
        when 'registration'
          :REGISTRATION
        when 'started'
          :STARTED
        when 'frozen'
          :FROZEN
        when 'finished'
          :FINISHED
        else
          raise "Unexpected contest status: #{contest_status_str.inspect}"
        end

        {
          contest: {
            registration_open_at: contest[:registration_open_at],
            contest_starts_at: contest[:contest_starts_at],
            contest_freezes_at: contest[:contest_freezes_at],
            contest_ends_at: contest[:contest_ends_at],
          },
          current_time: contest[:current_time],
          status: status,
        }
      end

      def contest_status_restricted(statuses, msg)
        statuses = [statuses] unless Array === statuses
        unless statuses.include?(current_contest_status[:status])
          Database.ensure_transaction_close
          halt_pb 403, msg
        end
      end

      def contestant_pb(contestant, detail: false)
        Proto::Resources::Contestant.new(
          id: contestant[:id],
          team_id: contestant[:team_id],
          name: contestant[:name],
          is_student: contestant[:student],
        )
      end

      def team_pb(team, detail: false, enable_members: true, member_detail: false)
        members = nil

        leader_pb, members_pb = nil
        if enable_members
          if team[:leader_id]
            leader = db.xquery(
              'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1',
              team[:leader_id],
            ).first
          end
          members = db.xquery(
            'SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`',
            team[:id],
          )
          leader_pb = leader ? contestant_pb(leader, detail: member_detail) : nil
          members_pb = members ?
            members.map { |_| contestant_pb(_, detail: member_detail) } : nil
        end

        Proto::Resources::Team.new(
          id: team[:id],
          name: team[:name],
          leader_id: team[:leader_id],
          member_ids: members ? members.map { |_| _[:id] } : nil,
          final_participation: team[:final_participation],
          hidden: team[:is_hidden],
          withdrawn: team[:withdrawn],
          detail: detail ? Proto::Resources::Team::TeamDetail.new(
            email_address: team[:email_address],
            invite_token: team[:invite_token],
          ) : nil,
          leader: leader_pb,
          members: members_pb,
          student: team[:student] ? Proto::Resources::Team::StudentStatus.new(
            status: team[:student] != 0 && !!team[:student],
          ) : nil,
        )
      end

      def benchmark_job_pb(job)
        Proto::Resources::BenchmarkJob.new(
          id: job[:id],
          team_id: job[:team_id],
          status: job[:status],
          target_hostname: job[:target_hostname],
          created_at: job[:created_at],
          updated_at: job[:updated_at],
          started_at: job[:started_atj],
          finished_at: job[:finished_at],
        )
      end

      def benchmark_jobs_pb(limit:nil)
        jobs = db.xquery(
          "SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? ORDER BY `created_at` DESC#{ limit ? " LIMIT #{limit}" : ''}",
          current_team[:id],
        )
        jobs&.map { |job| benchmark_job_pb(job) }
      end

      def benchmark_result_pb(result)
        Proto::Resources::BenchmarkResult.new(
          finished: result[:finished],
          passed: result[:passed],
          score: result[:score],
          score_breakdown: result[:score_breakdown] ? Proto::Resources::BenchmarkResult::ScoreBreakdown.new(
            base: result[:score_breakdown][:base],
            deduction: result[:score_breakdown][:deduction],
          ) : nil,
          reason: result[:reason],
          stdout: result[:stdout],
          stderr: result[:stderr],
        )
      end

      def leaderboard_pb
        contest_status = current_contest_status
        frozen = contest_status[:status] == :FROZEN

        # TODO: score freeze したら自分チームのスコア以外は freeze されてるようにする
        leaderboard = db.query(
          <<~SQL
            SELECT
              `teams`.`id` AS `id`,
              `teams`.`name` AS `name`,
              `teams`.`leader_id` AS `leader_id`,
              `teams`.`final_participation` AS `final_participation`,
              `teams`.`is_hidden` AS `is_hidden`,
              `teams`.`withdrawn` AS `withdrawn`,
              `team_student_flags`.`student` AS `student`,
              (`best_score_results`.`score_raw` - `best_score_results`.`score_deduction`) AS `best_score`,
              `best_score_jobs`.`started_at` AS `best_score_started_at`,
              `best_score_results`.`marked_at` AS `best_score_marked_at`,
              (`latest_score_results`.`score_raw` - `latest_score_results`.`score_deduction`) AS `latest_score`,
              `latest_score_jobs`.`started_at` AS `latest_score_started_at`,
              `latest_score_results`.`marked_at` AS `latest_score_marked_at`
            FROM
              `teams`
              -- latest scores
              LEFT JOIN (
                SELECT
                  MAX(`r`.`id`) AS `result_id`,
                  `team_id`
                FROM
                  `benchmark_results` `r`
                  INNER JOIN `benchmark_jobs` `j` ON `j`.`latest_benchmark_result_id` = `r`.`id`
                GROUP BY
                  `team_id`
              ) `latest_result_ids` ON `latest_result_ids`.`team_id` = `teams`.`id`
              LEFT JOIN `benchmark_results` `latest_score_results` ON `latest_result_ids`.`result_id` = `latest_score_results`.`id`
              LEFT JOIN `benchmark_jobs` `latest_score_jobs` ON `latest_result_ids`.`result_id` = `latest_score_jobs`.`latest_benchmark_result_id`
              -- best scores
              LEFT JOIN (
                SELECT
                  `best_scores`.`team_id`,
                  MAX(`r2`.`id`) AS `result_id`
                FROM (
                  SELECT
                    `team_id`,
                    MAX(`r`.`score_raw` - `r`.`score_deduction`) AS `score`
                  FROM
                    `benchmark_results` `r`
                    INNER JOIN `benchmark_jobs` `j` ON `j`.`latest_benchmark_result_id` = `r`.`id`
                  GROUP BY
                    `team_id`
                ) `best_scores` LEFT JOIN `benchmark_results` `r2` ON (`r2`.`score_raw` - `r2`.`score_deduction`) = `best_scores`.`score`
                GROUP BY
                  `team_id`
                ORDER BY
                  `team_id`
              ) `best_score_result_ids` ON `best_score_result_ids`.`team_id` = `teams`.`id`
              LEFT JOIN `benchmark_results` `best_score_results` ON `best_score_result_ids`.`result_id` = `best_score_results`.`id`
              LEFT JOIN `benchmark_jobs` `best_score_jobs` ON `best_score_result_ids`.`result_id` = `best_score_jobs`.`latest_benchmark_result_id`
              -- check student teams
              LEFT JOIN (
                SELECT
                  `team_id`,
                  (SUM(`student`) = COUNT(*)) AS `student`
                FROM
                  `contestants`
                GROUP BY
                  `contestants`.`team_id`
              ) `team_student_flags` ON `team_student_flags`.`team_id` = `teams`.`id`
            ORDER BY
              `latest_score` DESC,
              `latest_score_marked_at` ASC
          SQL
        )

        team_graph_scores = {}
        db.query(
          <<~SQL
          SELECT
            `benchmark_jobs`.`team_id` AS `team_id`,
            (`benchmark_results`.`score_raw` - `benchmark_results`.`score_deduction`) AS `score`,
            `benchmark_jobs`.`started_at` AS `started_at`,
            `benchmark_results`.`marked_at` AS `marked_at`
          FROM
            `benchmark_jobs`
            LEFT JOIN `benchmark_results` ON `benchmark_jobs`.`latest_benchmark_result_id` = `benchmark_results`.`id`
          WHERE
            `score` IS NOT NULL
            AND `started_at` IS NOT NULL
            AND `marked_at` IS NOT NULL
          ORDER BY
            `benchmark_results`.`id`
          SQL
        ).each do |result|
          team_graph_scores[result[:team_id]] ||= []
          team_graph_scores[result[:team_id]] << Proto::Resources::Leaderboard::LeaderboardItem::LeaderboardScore.new(
            score: result[:score],
            started_at: result[:started_at],
            marked_at: result[:marked_at],
          )
        end

        teams = []
        general_teams = []
        student_teams = []

        leaderboard.each do |team|
          item = Proto::Resources::Leaderboard::LeaderboardItem.new(
            scores: team_graph_scores[team[:id]],
            best_score: Proto::Resources::Leaderboard::LeaderboardItem::LeaderboardScore.new(
              score: team[:best_score],
              started_at: team[:best_score_started_at],
              marked_at: team[:best_score_marked_at],
            ),
            latest_score: Proto::Resources::Leaderboard::LeaderboardItem::LeaderboardScore.new(
              score: team[:latest_score],
              started_at: team[:latest_score_started_at],
              marked_at: team[:latest_score_marked_at],
            ),
            team: team_pb(team, enable_members: false),
          )
          if team[:student] == 1
            student_teams << item
          else
            general_teams << item
          end
          teams << item
        end

        Proto::Resources::Leaderboard.new(
          teams: teams,
          general_teams: general_teams,
          student_teams: student_teams,
          progresses: [], # TODO
          frozen: frozen,
          contest_starts_at: contest_status[:contest_starts_at],
          contest_freezes_at: contest_status[:contest_freezes_at],
          contest_ends_at: contest_status[:contest_ends_at],
        )
      end

      def decode_request_pb
        cls = PB_TABLE.fetch(request.env.fetch('sinatra.route'))[0]
        cls.decode(request.body.read)
      end

      def encode_response_pb(payload={})
        cls = PB_TABLE.fetch(request.env.fetch('sinatra.route'))[1]
        content_type "application/vnd.google.protobuf; proto=#{cls.descriptor.name}"
        cls.encode(cls.new(payload))
      end

      def halt_pb(code, human_message=nil, exception:nil)
        content_type 'application/vnd.google.protobuf; proto=xsuportal.proto.Error'
        halt code, Proto::Error.encode(Proto::Error.new(
          code: code,
          name: exception ? exception.class.name : nil,
          human_message: exception ? exception.message : nil,
          human_descriptions: exception ? exception.full_message(highlight: false, order: :top).split("\n") : [human_message],
        ))
      end
    end

    error do
      err = env['sinatra.error']
      $stderr.puts err.full_message
      halt_pb 500, exception: err
    end

    post '/initialize' do
      db.query('TRUNCATE `teams`')
      db.query('TRUNCATE `contestants`')
      db.query('TRUNCATE `benchmark_jobs`')
      db.query('TRUNCATE `benchmark_results`')
      db.query('TRUNCATE `contest_config`')

      db.xquery(
        'INSERT `contestants` (`id`, `password`, `staff`, `created_at`, `updated_at`) VALUES (?, ?, TRUE, NOW(6), NOW(6))',
        ADMIN_ID,
        Digest::SHA256.hexdigest(ADMIN_PASSWORD),
      )

      db.query(
        <<~SQL,
        INSERT `contest_config` (
          `registration_open_at`,
          `contest_starts_at`,
          `contest_freezes_at`,
          `contest_ends_at`
        ) VALUES (
          TIMESTAMPADD(SECOND, 0, NOW(6)),
          TIMESTAMPADD(SECOND, 5, NOW(6)),
          TIMESTAMPADD(SECOND, 40, NOW(6)),
          TIMESTAMPADD(SECOND, 50, NOW(6))
        )
        SQL
      )

      encode_response_pb(
        # TODO: 負荷レベルの指定
        # 実装言語
        language: 'ruby',
        # 実ベンチマーカーに伝える仮想ベンチマークサーバー(gRPC)のホスト情報
        benchmark_server: {
          host: 'localhost',
          port: 50051,
        },
      )
    end

    # いらんかも
    put '/api/admin/contest' do
      req = decode_request_pb
      # TODO: admin authz
      Database.transaction do
        db.query('TRUNCATE `contest_config`')
        db.xquery(
          <<~SQL,
          INSERT `contest_config` (
            `registration_open_at`,
            `contest_starts_at`,
            `contest_freezes_at`,
            `contest_ends_at`
          ) VALUES (?, ?, ?, ?)
          SQL
          Time.at(req.contest.registration_open_at.seconds),
          Time.at(req.contest.contest_starts_at.seconds),
          Time.at(req.contest.contest_freezes_at.seconds),
          Time.at(req.contest.contest_ends_at.seconds),
        )
      end
      encode_response_pb
    end

    get '/api/contest' do
      contest_status = current_contest_status
      contest = contest_status[:contest]

      encode_response_pb(
        contest: Proto::Resources::Contest.new(
          registration_open_at: contest[:registration_open_at],
          contest_starts_at: contest[:contest_starts_at],
          contest_freezes_at: contest[:contest_freezes_at],
          contest_ends_at: contest[:contest_ends_at],
        ),
        current_time: contest_status[:current_time],
        status: contest_status[:status],
      )
    end

    get '/api/session' do
      encode_response_pb(
        contestant: current_contestant ? contestant_pb(current_contestant, detail: true) : nil,
        team: current_team ? team_pb(current_team) : nil,
        contest_status: current_contest_status[:status],
      )
    end

    get '/api/audience/teams' do
      teams = db.query('SELECT * FROM `teams` WHERE `withdrawn` = FALSE AND `disqualified` = FALSE ORDER BY `updated_at` DESC')
      items = teams.map do |team|
        members = db.xquery(
          'SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`',
          team[:id],
        )
        Proto::Services::Audience::ListTeamsResponse::TeamListItem.new(
          team_id: team[:id],
          name: team[:name],
          member_names: members.map { |_| _[:name] },
          final_participation: team[:final_participation],
          is_student: members.all? { |_| _[:student] },
        )
      end
      encode_response_pb(
        teams: items,
      )
    end

    get '/api/registration/session' do
      team = nil
      case
      when current_team
        team = current_team
      when params[:team_id] && params[:invite_token]
        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1',
          params[:team_id],
          params[:invite_token],
        ).first
        unless team
          halt_pb 404, '招待URLが無効です'
        end
      end

      members = []
      if team
        members = db.xquery(
          'SELECT * FROM `contestants` WHERE `team_id` = ?',
          team[:id],
        )
      end

      status = case
      when current_contestant&.fetch(:team_id)
        :JOINED
      when team && members.count >= 3
        :NOT_JOINABLE
      # when !team && (!Contest.registration_open? || Contest.max_teams_reached?)
      #   :CLOSED
      when !current_contestant
        :NOT_LOGGED_IN
      when team
        :JOINABLE
      when !team
        :CREATABLE
      else
        raise "undeterminable status"
      end

      encode_response_pb(
        team: team ? team_pb(team, detail: current_contestant&.fetch(:id) == current_team&.fetch(:leader_id), member_detail: true, enable_members: true) : nil,
        status: status,
        member_invite_url: team ? "/registration?team_id=#{team[:id]}&invite_token=#{team[:invite_token]}" : nil,
        invite_token: team ? team[:invite_token] : nil,
      )
    end

    post '/api/registration/team' do
      req = decode_request_pb
      result = {}

      Database.transaction do
        login_required(team: false, lock: true)
        contest_status_restricted(:REGISTRATION, 'チーム登録期間ではありません')

        invite_token = SecureRandom.urlsafe_base64(64)

        db.xquery(
          'INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`, `updated_at`) VALUES (?, ?, ?, NOW(6), NOW(6))',
          req.team_name,
          req.email_address,
          invite_token,
        )
        team_id = db.xquery('SELECT LAST_INSERT_ID() AS `id`').first&.fetch(:id)
        if !team_id
          Database.transaction_rollback
          halt_pb 500, 'チームを登録できませんでした'
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ?, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
          req.name,
          req.is_student,
          team_id,
          current_contestant[:id],
        )

        db.xquery(
          'UPDATE `teams` SET `leader_id` = ?, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
          current_contestant[:id],
          team_id,
        )

        result = { team_id: team_id }
      end

      encode_response_pb(result)
    end

    post '/api/registration/contestant' do
      req = decode_request_pb

      Database.transaction do
        login_required(team: false, lock: true)
        contest_status_restricted(:REGISTRATION, 'チーム登録期間ではありません')

        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE AND `disqualified` = FALSE LIMIT 1 FOR UPDATE',
          req.team_id,
          req.invite_token,
        ).first

        unless team
          Database.transaction_rollback
          halt_pb 400, '招待URLが不正です'
        end

        members = db.xquery(
          'SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?',
          req.team_id,
        ).first

        if members[:cnt] >= 3
          Database.transaction_rollback
          halt_pb 400, 'チーム人数の上限に達しています'
        end

        db.xquery(
          'UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ?, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
          req.team_id,
          req.name,
          req.is_student,
          current_contestant[:id],
        )
      end

      encode_response_pb
    end

    put '/api/registration' do
      req = decode_request_pb

      Database.transaction do
        login_required(lock: true)

        if current_team[:leader_id] == current_contestant[:id]
          db.xquery(
            'UPDATE `teams` SET `name` = ?, `email_address` = ?, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
            req.team_name,
            req.email_address,
            current_team[:id],
          )
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ?, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
          req.name,
          req.is_student,
          current_contestant[:id],
        )
      end

      encode_response_pb
    end

    delete '/api/registration' do
      Database.transaction do
        login_required(lock: true)
        contest_status_restricted(:REGISTRATION, 'チーム登録期間外は辞退できません')

        if current_team[:leader_id] == current_contestant[:id]
          db.xquery(
            'UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
            current_team[:id],
          )
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL, `updated_at` = NOW(6) WHERE `team_id` = ?',
            current_team[:id],
          )
        else
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL, `updated_at` = NOW(6) WHERE `id` = ? LIMIT 1',
            current_contestant[:id],
          )
        end
      end
      encode_response_pb
    end

    post '/api/contestant/benchmark_jobs' do
      req = decode_request_pb

      Database.transaction do
        login_required
        contest_status_restricted([:STARTED, :FROZEN], '競技時間外はベンチマークを実行できません')

        db.xquery(
          'INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))',
          current_team[:id],
          req.target_hostname,
          Proto::Resources::BenchmarkJob::Status::PENDING,
        )
      end
      encode_response_pb
    end

    get '/api/contestant/benchmark_jobs' do
      login_required

      encode_response_pb(
        jobs: benchmark_jobs_pb,
      )
    end

    get '/api/contestant/benchmark_jobs/:id' do
      login_required

      job = db.xquery(
        'SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? AND `id` = ? LIMIT 1',
        current_team[:id],
        params[:id],
      ).first

      unless job
        halt_pb 404, 'ベンチマークジョブが見つかりません'
      end

      result = db.xquery(
        <<~SQL,
          SELECT r.* FROM `benchmark_results` r
          RIGHT JOIN `benchmark_jobs` j ON j.`latest_benchmark_result_id` = r.id
          WHERE r.benchmark_job_id = ? AND j.team_id = ?
          LIMIT 1
        SQL
        params[:id],
        current_team[:id],
      ).first

      encode_response_pb(
        job: benchmark_job_pb(job),
        result: result ? benchmark_result_pb(result) : nil,
      )
    end

    get '/api/contestant/dashboard' do
      login_required

      encode_response_pb(
        leaderboard: leaderboard_pb,
        jobs: benchmark_jobs_pb(limit: 5),
      )
    end

    post '/api/signup' do
      req = decode_request_pb
      result = nil

      begin
        db.xquery(
          'INSERT INTO `contestants` (`id`, `password`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))',
          req.contestant_id,
          Digest::SHA256.hexdigest(req.password)
        )
        session[:contestant_id] = req.contestant_id
      rescue Mysql2::Error => e
        if e.errno == MYSQL_ER_DUP_ENTRY
          halt_pb 400, 'IDが既に登録されています'
        else
          halt_pb 500, exception: e
        end
      end

      encode_response_pb
    end

    post '/api/login' do
      req = decode_request_pb

      contestant = db.xquery(
        'SELECT `password` FROM `contestants` WHERE `id` = ? LIMIT 1',
        req.contestant_id,
      ).first

      if contestant && Rack::Utils.secure_compare(contestant[:password], Digest::SHA256.hexdigest(req.password))
        session[:contestant_id] = req.contestant_id
      else
        halt_pb 400, 'ログインIDまたはパスワードが正しくありません'
      end

      encode_response_pb
    end

    post '/api/logout' do
      req = decode_request_pb

      if session[:contestant_id]
        session.delete(:contestant_id)
      else
        halt_pb 401, 'ログインしていません'
      end

      encode_response_pb
    end
  end
end
