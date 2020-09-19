import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";
import { AdminApiClient } from "./admin/AdminApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link, NavLink } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";
import { AdminNavbar } from "./admin/AdminNavbar";

import { AdminClarificationList } from "./admin/AdminClarificationList";
import { AdminClarificationDetail } from "./admin/AdminClarificationDetail";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  adminClient: AdminApiClient;
}

export class AdminApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      adminClient: new AdminApiClient(this.props.client),
    };
  }

  public render() {
    return (
      <BrowserRouter>
        <AdminNavbar
          session={this.props.session}
          client={this.state.adminClient}
        />

        <div className="container mt-5">
          <div className="columns">
            <div className="column is-3">
              <aside className="menu">
                <p className="menu-label">Contest</p>
                <ul className="menu-list">
                  <li>
                    <NavLink
                      to="/admin/clarifications"
                      activeClassName="is-active"
                    >
                      Clarifications
                    </NavLink>
                  </li>
                </ul>
              </aside>
            </div>

            <div className="column is-9">
              <main>
                <Switch>
                  <Route
                    exact
                    path="/admin/clarifications"
                    render={({ match }) => {
                      return (
                        <AdminClarificationList
                          session={this.props.session}
                          client={this.state.adminClient}
                        />
                      );
                    }}
                  />
                  <Route
                    exact
                    path="/admin/clarifications/:id"
                    render={({ match }) => {
                      return (
                        <AdminClarificationDetail
                          session={this.props.session}
                          client={this.state.adminClient}
                          id={match.params.id}
                        />
                      );
                    }}
                  />
                </Switch>
              </main>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
