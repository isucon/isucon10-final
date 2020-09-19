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
  requesting: boolean;
  logoutSucceeded: boolean;
}

export class Logout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
      requesting: false,
      logoutSucceeded: false,
    };
  }

  public async componentDidMount() {
    if (this.state.requesting) return;
    try {
      this.setState({ requesting: true });
      await this.logout();
      const session = await this.props.client.getCurrentSession();
      this.setState({
        session: session,
        error: null,
        requesting: false,
      });
      location.reload();
    } catch (err) {
      this.setState({ error: err, requesting: false });
    }
  }

  public render() {
    const currentContestant = this.state.session.contestant;
    if (!currentContestant) {
      return (
        <>
          <Redirect to="/"></Redirect>
        </>
      );
    } else {
      return (
        <>
          <header>
            <h1 className="title is-1">ログアウト</h1>
          </header>
          <main>{this.renderError()}</main>
        </>
      );
    }
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  logout() {
    return this.props.client.logout({});
  }
}
