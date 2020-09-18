import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";

import React from "react";
import { Link } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {}

export class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
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
              <Link className="navbar-item" to="/teams">
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
                <div className="buttons">
                  {this.renderNavbarContestButton()}
                  {this.renderNavbarLoginButtons()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  public renderNavbarContestButton() {
    if (this.props.session.contestant) {
      switch (this.props.session.contest?.status) {
        case xsuportal.proto.resources.Contest.Status.REGISTRATION:
        case xsuportal.proto.resources.Contest.Status.STANDBY:
          return (
            <Link className="button is-light" to="/registration">
              参加登録/修正
            </Link>
          );
        case xsuportal.proto.resources.Contest.Status.STARTED:
        case xsuportal.proto.resources.Contest.Status.FINISHED:
          return (
            <a className="button is-light" href="/contestant">
              競技参加者向けページ
            </a>
          );
      }
    } else {
      if (
        this.props.session.contest?.status ===
        xsuportal.proto.resources.Contest.Status.REGISTRATION
      ) {
        return (
          <Link className="button is-light" to="/registration">
            参加登録
          </Link>
        );
      } else {
        return null;
      }
    }
  }

  public renderNavbarLoginButtons() {
    if (this.props.session.contestant) {
      return (
        <>
          <a
            className="button is-light"
            href="/session"
            onClick={this.onLogout.bind(this)}
          >
            ログアウト
          </a>
        </>
      );
    } else {
      return (
        <>
          <a className="button is-light" href={this.loginPath()}>
            ログイン
          </a>
        </>
      );
    }
  }

  loginPath() {
    return (document.querySelector(
      'meta[name="isux:github-auth-path"]'
    )! as HTMLMetaElement).content;
  }

  onLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/session";
    document.body.appendChild(form);

    const method = document.createElement("input");
    method.type = "hidden";
    method.name = "_method";
    method.value = "delete";
    form.appendChild(method);

    form.submit();
  }
}
