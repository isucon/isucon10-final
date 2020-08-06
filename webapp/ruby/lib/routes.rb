Dir.chdir('lib') do
  Dir.glob("xsuportal/**/*_pb.rb").each {|f| require f }
end

module Xsuportal
  module Routes
    PB_TABLE = {
      'POST /initialize' => [
        Proto::Services::Admin::InitializeRequest,
        Proto::Services::Admin::InitializeResponse,
      ],
      'PUT /api/admin/contest' => [
        Proto::Services::Admin::UpdateContestRequest,
        Proto::Services::Admin::UpdateContestResponse,
      ],
      'GET /api/contest' => [
        nil,
        Proto::Services::Common::GetContestResponse,
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
      'POST /api/contestant/benchmark_jobs' => [
        Proto::Services::Contestant::EnqueueBenchmarkJobRequest,
        Proto::Services::Contestant::EnqueueBenchmarkJobResponse,
      ],
      'GET /api/contestant/benchmark_jobs' => [
        nil,
        Proto::Services::Contestant::ListBenchmarkJobsResponse,
      ],
      'GET /api/contestant/benchmark_jobs/:id' => [
        nil,
        Proto::Services::Contestant::GetBenchmarkJobResponse,
      ],
      'POST /api/signup' => [
        Proto::Services::Contestant::SignupRequest,
        Proto::Services::Contestant::SignupResponse,
      ],
      'POST /api/login' => [
        Proto::Services::Contestant::LoginRequest,
        Proto::Services::Contestant::LoginResponse,
      ],
      'POST /api/logout' => [
        Proto::Services::Contestant::LogoutRequest,
        Proto::Services::Contestant::LogoutResponse,
      ],
    }.freeze
  end
end
