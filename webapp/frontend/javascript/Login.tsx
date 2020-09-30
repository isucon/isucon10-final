import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";
import { Redirect } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  client: ApiClient;
  redirect?: string | null;
}

export interface State {
  error: Error | null;
  session: xsuportal.proto.services.common.GetCurrentSessionResponse | null;
  contestantId: string;
  password: string;
  requesting: boolean;
  registrationSession: xsuportal.proto.services.registration.IGetRegistrationSessionResponse | null;
}

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      session: null,
      contestantId: "",
      password: "",
      requesting: false,
      registrationSession: null,
    };
  }

  public async componentDidMount() {
    this.setState({
      registrationSession: await this.props.client.getRegistrationSession(),
    });
  }

  public render() {
    const currentContestant = this.state.session?.contestant;

    if (currentContestant) {
      if (this.props.redirect) {
        console.log("redirect: ", this.props.redirect.toString());
        return <Redirect to={this.props.redirect.toString()}></Redirect>;
      } else {
        if (currentContestant.isStaff) {
          return <Redirect to="/admin" />;
        } else if (
          this.state.registrationSession?.status ==
          xsuportal.proto.services.registration.GetRegistrationSessionResponse
            .Status.JOINED
        ) {
          return <Redirect to="/contestant" />;
        } else {
          return (
            <>
              <article className="message is-success">
                <div className="message-header">
                  <p>参加登録してください</p>
                </div>
                <div className="message-body">
                  <p>
                    参加登録するには、
                    <a href="/registration">チームを新しく作成する</a>
                    か、招待URLから既存チームに参加してください。
                  </p>
                </div>
              </article>
            </>
          );
        }
      }
    } else {
      return (
        <>
          <header>
            <h1 className="title is-1">ログイン</h1>
          </header>
          <main>
            {this.renderError()}
            {this.renderForm()}
          </main>
        </>
      );
    }
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  public renderForm() {
    return (
      <>
        <section className="columns mt-2">
          <form className="column is-half" onSubmit={this.onSubmit.bind(this)}>
            {this.renderFormFields()}
          </form>
        </section>
      </>
    );
  }

  public renderFormFields() {
    return (
      <>
        <div className="field">
          <label className="label" htmlFor="fieldContestantId">
            ログインID
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              required
              id="fieldContestantId"
              name="contestantId"
              autoComplete="username"
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="fieldPassword">
            パスワード
          </label>
          <div className="control">
            <input
              className="input"
              type="password"
              required
              id="fieldPassword"
              name="password"
              autoComplete="current-password"
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary">ログイン</button>
          </div>
        </div>
      </>
    );
  }

  public onChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value as unknown,
    } as Pick<State, keyof State>);
  }

  public async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.state.requesting) return;
    try {
      this.setState({ requesting: true });
      await this.props.client.login({
        contestantId: this.state.contestantId,
        password: this.state.password,
      });
      const session = await this.props.client.getCurrentSession();
      const registrationSession = await this.props.client.getRegistrationSession();

      this.setState({
        error: null,
        requesting: false,
        session: session,
        registrationSession: registrationSession,
      });
      location.reload();
    } catch (err) {
      this.setState({ error: err, requesting: false });
    }

    try {
    } catch (err) {
      this.setState({ error: err, requesting: false });
    }
  }
}
