require 'sinatra/base'
require 'google/protobuf'
require 'digest/sha2'
require 'securerandom'

$LOAD_PATH << File.join(File.expand_path('../', __FILE__), 'lib')
require 'routes'
require 'database'
require 'notifier'

module Xsuportal
  class App < Sinatra::Base
    include Xsuportal::Routes

    TEAM_CAPACITY = 10
    MYSQL_ER_DUP_ENTRY = 1062
    ADMIN_ID = 'admin'
    ADMIN_PASSWORD = 'admin'
    DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS'

    configure :development do
      require 'sinatra/reloader'

      register Sinatra::Reloader
      also_reload './utils.rb'

    end

    %w[/ /registration /signup /login /logout /teams].each do |path|
      get path do
        File.read(File.join('public', 'audience.html'))
      end
    end

    %w[/contestant /contestant/benchmark_jobs /contestant/benchmark_jobs/:id /contestant/clarifications].each do |path|
      get path do
        File.read(File.join('public', 'contestant.html'))
      end
    end

    %w[/admin /admin/ /admin/clarifications /admin/clarifications/:id].each do |path|
      get path do
        File.read(File.join('public', 'admin.html'))
      end
    end

    set :session_secret, 'tagomoris'
    set :sessions, key: 'session_xsucon', expire_after: 3600
    set :show_exceptions, false

    helpers do
      def db
        Xsuportal::Database.connection
      end

      def notifier
        Thread.current[:notifier] ||= Notifier.new(db)
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
          halt_pb 401, 'ログインが必要です'
        end
        if team && !current_team(lock: lock)
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
              WHEN `contest_starts_at` <= NOW(6) AND NOW(6) < `contest_ends_at` THEN 'started'
              WHEN `contest_ends_at` <= NOW(6) THEN 'finished'
              ELSE 'unknown'
            END AS `status`,
            IF(`contest_starts_at` <= NOW(6) AND NOW(6) < `contest_freezes_at`, 1, 0) AS `frozen`
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
            frozen: contest[:frozen] == 1,
            status: status,
          },
          current_time: contest[:current_time],
        }
      end

      def contest_pb
        Proto::Resources::Contest.new(current_contest_status[:contest])
      end

      def contest_status_restricted(statuses, msg)
        statuses = [statuses] unless Array === statuses
        unless statuses.include?(current_contest_status[:contest][:status])
          halt_pb 403, msg
        end
      end

      def contestant_pb(contestant)
        Proto::Resources::Contestant.new(
          id: contestant[:id],
          team_id: contestant[:team_id],
          name: contestant[:name],
          is_student: contestant[:student],
          is_staff: contestant[:staff],
        )
      end

      def team_pb(team, detail: false, enable_members: true)
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
          leader_pb = leader ? contestant_pb(leader) : nil
          members_pb = members ?
            members.map { |_| contestant_pb(_) } : nil
        end

        Proto::Resources::Team.new(
          id: team[:id],
          name: team[:name],
          leader_id: team[:leader_id],
          member_ids: members ? members.map { |_| _[:id] } : nil,
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
          started_at: job[:started_at],
          finished_at: job[:finished_at],
          result: job[:finished_at] ? benchmark_result_pb(job) : nil
        )
      end

      def benchmark_jobs_pb(limit:nil)
        jobs = db.xquery(
          "SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? ORDER BY `created_at` DESC #{ limit ? "LIMIT #{limit}" : ''}",
          current_team[:id],
        )
        jobs&.map { |job| benchmark_job_pb(job) }
      end

      def benchmark_result_pb(job)
        has_score = job[:score_raw] && job[:score_deduction]
        Proto::Resources::BenchmarkResult.new(
          finished: !!job[:finished_at],
          passed: job[:passed],
          score: has_score ? (job[:score_raw] - job[:score_deduction]) : nil,
          score_breakdown: has_score ? Proto::Resources::BenchmarkResult::ScoreBreakdown.new(
            raw: job[:score_raw],
            deduction: job[:score_deduction],
          ) : nil,
          reason: job[:reason],
        )
      end

      def leaderboard_pb(team_id:0)
        contest = current_contest_status[:contest]
        contest_finished = contest[:status] == :FINISHED
        contest_freezes_at = contest[:contest_freezes_at]

        leaderboard = nil
        job_results = nil
        team_graph_scores = {}
        Database.transaction('leaderboard_pb') do
          leaderboard = db.xquery(
            <<~SQL,
              SELECT
                `teams`.`id` AS `id`,
                `teams`.`name` AS `name`,
                `teams`.`leader_id` AS `leader_id`,
                `teams`.`withdrawn` AS `withdrawn`,
                `team_student_flags`.`student` AS `student`,
                (`best_score_jobs`.`score_raw` - `best_score_jobs`.`score_deduction`) AS `best_score`,
                `best_score_jobs`.`started_at` AS `best_score_started_at`,
                `best_score_jobs`.`finished_at` AS `best_score_marked_at`,
                (`latest_score_jobs`.`score_raw` - `latest_score_jobs`.`score_deduction`) AS `latest_score`,
                `latest_score_jobs`.`started_at` AS `latest_score_started_at`,
                `latest_score_jobs`.`finished_at` AS `latest_score_marked_at`,
                `latest_score_job_ids`.`finish_count` AS `finish_count`
              FROM
                `teams`
                -- latest scores
                LEFT JOIN (
                  SELECT
                    MAX(`id`) AS `id`,
                    `team_id`,
                    COUNT(*) AS `finish_count`
                  FROM
                    `benchmark_jobs`
                  WHERE
                    `finished_at` IS NOT NULL
                    -- score freeze
                    AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                  GROUP BY
                    `team_id`
                ) `latest_score_job_ids` ON `latest_score_job_ids`.`team_id` = `teams`.`id`
                LEFT JOIN `benchmark_jobs` `latest_score_jobs` ON `latest_score_job_ids`.`id` = `latest_score_jobs`.`id`
                -- best scores
                LEFT JOIN (
                  SELECT
                    MAX(`j`.`id`) AS `id`,
                    `j`.`team_id` AS `team_id`
                  FROM
                    (
                      SELECT
                        `team_id`,
                        MAX(`score_raw` - `score_deduction`) AS `score`
                      FROM
                        `benchmark_jobs`
                      WHERE
                        `finished_at` IS NOT NULL
                        -- score freeze
                        AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                      GROUP BY
                        `team_id`
                    ) `best_scores`
                    LEFT JOIN `benchmark_jobs` `j` ON (`j`.`score_raw` - `j`.`score_deduction`) = `best_scores`.`score`
                      AND `j`.`team_id` = `best_scores`.`team_id`
                  GROUP BY
                    `j`.`team_id`
                ) `best_score_job_ids` ON `best_score_job_ids`.`team_id` = `teams`.`id`
                LEFT JOIN `benchmark_jobs` `best_score_jobs` ON `best_score_jobs`.`id` = `best_score_job_ids`.`id`
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
            team_id, team_id, contest_finished, contest_freezes_at,
            team_id, team_id, contest_finished, contest_freezes_at,
          )

          job_results = db.xquery(
            <<~SQL,
              SELECT
                `team_id` AS `team_id`,
                (`score_raw` - `score_deduction`) AS `score`,
                `started_at` AS `started_at`,
                `finished_at` AS `finished_at`
              FROM
                `benchmark_jobs`
              WHERE
                `started_at` IS NOT NULL
                AND (
                  `finished_at` IS NOT NULL
                  -- score freeze
                  AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))
                )
              ORDER BY
                `finished_at`
            SQL
            team_id, team_id, contest_finished, contest_freezes_at,
          )
        end

        job_results.each do |result|
          team_graph_scores[result[:team_id]] ||= []
          team_graph_scores[result[:team_id]] << Proto::Resources::Leaderboard::LeaderboardItem::LeaderboardScore.new(
            score: result[:score],
            started_at: result[:started_at],
            marked_at: result[:finished_at],
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
            finish_count: team[:finish_count],
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
          contest: contest_pb,
        )
      end

      def clarification_pb(clar, team)
        Proto::Resources::Clarification.new(
          id: clar[:id],
          team_id: clar[:team_id],
          answered: !!clar[:answered_at],
          disclosed: clar[:disclosed],
          question: clar[:question],
          answer: clar[:answer],
          created_at: clar[:created_at],
          answered_at: clar[:answered_at],
          team: team_pb(team),
        )
      end

      def notifications_pb(notifications)
        notifications.map do |notification|
          message = Proto::Resources::Notification.decode(notification[:encoded_message].unpack1('m0'))
          message.id = notification[:id]
          message.created_at = notification[:created_at]
          message
        end
      end

      def decode_request_pb
        cls = PB_TABLE.fetch(request.env.fetch('sinatra.route'))[0]
        cls.decode(request.body.read)
      end

      def encode_response_pb(payload={})
        cls = PB_TABLE.fetch(request.env.fetch('sinatra.route'))[1]
        content_type "application/vnd.google.protobuf"
        cls.encode(cls.new(payload))
      end

      def halt_pb(code, human_message=nil, exception:nil)
        Database.transaction_rollback if Database.transaction?
        content_type 'application/vnd.google.protobuf; proto=xsuportal.proto.Error'
        halt code, Proto::Error.encode(Proto::Error.new(
          code: code,
          name: exception ? exception.class.name : nil,
          human_message: human_message || exception&.message,
          human_descriptions: human_message ? [human_message] : exception&.full_message(highlight: false, order: :top)&.split("\n") || [],
        ))
      end
    end

    error do
      err = env['sinatra.error']
      $stderr.puts err.full_message
      halt_pb 500, exception: err
    end

    post '/initialize' do
      req = decode_request_pb

      db.query('TRUNCATE `teams`')
      db.query('TRUNCATE `contestants`')
      db.query('TRUNCATE `benchmark_jobs`')
      db.query('TRUNCATE `clarifications`')
      db.query('TRUNCATE `notifications`')
      db.query('TRUNCATE `push_subscriptions`')
      db.query('TRUNCATE `contest_config`')

      db.xquery(
        'INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))',
        ADMIN_ID,
        Digest::SHA256.hexdigest(ADMIN_PASSWORD),
      )

      if req.contest
        db.xquery(
          <<~SQL,
          INSERT `contest_config` (
            `registration_open_at`,
            `contest_starts_at`,
            `contest_freezes_at`,
            `contest_ends_at`
          ) VALUES (?, ?, ?, ?)
          SQL
          Time.at(req.contest.registration_open_at.seconds, req.contest.registration_open_at.nanos / 1000, in: 'UTC'),
          Time.at(req.contest.contest_starts_at.seconds, req.contest.contest_starts_at.nanos / 1000, in: 'UTC'),
          Time.at(req.contest.contest_freezes_at.seconds, req.contest.contest_freezes_at.nanos / 1000, in: 'UTC'),
          Time.at(req.contest.contest_ends_at.seconds, req.contest.contest_ends_at.nanos / 1000, in: 'UTC'),
        )
      else
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
      end

      encode_response_pb(
        # 実装言語
        language: 'ruby',
        # 実ベンチマーカーに伝える仮想ベンチマークサーバー(gRPC)のホスト情報
        benchmark_server: {
          host: ENV.fetch('BENCHMARK_SERVER_HOST', 'localhost'),
          port: ENV.fetch('BENCHMARK_SERVER_PORT', '50051').to_i,
        },
      )
    end

    get '/api/admin/clarifications' do
      login_required(team: false)
      unless current_contestant[:staff]
        halt_pb 403, '管理者権限が必要です'
      end

      clars = db.xquery(
        'SELECT * FROM `clarifications` ORDER BY `updated_at` DESC',
      )

      clar_pbs = clars.map do |clar|
        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
          clar[:team_id],
        ).first
        clarification_pb(clar, team)
      end

      encode_response_pb(
        clarifications: clar_pbs,
      )
    end

    get '/api/admin/clarifications/:id' do
      login_required(team: false)
      unless current_contestant[:staff]
        halt_pb 403, '管理者権限が必要です'
      end

      clar = db.xquery(
        'SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1',
        params[:id],
      ).first

      team = db.xquery(
        'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
        clar[:team_id],
      ).first

      encode_response_pb(
        clarification: clarification_pb(clar, team)
      )
    end

    put '/api/admin/clarifications/:id' do
      login_required(team: false)
      unless current_contestant[:staff]
        halt_pb 403, '管理者権限が必要です'
      end

      req = decode_request_pb

      clar = nil
      updated = nil
      clar_pb = nil
      Database.transaction do
        clar_before = db.xquery(
          'SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1 FOR UPDATE',
          params[:id],
        ).first

        unless clar_before
          halt_pb 404, '質問が見つかりません'
        end
        was_answered = !!clar_before[:answered_at]
        was_disclosed = clar_before[:disclosed]

        db.xquery(
          <<~SQL,
            UPDATE `clarifications` SET
              `disclosed` = ?,
              `answer` = ?,
              `updated_at` = NOW(6),
              `answered_at` = NOW(6)
            WHERE `id` = ?
            LIMIT 1
          SQL
          req.disclose,
          req.answer,
          params[:id],
        )

        clar = db.xquery(
          'SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1',
          params[:id],
        ).first

        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
          clar[:team_id],
        ).first

        clar_pb = clarification_pb(clar, team)
        updated = was_answered && was_disclosed == clar[:disclosed]
      end
      notifier.notify_clarification_answered(clar, updated: updated)

      encode_response_pb(
        clarification: clar_pb
      )
    end

    get '/api/session' do
      encode_response_pb(
        contestant: current_contestant ? contestant_pb(current_contestant) : nil,
        team: current_team ? team_pb(current_team) : nil,
        contest: contest_pb,
        push_vapid_key: notifier.vapid_key&.public_key_for_push_header,
      )
    end

    get '/api/audience/teams' do
      teams = db.query('SELECT * FROM `teams` WHERE `withdrawn` = FALSE ORDER BY `created_at` DESC')
      items = teams.map do |team|
        members = db.xquery(
          'SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`',
          team[:id],
        )
        Proto::Services::Audience::ListTeamsResponse::TeamListItem.new(
          team_id: team[:id],
          name: team[:name],
          member_names: members.map { |_| _[:name] },
          is_student: members.all? { |_| _[:student] },
        )
      end
      encode_response_pb(
        teams: items,
      )
    end

    get '/api/audience/dashboard' do
      encode_response_pb(
        leaderboard: leaderboard_pb,
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
        team: team ? team_pb(team, detail: current_contestant&.fetch(:id) == current_team&.fetch(:leader_id), enable_members: true) : nil,
        status: status,
        member_invite_url: team ? "/registration?team_id=#{team[:id]}&invite_token=#{team[:invite_token]}" : nil,
        invite_token: team ? team[:invite_token] : nil,
      )
    end

    post '/api/registration/team' do
      req = decode_request_pb
      result = {}

      login_required(team: false)
      contest_status_restricted(:REGISTRATION, 'チーム登録期間ではありません')

      begin
        db.query('LOCK TABLES `teams` WRITE, `contestants` WRITE')
        invite_token = SecureRandom.urlsafe_base64(64)

        within_capacity = db.xquery('SELECT COUNT(*) < ? AS `within_capacity` FROM `teams`', TEAM_CAPACITY).first
        if within_capacity&.fetch(:within_capacity) != 1
          halt_pb 403, "チーム登録数上限です"
        end

        db.xquery(
          'INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`) VALUES (?, ?, ?, NOW(6))',
          req.team_name,
          req.email_address,
          invite_token,
        )
        team_id = db.xquery('SELECT LAST_INSERT_ID() AS `id`').first&.fetch(:id)
        if !team_id
          halt_pb 500, 'チームを登録できませんでした'
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ? WHERE `id` = ? LIMIT 1',
          req.name,
          req.is_student,
          team_id,
          current_contestant[:id],
        )

        db.xquery(
          'UPDATE `teams` SET `leader_id` = ? WHERE `id` = ? LIMIT 1',
          current_contestant[:id],
          team_id,
        )

        result = { team_id: team_id }
      ensure
        db.query('UNLOCK TABLES')
      end

      encode_response_pb(result)
    end

    post '/api/registration/contestant' do
      req = decode_request_pb

      Database.transaction do
        login_required(team: false, lock: true)
        contest_status_restricted(:REGISTRATION, 'チーム登録期間ではありません')

        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1 FOR UPDATE',
          req.team_id,
          req.invite_token,
        ).first

        unless team
          halt_pb 400, '招待URLが不正です'
        end

        members = db.xquery(
          'SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?',
          req.team_id,
        ).first

        if members[:cnt] >= 3
          halt_pb 400, 'チーム人数の上限に達しています'
        end

        db.xquery(
          'UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1',
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
            'UPDATE `teams` SET `name` = ?, `email_address` = ? WHERE `id` = ? LIMIT 1',
            req.team_name,
            req.email_address,
            current_team[:id],
          )
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1',
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
            'UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL WHERE `id` = ? LIMIT 1',
            current_team[:id],
          )
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL WHERE `team_id` = ?',
            current_team[:id],
          )
        else
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL WHERE `id` = ? LIMIT 1',
            current_contestant[:id],
          )
        end
      end
      encode_response_pb
    end

    post '/api/contestant/benchmark_jobs' do
      req = decode_request_pb

      job = nil

      Database.transaction do
        login_required
        contest_status_restricted([:STARTED], '競技時間外はベンチマークを実行できません')

        job_count = db.xquery(
          'SELECT COUNT(*) AS `cnt` FROM `benchmark_jobs` WHERE `team_id` = ? AND `finished_at` IS NULL',
          current_team[:id],
        ).first

        if job_count && job_count[:cnt] > 0
          halt_pb 403, '既にベンチマークを実行中です'
        end

        db.xquery(
          'INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))',
          current_team[:id],
          req.target_hostname,
          Proto::Resources::BenchmarkJob::Status::PENDING,
        )

        job = db.query('SELECT * FROM `benchmark_jobs` WHERE `id` = (SELECT LAST_INSERT_ID()) LIMIT 1').first
      end

      encode_response_pb(
        job: benchmark_job_pb(job)
      )
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

      encode_response_pb(
        job: benchmark_job_pb(job),
      )
    end

    get '/api/contestant/clarifications' do
      login_required

      clars = db.xquery(
        'SELECT * FROM `clarifications` WHERE `team_id` = ? OR `disclosed` = TRUE ORDER BY `id` DESC',
        current_team[:id],
      )

      clar_pbs = clars.map do |clar|
        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
          clar[:team_id],
        ).first
        clarification_pb(clar, team)
      end

      encode_response_pb(
        clarifications: clar_pbs,
      )
    end

    post '/api/contestant/clarifications' do
      login_required

      req = decode_request_pb

      clar = nil
      Database.transaction do
        db.xquery(
          'INSERT INTO `clarifications` (`team_id`, `question`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))',
          current_team[:id],
          req.question,
        )
        clar = db.query('SELECT * FROM `clarifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1').first
      end

      encode_response_pb(
        clarification: clarification_pb(clar, current_team)
      )
    end

    get '/api/contestant/dashboard' do
      login_required

      encode_response_pb(
        leaderboard: leaderboard_pb(team_id: current_team[:id]),
      )
    end

    get '/api/contestant/notifications' do
      login_required

      after = params[:after]
      notifications = nil

      Database.transaction do
        if after
          notifications = db.xquery(
            'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `id` > ? ORDER BY `id`',
            current_contestant[:id],
            after,
          )
        else
          notifications = db.xquery(
            'SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `read` = FALSE ORDER BY `id`',
            current_contestant[:id],
          )
        end

        db.xquery(
          'UPDATE `notifications` SET `read` = TRUE WHERE `contestant_id` = ? AND `read` = FALSE',
          current_contestant[:id],
        )
      end

      last_answered_clar = db.xquery(
        'SELECT `id` FROM `clarifications` WHERE (`team_id` = ? OR `disclosed` = TRUE) AND `answered_at` IS NOT NULL ORDER BY `id` DESC LIMIT 1',
        current_team[:id]
      ).first

      last_answered_clar_id = last_answered_clar ? last_answered_clar[:id] : nil

      encode_response_pb(
        last_answered_clarification_id: last_answered_clar_id,
        notifications: notifications_pb(notifications),
      )
    end

    post '/api/contestant/push_subscriptions' do
      login_required

      unless notifier.vapid_key
        halt_pb 503, 'Web Push は未対応です'
      end

      req = decode_request_pb

      db.xquery(
        'INSERT INTO `push_subscriptions` (`contestant_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, NOW(6), NOW(6))',
        current_contestant[:id],
        req.endpoint,
        req.p256dh,
        req.auth,
      )

      encode_response_pb
    end

    delete '/api/contestant/push_subscriptions' do
      login_required

      unless notifier.vapid_key
        halt_pb 503, 'Web Push は未対応です'
      end

      req = decode_request_pb

      db.xquery(
        'DELETE FROM `push_subscriptions` WHERE `contestant_id` = ? AND `endpoint` = ? LIMIT 1',
        current_contestant[:id],
        req.endpoint,
      )

      encode_response_pb
    end

    post '/api/signup' do
      req = decode_request_pb

      begin
        db.xquery(
          'INSERT INTO `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, FALSE, NOW(6))',
          req.contestant_id,
          Digest::SHA256.hexdigest(req.password)
        )
        session[:contestant_id] = req.contestant_id
      rescue Mysql2::Error => e
        if e.errno == MYSQL_ER_DUP_ENTRY
          halt_pb 400, 'IDが既に登録されています'
        else
          raise e
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
      if session[:contestant_id]
        session.delete(:contestant_id)
      else
        halt_pb 401, 'ログインしていません'
      end

      encode_response_pb
    end
  end
end
