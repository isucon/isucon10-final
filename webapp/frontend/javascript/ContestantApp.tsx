import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { ErrorMessage } from "./ErrorMessage";

import { ContestantNavbar } from "./contestant/ContestantNavbar";
import { ContestantBenchmarkJobList } from "./contestant/ContestantBenchmarkJobList";
import { ContestantBenchmarkJobDetail } from "./contestant/ContestantBenchmarkJobDetail";
import { ContestantClarificationList } from "./contestant/ContestantClarificationList";
import { ContestantDashboard } from "./contestant/ContestantDashboard";

import { ContestantNotificationsObserver } from "./contestant/ContestantNotificationsObserver";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  release?: string;
}

export interface State {
  notificationObserver: ContestantNotificationsObserver;
  lastAnsweredClarificationIdObserved: boolean;
  lastAnsweredClarificationId?: number;
  lastClarificationIdSeen?: number;
  localNotificationEnabled: boolean;

  serviceWorker: ServiceWorkerRegistration | null;
}

export class ContestantApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const notificationObserver = new ContestantNotificationsObserver(
      this.props.client
    );
    notificationObserver.onLastAnsweredClarificationIdChange = this.onLastAnsweredClarificationIdChange.bind(
      this
    );
    notificationObserver.onNewNotifications = this.onNewNotifications.bind(
      this
    );

    this.state = {
      notificationObserver,
      lastAnsweredClarificationIdObserved: false,
      lastClarificationIdSeen: this.getLastClarificationIdSeen(),
      localNotificationEnabled: this.getLocalNotificationEnabled(),
      serviceWorker: null,
    };
  }

  getLastClarificationIdSeen() {
    const str = window.localStorage.getItem(
      "xsuportal-contestantLastClarificationIdSeen"
    );
    if (!str) return undefined;
    return parseInt(str, 10);
  }

  getLocalNotificationEnabled() {
    if (!("Notification" in window)) {
      console.warn("getLocalNotificationEnabled: No notification support");
      this.setLocalNotificationEnabled(false);
      return false;
    }
    if (window.Notification.permission === "denied") {
      console.warn(
        "getLocalNotificationEnabled: Notification permission denied"
      );
      this.setLocalNotificationEnabled(false);
      return false;
    }
    return (
      window.localStorage.getItem(
        "xsuportal-contestantLocalNotificationEnabled"
      ) === "1"
    );
  }

  setLocalNotificationEnabled(flag: boolean) {
    console.log("setLocalNotificationEnabled:", flag);
    try {
      if (flag) {
        window.localStorage.setItem(
          "xsuportal-contestantLocalNotificationEnabled",
          "1"
        );
      } else {
        window.localStorage.removeItem(
          "xsuportal-contestantLocalNotificationEnabled"
        );
      }
    } catch (e) {
      console.warn(e);
    }
    this.setState({ localNotificationEnabled: flag });
  }

  componentDidMount() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW:", reg);

          const lastServiceWorkerRelease = window.localStorage.getItem(
            "xsuportal-swRelease"
          );
          if (
            lastServiceWorkerRelease !== undefined &&
            this.props.release !== lastServiceWorkerRelease
          ) {
            console.log("Attempt to update sw");
            reg.update();
          }

          try {
            window.localStorage.setItem(
              "xsuportal-swRelease",
              this.props.release || ""
            );
          } catch (e) {
            console.warn(e);
          }

          this.setState({ serviceWorker: reg });

          this.state.notificationObserver.start();
        })
        .catch((e) => {
          console.warn("Cannot register SW: ", e);
          this.state.notificationObserver.start();
        });
    } else {
      this.state.notificationObserver.start();
    }
  }

  componentWillUnmount() {
    this.state.notificationObserver.shutdown();
  }

  onLastAnsweredClarificationIdChange(id?: number) {
    this.setState({
      lastAnsweredClarificationIdObserved: true,
      lastAnsweredClarificationId: id,
      lastClarificationIdSeen: this.getLastClarificationIdSeen(),
    });
  }

  onLastClarificationIdSeenChange(id?: number) {
    try {
      if (id) {
        window.localStorage.setItem(
          "xsuportal-contestantLastClarificationIdSeen",
          id.toString()
        );
      } else {
        window.localStorage.removeItem(
          "xsuportal-contestantLastClarificationIdSeen"
        );
      }
    } catch (e) {
      console.warn(e);
    }
    this.setState({ lastClarificationIdSeen: id });
  }

  onNewNotifications(notifications: xsuportal.proto.resources.INotification[]) {
    console.log({
      localNotificationEnabled: this.state.localNotificationEnabled,
    });
    if (!this.state.localNotificationEnabled) return;
    const worker = this.state.serviceWorker?.active;
    console.log({ worker: worker });
    if (!worker) return;
    worker.postMessage({
      kind: "localNotification",
      notifications: notifications,
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <ContestantNavbar
          session={this.props.session}
          client={this.props.client}
          unreadNotificationExists={
            this.state.lastAnsweredClarificationIdObserved &&
            this.state.lastClarificationIdSeen !==
              this.state.lastAnsweredClarificationId
          }
        />

        <div className="container mt-5">
          <Switch>
            <Route
              exact
              path="/contestant"
              render={({ match }) => {
                return (
                  <ContestantDashboard
                    session={this.props.session}
                    client={this.props.client}
                    serviceWorker={this.state.serviceWorker}
                    localNotificationEnabled={
                      this.state.localNotificationEnabled
                    }
                    setLocalNotificationEnabled={this.setLocalNotificationEnabled.bind(
                      this
                    )}
                  />
                );
              }}
            />
            <Route
              exact
              path="/contestant/benchmark_jobs"
              render={({ match }) => {
                return (
                  <ContestantBenchmarkJobList
                    session={this.props.session}
                    client={this.props.client}
                  />
                );
              }}
            />
            <Route
              path="/contestant/benchmark_jobs/:id"
              render={({ match }) => {
                return (
                  <ContestantBenchmarkJobDetail
                    session={this.props.session}
                    client={this.props.client}
                    id={match.params.id}
                  />
                );
              }}
            />
            <Route
              exact
              path="/contestant/clarifications"
              render={({ match }) => {
                return (
                  <ContestantClarificationList
                    session={this.props.session}
                    client={this.props.client}
                    onLastClarificationIdSeenChange={this.onLastClarificationIdSeenChange.bind(
                      this
                    )}
                  />
                );
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
