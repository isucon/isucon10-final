require_relative './fixture_base'

class TeamsAndContestants < FixtureBase
  def create
    session = create_leader(
      contestant_id: 'mirakui',
      team_name: '白金動物園',
      email_address: 'mirakui@example.com',
    )
    team_id = session.fetch(:team).fetch(:id)
    create_member team_id: team_id, contestant_id: 'sorah'
    create_member team_id: team_id, contestant_id: 'rosylilly'

    (1..3).each do |i|
      session = create_leader(
        contestant_id: 'alice%02d' % i,
        team_name: 'アリスボブキャロル%02d' % i,
        email_address: 'alice%02d@example.com' % i,
        is_student: true
      )
      team_id = session.fetch(:team).fetch(:id)
      create_member team_id: team_id, contestant_id: 'bob%02d' % i, is_student: true
      create_member team_id: team_id, contestant_id: 'carol%02d' % i, is_student: true
    end
  end
end
