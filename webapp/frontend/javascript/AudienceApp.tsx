import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";

import { Navbar } from "./Navbar";
import { TeamList } from "./TeamList";
import { AudienceDashboard } from "./AudienceDashboard";
import { Registration } from "./Registration";
import { Logout } from "./Logout";
import { Login } from "./Login";
import { Signup } from "./Signup";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {}

export class AudienceApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <BrowserRouter>
        <Navbar session={this.props.session} client={this.props.client} />

        <div className="container mt-5">
          <Switch>
            <Route
              exact
              path="/"
              render={({ match }) => {
                return (
                  <>
                    {this.props.session.contest!.status ==
                      xsuportal.proto.resources.Contest.Status.FINISHED ||
                    this.props.session.contest!.status ==
                      xsuportal.proto.resources.Contest.Status.STARTED ? (
                      <AudienceDashboard
                        session={this.props.session}
                        client={this.props.client}
                      />
                    ) : (
                      <TeamList
                        session={this.props.session}
                        client={this.props.client}
                      />
                    )}
                  </>
                );
              }}
            />
            <Route
              exact
              path="/teams"
              render={({ match }) => {
                return (
                  <>
                    <TeamList
                      session={this.props.session}
                      client={this.props.client}
                    />
                  </>
                );
              }}
            />
            <Route
              exact
              path="/registration"
              render={({ match }) => {
                return (
                  <>
                    <Registration
                      session={this.props.session}
                      client={this.props.client}
                    />
                  </>
                );
              }}
            />
            <Route
              exact
              path="/login"
              render={({location}) => {
                const params = new URLSearchParams(location.search);
                return (
                  <>
                    <Login client={this.props.client} redirect={params.get("redirect")} />
                  </>
                );
              }}
            />
            <Route
              exact
              path="/logout"
              render={() => {
                return (
                  <>
                    <Logout
                      session={this.props.session}
                      client={this.props.client}
                    />
                  </>
                );
              }}
            />
            <Route
              exact
              path="/signup"
              render={() => {
                return (
                  <>
                    <Signup client={this.props.client} />
                  </>
                );
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
