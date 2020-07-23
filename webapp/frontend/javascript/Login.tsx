import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";
import { Redirect } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  error: Error | null;
  contestantId: string;
  password: string;
  requesting: boolean;
  loginSucceeded: boolean;
}

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
      contestantId: "",
      password: "",
      requesting: false,
      loginSucceeded: false,
    };
  }

  public componentDidMount() {}

  public render() {
    if (this.state.loginSucceeded) {
      return (
        <>
          <Redirect to="/"></Redirect>
        </>
      );
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
      const loginResponse = await this.login();
      if (
        loginResponse.status ==
        xsuportal.proto.services.account.LoginResponse.Status.SUCCEEDED
      ) {
        console.log("login!");
        this.setState({ loginSucceeded: true, error: null });
      } else {
        throw new Error(loginResponse.error);
      }
    } catch (err) {
      this.setState({ error: err });
    } finally {
      this.setState({ requesting: false });
    }
  }

  login() {
    return this.props.client.login({
      contestantId: this.state.contestantId,
      password: this.state.password,
    });
  }
}
