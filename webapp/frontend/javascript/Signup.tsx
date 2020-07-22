import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";

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
    };
  }

  public componentDidMount() {}

  public render() {
    return (
      <>
        <header>
          <h1 className="title is-1">アカウント作成</h1>
        </header>
        <main>{this.renderForm()}</main>
      </>
    );
  }

  public renderForm() {
    return (
      <>
        <section className="mt-2">
          <form onSubmit={this.onSubmit.bind(this)}>
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
              id="fieldContestantId"
              name="contestantId"
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
      await this.signup();
    } catch (err) {
      this.setState({ requesting: false });
    }
  }

  signup() {
    return this.props.client.signup({
      contestantId: this.state.contestantId,
      password: this.state.password,
    });
  }
}
