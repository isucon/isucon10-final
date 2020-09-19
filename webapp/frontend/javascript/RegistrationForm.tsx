import { xsuportal } from "./pb";
import { ApiClient } from "./ApiClient";
import React from "react";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  client: ApiClient;
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  inviteToken: string | null;
  registrationSession: xsuportal.proto.services.registration.GetRegistrationSessionResponse;
  updateRegistrationSession: () => void;
}

export interface State {
  teamName: string;
  name: string;
  emailAddress: string;
  isStudent: boolean;
  requesting: boolean;
  requestError: Error | null;
}

export class RegistrationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      teamName: this.props.registrationSession.team?.name ?? "",
      name: this.props.session.contestant?.name ?? "",
      emailAddress:
        this.props.registrationSession.team?.detail?.emailAddress ?? "",
      isStudent: this.props.session.contestant?.isStudent ?? false,
      requesting: false,
      requestError: null,
    };
  }

  public async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.state.requesting) return;
    try {
      this.setState({ requesting: true });
      if (this.isEditing()) {
        await this.updateRegistration();
      } else {
        if (this.props.registrationSession.team) {
          await this.joinTeam();
        } else {
          await this.createTeam();
        }
      }
      this.setState({ requestError: null, requesting: false });
      this.props.updateRegistrationSession();
    } catch (err) {
      this.setState({ requestError: err, requesting: false });
    }
  }

  public onChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value as unknown,
    } as Pick<State, keyof State>);
  }

  createTeam() {
    return this.props.client.createTeam({
      teamName: this.state.teamName,
      emailAddress: this.state.emailAddress,
      name: this.state.name,
      isStudent: this.state.isStudent,
    });
  }

  joinTeam() {
    return this.props.client.joinTeam({
      inviteToken: this.props.inviteToken,
      teamId: this.props.registrationSession.team!.id,
      name: this.state.name,
      isStudent: this.state.isStudent,
    });
  }

  updateRegistration() {
    return this.props.client.updateRegistration({
      teamName: this.state.teamName,
      emailAddress: this.state.emailAddress,
      name: this.state.name,
      isStudent: this.state.isStudent,
    });
  }

  isEditing() {
    return (
      this.props.registrationSession.status ==
      xsuportal.proto.services.registration.GetRegistrationSessionResponse
        .Status.JOINED
    );
  }

  public render() {
    return (
      <>
        <section className="mt-2">
          <h3 className="title is-3">注意事項</h3>
          <ul>
            <li>XSUCON への参加には参加規約への同意が必要です。</li>
            <li>
              参加登録が完了すると、他のチームへの参加はできなくなります。
            </li>
            <li>
              1人目 (チーム代表者) の登録後、チームメンバーを招待するための URL
              を確認することができます。招待 URL
              を共有し、チームメンバー全員の登録をしてください。
            </li>
            <li>
              チーム名・代表者名に公序良俗に反する名前は使わないでください。
            </li>
            <li>
              チーム名・代表者名に機種依存文字・絵文字・HTMLタグなどが入っていた場合、サイトへの表示時に表現を変えさせていただく場合があります。
            </li>
          </ul>
        </section>
        <section className="mt-2">
          <h3 className="title is-3">
            {this.isEditing() ? "編集" : "詳細の入力"}
          </h3>
          <form onSubmit={this.onSubmit.bind(this)}>
            {this.renderTeamFormFields()}
            {this.renderContestantFormFields()}

            <div className="field">
              <div className="control">
                <button
                  className="button is-primary"
                  disabled={this.state.requesting}
                >
                  {this.isEditing() ? "保存" : "参加規約に同意して登録"}
                </button>
              </div>
            </div>

            {this.renderError()}
          </form>
        </section>
      </>
    );
  }

  public renderTeamFormFields() {
    if (
      this.props.registrationSession.team &&
      this.props.registrationSession.team.leaderId !=
        this.props.session.contestant?.id
    ) {
      const leader = this.props.registrationSession.team.leader!;
      return (
        <>
          <div className="field">
            <label className="label" htmlFor="fieldTeamName">
              チーム名
            </label>
            <div className="control">
              <input
                className="input"
                disabled
                id="fieldTeamName"
                value={this.props.registrationSession.team.name || ""}
              />
            </div>
            {this.isEditing() ? (
              <p className="help">
                代表者 {leader.name}{" "}
                のチームへ参加しています。チーム名・代表者メールアドレスは代表者のみが変更可能です。
              </p>
            ) : (
              <p className="help">
                招待を利用し、代表者 {leader.name} のチームへ参加します。
              </p>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="field">
            <label className="label" htmlFor="fieldTeamName">
              チーム名
            </label>
            <div className="control">
              <input
                className="input"
                required
                id="fieldTeamName"
                name="teamName"
                value={this.state.teamName}
                onChange={this.onChange.bind(this)}
              />
            </div>
            {this.isEditing() ? (
              <p className="help"></p>
            ) : (
              <p className="help">
                現在ログインしている方を代表とするチームを作成します。代表者は変更できません。既存のチームへ参加する場合、代表者もしくはチームメンバーの方より招待
                URL を受け取ってください。
              </p>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="fieldEmailAddress">
              代表者メールアドレス
            </label>
            <div className="control">
              <input
                className="input"
                type="email"
                autoComplete="email"
                spellCheck={false}
                required
                id="fieldEmailAddress"
                name="emailAddress"
                value={this.state.emailAddress}
                onChange={this.onChange.bind(this)}
              />
            </div>
            <p className="help">確認メールなどは送信されません。</p>
          </div>
        </>
      );
    }
  }

  public renderContestantFormFields() {
    return (
      <>
        <div className="field">
          <label className="label" htmlFor="fieldName">
            {!this.props.registrationSession.team ? "代表者名" : "参加者名"}
          </label>
          <div className="control">
            <input
              className="input"
              required
              id="fieldName"
              name="name"
              value={this.state.name}
              onChange={this.onChange.bind(this)}
            />
          </div>
          <p className="help">
            公開されます。本名でなくて構いません (id, HN,
            その他匿名な記入でも問題ありません)。複数名の名前を記載することはできません
            (2
            人目以降の登録は、登録後確認できる招待URLを利用して、それぞれ個別に登録してください)。
          </p>
        </div>

        <div className="field">
          <label className="label">学生ですか?</label>
          <div className="control">
            <input
              className="checkbox"
              type="checkbox"
              name="isStudent"
              checked={this.state.isStudent}
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
      </>
    );
  }

  public renderError() {
    if (!this.state.requestError) return null;
    return <ErrorMessage error={this.state.requestError} />;
  }
}
