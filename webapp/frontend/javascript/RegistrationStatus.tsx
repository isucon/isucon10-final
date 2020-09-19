import { xsuportal } from "./pb";
import { ApiClient } from "./ApiClient";
import React from "react";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  client: ApiClient;
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  registrationSession: xsuportal.proto.services.registration.GetRegistrationSessionResponse;
  updateRegistrationSession: () => void;
  enableEdit: () => void;
}

export interface State {
  error: Error | null;
}

export class RegistrationStatus extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  onEditButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.enableEdit();
  }

  async onWithdrawButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (
      !confirm(
        "本当にキャンセルしてよろしいですか? この操作は元に戻すことができません。"
      )
    )
      return;
    try {
      await this.props.client.deleteRegistration();
      alert("参加をキャンセルしました。");
      document.location.href = "/";
    } catch (error) {
      this.setState({ error });
    }
  }

  public render() {
    return (
      <>
        <section className="mt-2">
          <h3 className="title is-3">登録完了</h3>
          <ol>
            <li>
              必要に応じ、下記より招待 URL をコピー &
              チームメンバーへ共有し、チームメンバーの参加登録を行ってください
              (代表者を含め 3 人まで)。
            </li>
          </ol>
        </section>

        <div className="mt-3">
          <div className="columns">
            <section className="column">
              <h4 className="title is-4">
                チーム: {this.props.registrationSession.team!.name}
              </h4>
              <p>
                招待URL:{" "}
                <small>
                  <a href={this.props.registrationSession.memberInviteUrl}>
                    {this.props.registrationSession.memberInviteUrl}
                  </a>
                </small>
              </p>

              <h5 className="title is-5 mt-3">メンバーリスト</h5>
              {this.renderTeamMembers()}
            </section>
          </div>
        </div>

        <section className="mt-3">
          <h4 className="title is-4">登録内容の編集</h4>
          <p>
            <button
              className="button is-info"
              onClick={this.onEditButtonClick.bind(this)}
            >
              編集
            </button>
            <br />
            参加者名・学生申告といった登録内容の修正ができます。チーム名は代表者のみが変更可能です。
          </p>
          <p>
            <button
              className="button is-danger"
              onClick={this.onWithdrawButtonClick.bind(this)}
            >
              辞退
            </button>
            <br />
            参加をキャンセルします。
            {this.props.registrationSession.team!.leaderId ==
            this.props.session.contestant!.id ? (
              <strong>
                代表者のため、辞退するとチームとして参加辞退となります。
              </strong>
            ) : (
              <span>
                チームメンバーであるため、チームから離脱します
                (他のメンバーには影響しません)。
              </span>
            )}
          </p>
          {this.renderError()}
        </section>
      </>
    );
  }

  renderTeamMembers() {
    return this.props.registrationSession.team!.members!.map((member) =>
      this.renderTeamMember(member)
    );
  }

  renderTeamMember(member: xsuportal.proto.resources.IContestant) {
    return (
      <div className="card mt-2" key={member.id!.toString()}>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <i className="material-icons">person</i>
            </div>
            <div className="media-content">
              <p className="title is-5">{member.name}</p>
              <p className="subtitle is-6">
                {this.props.registrationSession.team!.leaderId == member.id ? (
                  <span className="tag is-danger">代表者</span>
                ) : null}
                {member.isStudent ? (
                  <span className="tag is-info">学生</span>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderError() {
    if (!this.state.error) return null;
    return <ErrorMessage error={this.state.error} />;
  }
}
