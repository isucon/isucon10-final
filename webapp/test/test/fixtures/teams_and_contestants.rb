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

    session = create_leader(
      contestant_id: 'alice',
      team_name: 'アリスボブキャロル',
      email_address: 'alice@example.com',
      is_student: true
    )
    team_id = session.fetch(:team).fetch(:id)
    create_member team_id: team_id, contestant_id: 'bob', is_student: true
    create_member team_id: team_id, contestant_id: 'carol', is_student: true
  end
end
