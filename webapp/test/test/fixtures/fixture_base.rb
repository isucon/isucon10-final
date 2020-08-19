class FixtureBase
  def initialize(client)
    @client = client
    @credentials = {}
    @invite_tokens = {}
  end

  def create_leader(contestant_id:, password: nil, name: nil, team_name:, email_address:, is_student: false)
    @credentials[contestant_id] = password || 'password'
    name ||= contestant_id
    @client.request! :post, '/api/signup', {
      contestant_id: contestant_id,
      password: @credentials[contestant_id],
    }
    res = @client.request! :post, '/api/registration/team', {
      name: name || contestant_id,
      team_name: team_name,
      email_address: email_address,
      is_student: is_student,
    }
    team_id = res.fetch(:team_id)

    res = @client.request! :get, '/api/registration/session'
    invite_token = res.fetch(:member_invite_url).match(/invite_token=([^&]+)/)[1]

    @invite_tokens[team_id] = invite_token
    @client.logout
    res
  end

  def create_member(contestant_id:, password: nil, name: nil, team_id:, invite_token: nil, is_student: false)
    @credentials[contestant_id] = password || 'password'
    name ||= contestant_id
    invite_token ||= @invite_tokens.fetch(team_id)
    @client.request! :post, '/api/signup', {
      contestant_id: contestant_id,
      password: @credentials[contestant_id],
    }
    @client.request! :post, '/api/registration/contestant', {
      name: name,
      invite_token: invite_token,
      team_id: team_id,
      is_student: is_student,
    }
    @client.logout
    @client.response
  end
end
