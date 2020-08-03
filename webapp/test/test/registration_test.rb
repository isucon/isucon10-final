require_relative './test_base'

class RegistrationTest < TestBase
  class << self
    def startup
      client.truncate!
      fixtures[:teams_and_contestants].create
    end
  end

  test 'create team' do
    team_id = nil
    member_invite_url = nil
    invite_token = nil

    request :get, '/api/registration/session'
    assert_equal 200, status
    assert_equal :NOT_LOGGED_IN, response[:status]

    # Add leader
    login(contestant_id: 'kiryucoco', password: 'cocokiryu', create: true) do
      request :get, '/api/registration/session'
      assert_equal 200, status
      assert_equal :CREATABLE, response[:status]

      request :post, '/api/registration/team', {
        name: 'Kiryu Coco',
        team_name: 'cocomarine',
        email_address: 'kiryucoco@example.com',
        is_student: false,
      }
      team_id = response[:team_id]
      assert_equal 200, status
      assert_equal Integer, team_id.class

      request :get, '/api/registration/session'
      member_invite_url = response[:member_invite_url]
      assert_equal 200, status
      assert_match(/team_id=\d+/, member_invite_url)
      assert_match(/invite_token=[0-9a-zA-Z\-]+/ , member_invite_url)

      invite_token = member_invite_url.match(/invite_token=([^&]+)/)[1]
    end

    get_registration_session_url = "/api/registration/session?team_id=#{team_id}&invite_token=#{invite_token}"

    # Add member
    login(contestant_id: 'houshoumarine', password: 'marinehoushou', create: true) do
      request :get, get_registration_session_url
      assert_equal 200, status
      assert_equal :JOINABLE, response[:status]
      assert_equal member_invite_url, response[:member_invite_url]
      assert_equal(
        {
          id: team_id,
          name: 'cocomarine',
          leader_id: 'kiryucoco',
          member_ids: %w[kiryucoco],
          final_participation: false,
          hidden: false,
          withdrawn: false,
          detail: nil,
          leader: { id: 'kiryucoco', team_id: team_id, name: 'Kiryu Coco', is_student: false },
          members: [{ id: 'kiryucoco', team_id: team_id, name: 'Kiryu Coco', is_student: false }],
        },
        response[:team],
      )

      request :post, '/api/registration/contestant', {
        team_id: team_id,
        name: 'Houshou Marine',
        invite_token: invite_token,
        is_student: false,
      }
      assert_equal 200, status
    end

    # Add member (invalid invite_token)
    login(contestant_id: 'akaihaato', password: 'haatoakai', create: true) do
      request :get, get_registration_session_url
      assert_equal 200, status
      assert_equal :JOINABLE, response[:status]
      assert_equal member_invite_url, response[:member_invite_url]
      assert_equal %w[houshoumarine kiryucoco], response[:team][:member_ids].sort
      assert_equal(
        [
          { id: 'houshoumarine', team_id: team_id, name: 'Houshou Marine', is_student: false },
          { id: 'kiryucoco', team_id: team_id, name: 'Kiryu Coco', is_student: false },
        ],
        response[:team][:members].sort_by { |_| _[:id] },
      )

      request :post, '/api/registration/contestant', {
        team_id: team_id,
        name: 'Akai Haato',
        invite_token: 'INVALIDTOKEN',
        is_student: true,
      }
      assert_equal 400, status
    end

    # Add member
    login(contestant_id: 'akaihaato', password: 'haatoakai') do
      request :get, get_registration_session_url
      assert_equal 200, status
      assert_equal :JOINABLE, response[:status]
      assert_equal member_invite_url, response[:member_invite_url]
      assert_equal %w[houshoumarine kiryucoco], response[:team][:member_ids].sort
      assert_equal(
        [
          { id: 'houshoumarine', team_id: team_id, name: 'Houshou Marine', is_student: false },
          { id: 'kiryucoco', team_id: team_id, name: 'Kiryu Coco', is_student: false },
        ],
        response[:team][:members].sort_by { |_| _[:id] },
      )

      request :post, '/api/registration/contestant', {
        team_id: team_id,
        name: 'Akai Haato',
        invite_token: invite_token,
        is_student: true,
      }
      assert_equal 200, status
    end

    # Add member (over capacity)
    login(contestant_id: 'amanekanatach', password: 'kanataamane', create: true) do
      request :get, get_registration_session_url
      assert_equal 200, status
      assert_equal :NOT_JOINABLE, response[:status]
      assert_equal member_invite_url, response[:member_invite_url]
      assert_equal %w[akaihaato houshoumarine kiryucoco], response[:team][:member_ids].sort
      assert_equal(
        [
          { id: 'akaihaato', team_id: team_id, name: 'Akai Haato', is_student: true },
          { id: 'houshoumarine', team_id: team_id, name: 'Houshou Marine', is_student: false },
          { id: 'kiryucoco', team_id: team_id, name: 'Kiryu Coco', is_student: false },
        ],
        response[:team][:members].sort_by { |_| _[:id] },
      )

      request :post, '/api/registration/contestant', {
        team_id: team_id,
        name: 'Amane Kanata',
        invite_token: invite_token,
        is_student: true,
      }
      assert_equal 400, status
    end
  end
end
