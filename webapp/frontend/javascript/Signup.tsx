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
}

export class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
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
          <label className="label" htmlFor="fieldUserId">
            ユーザID
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              required
              id="fieldUserId"
              name="userId"
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
              id="fieldUserId"
              name="userId"
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

  public onSubmit(event: React.FormEvent<HTMLFormElement>) {}
}
