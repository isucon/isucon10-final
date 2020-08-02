Dir.chdir('lib') do
  Dir.glob("**/*_pb.rb").each {|f| require f }
end

module Xsuportal
  module Routes
    PB_TABLE = {
      'POST /initialize' => [
        Proto::Services::Admin::InitializeRequest,
        Proto::Services::Admin::InitializeResponse,
      ],
      'GET /api/session' => [
        nil,
        Proto::Services::Common::GetCurrentSessionResponse,
      ],
      'GET /api/audience/teams' => [
        nil,
        Proto::Services::Audience::ListTeamsResponse,
      ],
      'GET /api/registration/session' => [
        nil,
        Proto::Services::Registration::GetRegistrationSessionResponse,
      ],
      'POST /api/registration/team' => [
        Proto::Services::Registration::CreateTeamRequest,
        Proto::Services::Registration::CreateTeamResponse,
      ],
      'POST /api/registration/contestant' => [
        Proto::Services::Registration::JoinTeamRequest,
        Proto::Services::Registration::JoinTeamResponse,
      ],
      'PUT /api/registration' => [
        Proto::Services::Registration::UpdateRegistrationRequest,
        Proto::Services::Registration::UpdateRegistrationResponse,
      ],
      'DELETE /api/registration' => [
        Proto::Services::Registration::DeleteRegistrationRequest,
        Proto::Services::Registration::DeleteRegistrationResponse,
      ],
      'POST /api/signup' => [
        Proto::Services::Account::SignupRequest,
        Proto::Services::Account::SignupResponse,
      ],
      'POST /api/login' => [
        Proto::Services::Account::LoginRequest,
        Proto::Services::Account::LoginResponse,
      ],
      'POST /api/logout' => [
        Proto::Services::Account::LogoutRequest,
        Proto::Services::Account::LogoutResponse,
      ],
    }.freeze

    def decode_request_pb
      request_class_pb.decode(request.body.read)
    end

    def encode_response_pb(payload={})
      cls = response_class_pb
      cls.encode(cls.new(payload))
    end

    private

    def request_class_pb
      PB_TABLE.fetch(request.env.fetch('sinatra.route'))[0]
    end

    def response_class_pb
      PB_TABLE.fetch(request.env.fetch('sinatra.route'))[1]
    end
  end
end
