import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./common/ApiClient";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { ContestantDashboard } from "./contestant/ContestantDashboard";
import { TeamList } from "./TeamList";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Registration } from "./Registration";
import { ContestantBenchmarkJobDetail } from "./contestant/ContestantBenchmarkJobDetail";
import { ContestantBenchmarkJobList } from "./contestant/ContestantBenchmarkJobList";
import { AudienceDashboard } from "./audience/AudienceDashboard";
import { ContestantClarificationList } from "./contestant/ContestantClarificationList";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  error: Error | null;
  loggedin: boolean | null;
  registered: boolean | null;
}

export class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
      loggedin: null,
      registered: null,
    };
  }

  public async componentDidMount() {
    const session = await this.props.client.getCurrentSession();
    this.setState({
      loggedin: !!session.contestant,
      registered: !!session.team,
    });
  }

  public render() {
    return (
      <>
        <Router>
          <nav
            className="navbar is-danger"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="container">
              <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                  XSUCON Portal
                </Link>
              </div>
              <div className="navbar-menu is-active">
                <div className="navbar-start">
                  {this.renderNavbarMenuButtons()}
                </div>
                <div className="navbar-end">
                  <div className="navbar-item">
                    <div className="buttons">
                      {this.renderNavbarRegistrationButtons()}
                      {this.renderNavbarLoginButtons()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="container mt-5">
            <Switch>
              <Route path="/registration" exact={true}>
                <Registration
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route path="/login" exact={true}>
                <Login client={this.props.client} root={this} />
              </Route>
              <Route path="/logout" exact={true}>
                <Logout
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route path="/signup" exact={true}>
                <Signup client={this.props.client} root={this} />
              </Route>
              <Route path="/contestant" exact={true}>
                <ContestantDashboard
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route
                path="/contestant/benchmark_jobs/:id"
                exact={true}
                render={({ match }) => {
                  return (
                    <ContestantBenchmarkJobDetail
                      client={this.props.client}
                      id={match.params.id}
                      root={this}
                    />
                  );
                }}
              />
              <Route path="/contestant/clarifications" exact={true}>
                <ContestantClarificationList
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route path="/contestant/benchmark_jobs" exact={true}>
                <ContestantBenchmarkJobList
                  session={this.props.session}
                  client={this.props.client}
                  incompleteOnly={false}
                  root={this}
                />
              </Route>
              <Route path="/" exact={true}>
                <AudienceDashboard client={this.props.client} />
              </Route>
              <Route path="/teams" exact={true}>
                <TeamList
                  session={this.props.session}
                  client={this.props.client}
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }

  public renderNavbarMenuButtons() {
    if (this.state.loggedin) {
      return (
        <>
          <Link className="navbar-item" to="/teams">
            チーム一覧
          </Link>
          <Link className="navbar-item" to="/contestant">
            ダッシュボード
          </Link>
          <Link className="navbar-item" to="/contestant/benchmark_jobs">
            ジョブ一覧
          </Link>
          <Link className="navbar-item" to="/contestant/clarifications">
            質問/サポート
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link className="navbar-item" to="/teams">
            チーム一覧
          </Link>
        </>
      );
    }
  }

  public renderNavbarRegistrationButtons() {
    if (this.state.loggedin) {
      if (this.state.registered) {
        return (
          <Link className="button is-light" to="/registration">
            登録確認
          </Link>
        );
      } else {
        return (
          <Link className="button is-light" to="/registration">
            チーム作成
          </Link>
        );
      }
    } else {
      return <></>;
    }
  }

  public renderNavbarLoginButtons() {
    if (this.state.loggedin) {
      return (
        <>
          <Link className="button is-light" to="/logout">
            ログアウト
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link className="button is-light" to="/login">
            ログイン
          </Link>
          <Link className="button is-light" to="/signup">
            アカウント作成
          </Link>
        </>
      );
    }
  }
}
