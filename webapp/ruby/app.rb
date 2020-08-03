require 'sinatra/base'
require 'google/protobuf'
require 'digest/sha2'
require 'securerandom'
require 'mysql2'
require 'mysql2-cs-bind'

$LOAD_PATH << File.join(File.expand_path('../', __FILE__), 'lib')
require 'routes'

module Xsuportal
  class App < Sinatra::Base
    include Xsuportal::Routes

    MYSQL_ER_DUP_ENTRY = 1062

    configure :development do
      require 'sinatra/reloader'

      register Sinatra::Reloader
      also_reload './utils.rb'

      %w[/ /registration /signup /login /logout].each do |path|
        get path do
          File.read(File.join('public', 'index.html'))
        end
      end

    end

    set :session_secret, 'tagomoris'
    set :sessions, key: 'session_xsucon', expire_after: 3600

    helpers do
      def db
        Thread.current[:db] ||= Mysql2::Client.new(
          host: ENV['MYSQL_HOSTNAME'] || '127.0.0.1',
          port: ENV['MYSQL_PORT'] || '3306',
          username: ENV['MYSQL_USER'] || 'xsuportal',
          database: ENV['MYSQL_DATABASE'] || 'xsuportal',
          password: ENV['MYSQL_PASSWORD'] || 'xsuportal',
          charset: 'utf8mb4',
          database_timezone: :local,
          cast_booleans: true,
          symbolize_keys: true,
          reconnect: true,
        )
      end

      def db_ensure_transaction_close
        if Thread.current[:db_transaction] == :open
          db_transaction_rollback
        end
      end

      def db_transaction_begin
        db.query('BEGIN')
        Thread.current[:db_transaction] = :open
      end

      def db_transaction_commit
        db.query('COMMIT')
        Thread.current[:db_transaction] = nil
      end

      def db_transaction_rollback
        db.query('ROLLBACK')
        Thread.current[:db_transaction] = nil
      end

      def db_transaction
        begin
          db_transaction_begin
          yield
          db_transaction_commit
        rescue => e
          db_transaction_rollback
          puts e.full_message
          halt_pb 500, {
            name: e.class.to_s,
            human_message: e.to_s,
          }
        ensure
          db_ensure_transaction_close
        end
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

      def contestant_pb(contestant, detail: false)
        Proto::Resources::Contestant.new(
          id: contestant[:id],
          team_id: contestant[:team_id],
          name: contestant[:name],
          is_student: contestant[:student],
        )
      end

      def team_pb(team, detail: false, enable_members: true, member_detail: false)
        leader = nil
        members = nil
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
        leader_pb = enable_members && leader ? contestant_pb(leader, detail: member_detail) : nil
        members_pb = enable_members && members ?
          members.map { |_| contestant_pb(_, detail: member_detail) } : nil

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
            benchmark_target_id: 0, # TODO:
            invite_token: team[:invite_token],
          ) : nil,
          leader: leader_pb,
          members: members_pb,
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

      def halt_pb(code, name:nil, human_message:nil, human_descriptions:[])
        content_type 'application/vnd.google.protobuf; proto=isuxportal.proto.Error'
        halt code, Proto::Error.encode(Proto::Error.new(
          code: code,
          name: name,
          human_message: human_message,
          human_descriptions: human_descriptions,
        ))
      end
    end

    post '/initialize' do
      db.query('TRUNCATE `teams`')
      db.query('TRUNCATE `contestants`')

      encode_response_pb(
        # TODO: 負荷レベルの指定
        # 実装言語
        language: 'ruby',
      )
    end

    get '/api/session' do
      encode_response_pb(
        contestant: current_contestant ? contestant_pb(current_contestant, detail: true) : nil,
        team: current_team ? team_pb(current_team) : nil,
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
          is_student: team[:student],
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
          halt_pb 404, {
            human_descriptions: ['招待URLが無効です'],
          }
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
        Proto::Services::Registration::GetRegistrationSessionResponse::Status::JOINED
      when team && members.count >= 3
        Proto::Services::Registration::GetRegistrationSessionResponse::Status::NOT_JOINABLE
      # when !team && (!Contest.registration_open? || Contest.max_teams_reached?)
      #   Proto::Services::Registration::GetRegistrationSessionResponse::Status::CLOSED
      when !current_contestant
        Proto::Services::Registration::GetRegistrationSessionResponse::Status::NOT_LOGGED_IN
      when team
        Proto::Services::Registration::GetRegistrationSessionResponse::Status::JOINABLE
      when !team
        Proto::Services::Registration::GetRegistrationSessionResponse::Status::CREATABLE
      else
        raise "undeterminable status"
      end
  
      encode_response_pb(
        team: team ? team_pb(team, detail: current_contestant&.fetch(:id) == current_team&.fetch(:leader_id), member_detail: true, enable_members: true) : nil,
        status: status,
        member_invite_url: team ? "/registration?team_id=#{team[:id]}&invite_token=#{team[:invite_token]}" : nil,
      )
    end

    post '/api/registration/team' do
      req = decode_request_pb
      result = {}

      db_transaction do
        invite_token = SecureRandom.urlsafe_base64(64)

        unless current_contestant(lock: true)
          db_transaction_rollback
          halt 401, 'ログインが必要です'
        end

        db.xquery(
          'INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`, `updated_at`) VALUES (?, ?, ?, NOW(), NOW())',
          req.team_name,
          req.email_address,
          invite_token,
        )
        team_id = db.xquery('SELECT LAST_INSERT_ID() AS `id`').first&.fetch(:id)
        if !team_id
          db_transaction_rollback
          halt 500, 'チームを登録できませんでした'
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ?, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
          req.name,
          req.is_student,
          team_id,
          current_contestant[:id],
        )

        db.xquery(
          'UPDATE `teams` SET `leader_id` = ?, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
          current_contestant[:id],
          team_id,
        )

        result = { team_id: team_id }
      end

      encode_response_pb(result)
    end

    post '/api/registration/contestant' do
      req = decode_request_pb

      db_transaction do
        unless current_contestant
          db_transaction_rollback
          halt_pb 401, human_message: 'ログインが必要です'
        end

        team = db.xquery(
          'SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE AND `disqualified` = FALSE LIMIT 1 FOR UPDATE',
          req.team_id,
          req.invite_token,
        ).first

        unless team
          db_transaction_rollback
          halt_pb 400, human_message: '招待URLが不正です'
        end

        members = db.xquery(
          'SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?',
          req.team_id,
        ).first

        if members[:cnt] >= 3
          db_transaction_rollback
          halt_pb 400, human_message: 'チーム人数の上限に達しています'
        end

        db.xquery(
          'UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ?, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
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

      db_transaction do

        unless current_contestant(lock: true)
          db_transaction_rollback
          halt_pb 401, human_message: 'ログインが必要です'
        end
        unless current_team(lock: true)
          db_transaction_rollback
          halt_pb 400, human_message: '参加登録されていません'
        end

        if current_team[:leader_id] == current_contestant[:id]
          db.xquery(
            'UPDATE `teams` SET `name` = ?, `email_address` = ?, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
            req.team_name,
            req.email_address,
            current_team[:id],
          )
        end

        db.xquery(
          'UPDATE `contestants` SET `name` = ?, `student` = ?, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
          req.name,
          req.is_student,
          current_contestant[:id],
        )
      end

      encode_response_pb
    end

    delete '/api/registration' do
      db_transaction do
        unless current_contestant(lock: true)
          db_transaction_rollback
          halt_pb 401, human_message: 'ログインが必要です'
        end
        unless current_team(lock: true)
          db_transaction_rollback
          halt_pb 400, human_message: 'チームに所属していません'
        end

        if current_team[:leader_id] == current_contestant[:id]
          db.xquery(
            'UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
            current_team[:id],
          )
        end

        db.xquery(
          'UPDATE `contestants` SET `team_id` = NULL, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
          current_contestant[:id],
        )
      end
      encode_response_pb
    end

    post '/api/signup' do
      req = decode_request_pb
      result = nil

      begin
        db.xquery(
          'INSERT INTO `contestants` (`id`, `password`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())',
          req.contestant_id,
          Digest::SHA256.hexdigest(req.password)
        )
        session[:contestant_id] = req.contestant_id
      rescue Mysql2::Error => e
        if e.errno == MYSQL_ER_DUP_ENTRY
          halt 400, 'IDが既に登録されています'
        else
          halt 500, e.full_message
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
        halt 400, 'ログインIDまたはパスワードが正しくありません'
      end
      
      encode_response_pb
    end

    post '/api/logout' do
      req = decode_request_pb

      if session[:contestant_id]
        session.delete(:contestant_id)
      else
        halt 401, 'ログインしていません'
      end
      
      encode_response_pb
    end
  end
end
