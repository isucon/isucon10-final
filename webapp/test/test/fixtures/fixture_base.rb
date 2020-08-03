class FixtureBase
  def initialize(client)
    @client = client
    @credentials = {}
    @invite_tokens = {}
  end

  def create_leader(contestant_id:, password: nil, name: nil, team_name:, email_address:, is_student: false)
    @credentials[contestant_id] = password || "#{contestant_id}-password"
    name ||= contestant_id
    @client.request :post, '/api/signup', {
      contestant_id: contestant_id,
      password: password,
    }
    res = @client.request :post, '/api/registration/team', {
      name: name || contestant_id,
      team_name: team_name,
      email_address: email_address,
      is_student: is_student,
    }
    team_id = res.fetch(:team_id)

    res = @client.request :get, '/api/registration/session'
    invite_token = res.fetch(:member_invite_url).match(/invite_token=([^&]+)/)[1]

    @invite_tokens[team_id] = invite_token
    logout
    res
  end

  def create_member(contestant_id:, password: nil, name: nil, team_id:, invite_token: nil, is_student: false)
    @credentials[contestant_id] = password || "#{contestant_id}-password"
    name ||= contestant_id
    invite_token ||= @invite_tokens.fetch(team_id)
    @client.request :post, '/api/signup', {
      contestant_id: contestant_id,
      password: password,
    }
    @client.request :post, '/api/registration/contestant', {
      name: name,
      invite_token: invite_token,
      team_id: team_id,
      is_student: is_student,
    }
    logout
    @client.response
  end

  def login(contestant_id:, password: nil)
    password ||= @credentials.fetch(contestant_id)
    @client.request :post, '/api/login', {
      contestant_id: contestant_id,
      password: password,
    }
  end

  def logout
    @client.request :post, '/api/logout'
  end

  def as_a_contestant(contestant_id)
    login contestant_id: contestant_id
    result = yield
    logout
    result
  end
end
