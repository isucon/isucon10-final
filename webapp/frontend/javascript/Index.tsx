import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";
import { TeamList } from "./TeamList";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Registration } from "./Registration";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  error: Error | null;
  loggedin: boolean;
}

export class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      session: this.props.session,
      error: null,
      loggedin: false,
    };
  }

  public async componentDidMount() {
    const session = await this.props.client.getCurrentSession();
    if (session.contestant) {
      this.setState({ loggedin: true });
    }
  }

  public render() {
    return (
      <>
        <Router>
          <nav
            className="navbar is-dark"
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
                  <Link className="navbar-item" to="/">
                    チーム一覧
                  </Link>
                  <a className="navbar-item" href="/terms">
                    規約
                  </a>
                  <a className="navbar-item" href="/rules">
                    レギュレーション
                  </a>
                </div>
                <div className="navbar-end">
                  <div className="navbar-item">
                    <div className="buttons">{this.renderNavbarButtons()}</div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="container mt-5">
            <Switch>
              <Route path="/registration">
                <Registration
                  session={this.props.session}
                  client={this.props.client}
                />
              </Route>
              <Route path="/login">
                <Login
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route path="/logout">
                <Logout
                  session={this.props.session}
                  client={this.props.client}
                  root={this}
                />
              </Route>
              <Route path="/signup">
                <Signup
                  session={this.props.session}
                  client={this.props.client}
                />
              </Route>
              <Route path="/">
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

  public renderNavbarButtons() {
    if (this.state.loggedin) {
      return (
        <>
          <div>
            <Link className="button is-light" to="#">
              登録確認
            </Link>
            <Link className="button is-light" to="/logout">
              ログアウト
            </Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <Link className="button is-light" to="/registration">
              参加登録
            </Link>
            <Link className="button is-light" to="/login">
              ログイン
            </Link>
            <Link className="button is-light" to="/signup">
              アカウント作成
            </Link>
          </div>
        </>
      );
    }
  }
}
