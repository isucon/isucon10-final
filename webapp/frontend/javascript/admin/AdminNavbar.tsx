import type { xsuportal } from "../pb";
import { AdminApiClient } from "./AdminApiClient";

import React from "react";
import { Link } from "react-router-dom";

import { ErrorMessage } from "../common/ErrorMessage";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: AdminApiClient;
}

export interface State {}

export class AdminNavbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <nav
        className="navbar is-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/contestant">
              XSUCON Admin
            </Link>
          </div>
          <div className="navbar-menu is-active">
            <div className="navbar-start">
              <a className="navbar-item" href="/teams">
                チーム一覧
              </a>
              <a className="navbar-item" href="/terms">
                規約
              </a>
              <a className="navbar-item" href="/rules">
                レギュレーション
              </a>
              <a className="navbar-item" href="/">
                パブリックダッシュボード
              </a>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
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
