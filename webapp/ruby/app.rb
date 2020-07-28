require 'sinatra/base'
require 'google/protobuf'
require 'digest/sha2'
require 'mysql2'
require 'mysql2-cs-bind'
$LOAD_PATH << File.join(File.expand_path('../', __FILE__), 'lib')
Dir.chdir('lib') do
  Dir.glob('**/*_pb.rb').each {|f| require f }
end

module Xsuportal
  class App < Sinatra::Base
    MYSQL_ER_DUP_ENTRY = 1062

    configure :development do
      require 'sinatra/reloader'

      register Sinatra::Reloader
      also_reload './utils.rb'

      %w[/ /registration /signup /login].each do |path|
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

      def decode_request(request_class)
        request_class.decode(request.body.read)
      end

      def encode_response(response_class, payload={})
        response_class.encode(response_class.new(payload))
      end

      def current_contestant
        @current_contestant ||= begin
          if session[:contestant_id]
            db.xquery(
              'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1',
              session[:contestant_id],
            ).first
          else
            nil
          end
        end
      end

      def current_team
        @current_team ||= begin
          if current_contestant
            db.xquery(
              'SELECT * FROM `teams` WHERE `id` = ? LIMIT 1',
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
          contestant_detail: !detail ? nil : Proto::Resources::Contestant::ContestantDetail.new(
            avatar_url: contestant[:avatar_url],
            is_student: contestant[:student],
          ),
        )
      end

      def team_pb(team, detail: false, enable_members: true, member_detail: false)
        leader = db.xquery(
          'SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1',
          team[:leader_id],
        ).first
        members = db.xquery(
          'SELECT * FROM `contestants` WHERE `team_id` = ? AND `id` != ? LIMIT 1',
          team[:id],
          team[:leader_id],
        )
        leader_pb = enable_members ? contestant_pb(leader, detail: member_detail) : nil
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
          detail: !detail ? nil : Proto::Resources::Team::TeamDetail.new(
            email_address: team[:email_address],
            benchmark_target_id: 0, # TODO:
            invite_token: team[:invite_token],
          ),
          leader: leader_pb,
          members: members_pb,
        )
      end
    end

    get '/api/session' do
      detail = false # TODO:
      encode_response Proto::Services::Common::GetCurrentSessionResponse, {
        contestant: current_contestant ? contestant_pb(current_contestant) : nil,
        team: current_team ? team_pb(current_team) : nil,
      }
    end

    get '/api/audience/teams' do
      encode_response Proto::Resources::Team
    end

    get '/api/registration/session' do
      encode_response(
        Proto::Services::Registration::GetRegistrationSessionResponse, {
          status: :CREATABLE,
        }
      )
    end

    get '/api/registration/team' do
    end

    post '/api/signup' do
      req = decode_request Proto::Services::Account::SignupRequest
      result = nil

      begin
        db.xquery(
          'INSERT INTO `contestants` (`id`, `password`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())',
          req.contestant_id,
          Digest::SHA256.hexdigest(req.password)
        )
        result = { status: :SUCCEEDED }
      rescue Mysql2::Error => e
        if e.errno == MYSQL_ER_DUP_ENTRY
          result = { status: :FAILED, error: 'IDが既に登録されています'}
        else
          raise e
        end
      end
      
      encode_response(
        Proto::Services::Account::SignupResponse,
        result
      )
    end

    post '/api/login' do
      req = decode_request Proto::Services::Account::LoginRequest
      result = nil

      contestant = db.xquery(
        'SELECT `password` FROM `contestants` WHERE `id` = ? LIMIT 1',
        req.contestant_id,
      ).first

      if contestant && Rack::Utils.secure_compare(contestant[:password], Digest::SHA256.hexdigest(req.password))
        session[:contestant_id] = req.contestant_id
        result = { status: :SUCCEEDED }
      else
        result = { status: :FAILED, error: 'ログインIDまたはパスワードが正しくありません' }
      end
      
      encode_response(
        Proto::Services::Account::LoginResponse,
        result
      )
    end
  end
end
