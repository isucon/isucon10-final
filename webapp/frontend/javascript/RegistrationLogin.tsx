import { xsuportal } from "./pb";
import { ApiClient } from "./ApiClient";
import React from "react";
import { Link } from "react-router-dom";

export interface Props {
  client: ApiClient;
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  registrationSession: xsuportal.proto.services.registration.GetRegistrationSessionResponse;
}

export interface State {}

export class RegistrationLogin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <section className="mt-2">
        <h3 className="title is-3">ログイン</h3>
        <p>
          XSUCON の参加登録には、<Link to="/signup">アカウント作成</Link>
          が必要です。
        </p>
      </section>
    );
  }

  public renderLogin(
    title: string,
    loginUrl: string,
    username?: string,
    avatarUrl?: string
  ) {
    if (username && username !== "" && avatarUrl) {
      return (
        <div className="card">
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img src={avatarUrl} />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-5">{title}</p>
                <p className="subtitle is-6">{username}</p>
              </div>
              <div className="level-right">
                <a href={loginUrl} className="button is-light level-item">
                  変更
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card">
          <div className="card-content">
            <div className="media">
              <div className="media-content">
                <a href={loginUrl} className="button is-info">
                  {title} でログイン
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
