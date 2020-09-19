import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  teamList: xsuportal.proto.services.audience.ListTeamsResponse | null;
  error: Error | null;
}

export class TeamList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = new URLSearchParams(document.location.search);
    this.state = {
      teamList: null,
      error: null,
    };
  }

  public componentDidMount() {
    this.updateTeamList();
  }

  async updateTeamList() {
    try {
      const teamList = await this.props.client.listTeams();
      this.setState({ teamList });
    } catch (error) {
      this.setState({ error });
    }
  }
  public render() {
    return (
      <>
        <header>
          <h1 className="title is-1">参加チームリスト</h1>
        </header>
        <main>
          {this.renderError()}
          {this.renderTeamList()}
        </main>
      </>
    );
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  renderTeamList() {
    if (!this.state.teamList) return <p>Loading...</p>;
    return (
      <>
        {this.state.teamList.teams!.map((team, i) => this.renderTeam(team, i))}
      </>
    );
  }

  renderTeam(
    team: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem,
    i: number
  ) {
    return (
      <div className="card mt-4" key={i}>
        <div className="card-content">
          <p className="title is-5">{team.name}</p>
          {team.isStudent ? (
            <p className="subtitle">
              <span className="tag is-info">学生チーム</span>
            </p>
          ) : null}
          <ul>
            {team.memberNames!.map((name, j) => (
              <li key={j}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
