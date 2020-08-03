require_relative './test_base'

class AudienceTest < TestBase
  class << self
    def startup
      client.truncate!
      fixtures[:teams_and_contestants].create
    end
  end

  test 'team list' do
    request :get, '/api/audience/teams'
    assert_equal 200, status
    teams = response[:teams]
    assert_equal 6, teams.count

    team01 = teams.find {|_| _[:name] == 'アリスボブキャロル01' }
    assert_equal %w[alice01 bob01 carol01], team01[:member_names].sort
    assert_equal true, team01[:is_student]

    team02 = teams.find {|_| _[:name] == 'アリスボブキャロル02' }
    assert_equal %w[alice02 bob02 carol02], team02[:member_names].sort
    assert_equal false, team02[:is_student]
  end
end
