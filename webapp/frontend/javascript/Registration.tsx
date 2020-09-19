import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";

import { ErrorMessage } from "./ErrorMessage";

import { RegistrationForm } from "./RegistrationForm";
import { RegistrationStatus } from "./RegistrationStatus";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  registrationSession: xsuportal.proto.services.registration.GetRegistrationSessionResponse | null;
  teamId: number | null;
  inviteToken: string | null;
  edit: boolean;
  error: Error | null;
}

export class Registration extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = new URLSearchParams(document.location.search);
    this.state = {
      session: this.props.session,
      registrationSession: null,
      teamId: parseInt(params.get("team_id") || "0", 10),
      inviteToken: params.get("invite_token"),
      edit: false,
      error: null,
    };
  }

  public componentDidMount() {
    this.updateRegistrationSession();
  }

  async updateRegistrationSession() {
    try {
      const registrationSession = await this.props.client.getRegistrationSession(
        {
          teamId: this.state.teamId,
          inviteToken: this.state.inviteToken,
        }
      );
      let session = this.state.session;
      if (this.state.registrationSession) {
        // XXX: Contestant name might be updated inside the registration page, and it is only included in GetCurrentSession response, not available in GetRegistrationSession.
        session = await this.props.client.getCurrentSession();
      }
      this.setState({ session, registrationSession, edit: false });
    } catch (err) {
      this.setState({ error: err });
    }
  }

  enableEdit() {
    this.setState({ edit: true });
  }

  public render() {
    return (
      <>
        <header>
          <h1 className="title is-1">参加登録</h1>
        </header>
        <main>
          {this.renderError()}
          {this.renderPhase()}
        </main>
      </>
    );
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  public renderPhase() {
    if (this.state.registrationSession) {
      const login = this.renderTeam();
      switch (this.state.registrationSession.status) {
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.NOT_LOGGED_IN:
          return (
            <>
              <div className="message is-danger">
                <div className="message-body">
                  参加登録をするにはログインしてください
                </div>
              </div>
              {login}
            </>
          );
          break;
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.CLOSED:
          return (
            <>
              <div className="message is-danger">
                <div className="message-body">
                  参加登録を現在受け付けていません
                  (定員到達、締切後、もしくは受付開始前)
                </div>
              </div>
              {login}
            </>
          );
          break;
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.NOT_JOINABLE:
          return (
            <>
              <div className="message is-danger">
                <div className="message-body">
                  招待元のチームメンバー数が上限に達しているため、この招待を利用して参加登録を進めることはできません。
                </div>
              </div>
              {login}
            </>
          );
          break;
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.CREATABLE:
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.JOINABLE:
          return (
            <>
              {login}
              <RegistrationForm
                client={this.props.client}
                session={this.state.session}
                inviteToken={this.state.inviteToken}
                registrationSession={this.state.registrationSession}
                updateRegistrationSession={this.updateRegistrationSession.bind(
                  this
                )}
              />
            </>
          );
          break;
        case xsuportal.proto.services.registration
          .GetRegistrationSessionResponse.Status.JOINED:
          if (this.state.edit) {
            return (
              <RegistrationForm
                client={this.props.client}
                session={this.state.session}
                inviteToken={null}
                registrationSession={this.state.registrationSession}
                updateRegistrationSession={this.updateRegistrationSession.bind(
                  this
                )}
              />
            );
          }
          return (
            <RegistrationStatus
              client={this.props.client}
              session={this.state.session}
              registrationSession={this.state.registrationSession}
              updateRegistrationSession={this.updateRegistrationSession.bind(
                this
              )}
              enableEdit={this.enableEdit.bind(this)}
            />
          );
          break;
      }
    } else {
      return <p>Loading...</p>;
    }
    const err = new Error("[BUG] undeterminable state");
    throw err;
  }

  renderTeam() {
    if (!this.state.registrationSession || !this.state.registrationSession.team)
      return;

    const team = this.state.registrationSession.team;
    return (
      <>
        <section className="mt-3">
          <h3 className="title is-3">チームから招待されています</h3>
          <p>
            {team.leader!.name} のチーム {team.name}{" "}
            からの招待を受諾して参加登録します。
          </p>
        </section>
      </>
    );
  }
}
