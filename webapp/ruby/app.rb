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

      Database.transaction do
        invite_token = SecureRandom.urlsafe_base64(64)

        unless current_contestant(lock: true)
          Database.transaction_rollback
          halt_pb 401, 'ログインが必要です'
        end

        db.xquery(
          'INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`, `updated_at`) VALUES (?, ?, ?, NOW(), NOW())',
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

      Database.transaction do
        unless current_contestant
          Database.transaction_rollback
          halt_pb 401, 'ログインが必要です'
        end

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

      Database.transaction do

        unless current_contestant(lock: true)
          Database.transaction_rollback
          halt_pb 401, 'ログインが必要です'
        end
        unless current_team(lock: true)
          Database.transaction_rollback
          halt_pb 400, '参加登録されていません'
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
      Database.transaction do
        unless current_contestant(lock: true)
          Database.transaction_rollback
          halt_pb 401, 'ログインが必要です'
        end
        unless current_team(lock: true)
          Database.transaction_rollback
          halt_pb 400, 'チームに所属していません'
        end

        if current_team[:leader_id] == current_contestant[:id]
          db.xquery(
            'UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
            current_team[:id],
          )
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL, `updated_at` = NOW() WHERE `team_id` = ?',
            current_team[:id],
          )
        else
          db.xquery(
            'UPDATE `contestants` SET `team_id` = NULL, `updated_at` = NOW() WHERE `id` = ? LIMIT 1',
            current_contestant[:id],
          )
        end
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
        content_type 'application/vnd.google.protobuf; proto=xsuportal.proto.Error'
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
