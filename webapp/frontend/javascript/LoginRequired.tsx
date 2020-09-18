import { xsuportal } from "./pb";
import { ApiClient } from "./ApiClient";
import React from "react";
import { Redirect } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";
import { Index } from "./Index";

export interface Props {
  root: Index;
}

export interface State {
  redirectTo: string | null;
}

export class LoginRequired extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  public componentDidMount() {
    console.log("loggedin: ", this.props.root.state.loggedin);
    this.setState({
      redirectTo: `${window.location.pathname}${window.location.search}`,
    });
  }

  public render() {
    if (this.props.root.state.loggedin == false && this.state.redirectTo) {
      const encodedUri = encodeURIComponent(this.state.redirectTo);
      return (
        <>
          <Redirect
            to={{ pathname: "/login", search: `?redirect=${encodedUri}` }}
          ></Redirect>
        </>
      );
    } else {
      return <></>;
    }
  }
}
