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
    invite_token = nil

    # Add leader
    login(contestant_id: 'kiryucoco', password: 'cocokiryu', create: true) do
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
      assert_equal 200, status
      assert_match(/team_id=\d+/, response[:member_invite_url])
      assert_match(/invite_token=[0-9a-zA-Z\-]+/ , response[:member_invite_url])

      invite_token = response.fetch(:member_invite_url).match(/invite_token=([^&]+)/)[1]
    end

    # Add member
    login(contestant_id: 'houshoumarine', password: 'marinehoushou', create: true) do
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
      request :post, '/api/registration/contestant', {
        team_id: team_id,
        name: 'Akai Haato',
        invite_token: invite_token,
        is_student: true,
      }
      assert_equal 200, status
    end

    # Add member (over capacity)
    login(contestant_id: 'anamekanatach', password: 'kanataamane', create: true) do
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
