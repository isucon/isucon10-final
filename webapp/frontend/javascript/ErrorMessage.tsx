import { ApiError } from "./ApiClient";
import React from "react";

export interface Props {
  error: Error | ApiError;
}

export interface State {}

export class ErrorMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (!(this.props.error instanceof ApiError)) {
      console.error(this.props.error);
    }
  }

  public render() {
    if (this.props.error instanceof ApiError) {
      return this.renderApiError();
    } else {
      return this.renderGenericError();
    }
  }
  renderApiError() {
    const error = this.props.error as ApiError;
    if (error.remoteError) {
      return (
        <>
          <article className="message is-danger">
            <div className="message-header">
              <p>
                エラー ({error.remoteError.code}):{" "}
                {error.remoteError.humanMessage}{" "}
              </p>
            </div>
            <div className="message-body">
              <ul>
                {error.remoteError.humanDescriptions.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
              {this.renderDebugInfo()}
            </div>
          </article>
        </>
      );
    } else {
      return this.renderGenericError();
    }
  }

  renderDebugInfo() {
    const error = this.props.error as ApiError;
    if (!(error.remoteError && error.remoteError.debugInfo)) return;
    return (
      <>
        <pre>
          {(error.remoteError.debugInfo.applicationTrace || []).join("\n")}
        </pre>
      </>
    );
  }

  renderGenericError() {
    return (
      <>
        <article className="message is-danger">
          <div className="message-header">
            <p>エラー: {this.props.error.name} </p>
          </div>
          <div className="message-body">{this.props.error.message}</div>
        </article>
      </>
    );
  }
}
