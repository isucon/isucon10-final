import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";
import { Redirect } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";
import { Index } from "./Index";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  root: Index;
}

export interface State {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  error: Error | null;
  contestantId: string;
  password: string;
  requesting: boolean;
  signupSucceeded: boolean;
}

export class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
      contestantId: "",
      password: "",
      requesting: false,
      signupSucceeded: false,
    };
  }

  public componentDidMount() {}

  public render() {
    return (
      <>
        <header>
          <h1 className="title is-1">アカウント作成</h1>
        </header>
        <main>
          {this.renderError()}
          {this.renderForm()}
          {this.renderRedirect()}
        </main>
      </>
    );
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  public renderForm() {
    return (
      <>
        <section
          className="columns mt-2"
          style={{ display: this.state.signupSucceeded ? "none" : "" }}
        >
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
            <button className="button is-primary">送信</button>
          </div>
        </div>
      </>
    );
  }

  public renderRedirect() {
    if (this.state.signupSucceeded) {
      return <Redirect to="/registration"></Redirect>;
    }
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
      const signupResponse = await this.signup();
      if (
        signupResponse.status ==
        xsuportal.proto.services.account.SignupResponse.Status.SUCCEEDED
      ) {
        this.setState({
          signupSucceeded: true,
          error: null,
          requesting: false,
        });
        this.props.root.setState({ loggedin: true });
      } else {
        throw new Error(signupResponse.error);
      }
    } catch (err) {
      this.setState({ error: err });
    }
  }

  signup() {
    return this.props.client.signup({
      contestantId: this.state.contestantId,
      password: this.state.password,
    });
  }
}
