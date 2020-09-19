import { xsuportal } from "../pb";
import { ApiError, ApiClient } from "../ApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "../ErrorMessage";

import { BenchmarkJobList } from "../BenchmarkJobList";

import { ContestantBenchmarkJobForm } from "./ContestantBenchmarkJobForm";

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
}

export interface State {
  list: xsuportal.proto.services.contestant.ListBenchmarkJobsResponse | null;
  error: Error | null;
}

export class ContestantBenchmarkJobList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      list: null,
      error: null,
    };
  }

  public componentDidMount() {
    this.updateList();
  }

  async updateList() {
    try {
      const list = await this.props.client.listBenchmarkJobs();
      this.setState({ list });
    } catch (error) {
      this.setState({ error });
    }
  }

  public render() {
    return (
      <>
        <Switch>
          <Route exact path="/contestant/benchmark_jobs">
            <header>
              <h1 className="title is-1">Benchmark Jobs</h1>
            </header>
            <main>
              {this.renderForm()}
              {this.renderError()}
              {this.renderList()}
            </main>
          </Route>
        </Switch>
      </>
    );
  }

  public renderError() {
    if (!this.state.error) return;
    return <ErrorMessage error={this.state.error} />;
  }

  renderForm() {
    return (
      <ContestantBenchmarkJobForm
        session={this.props.session}
        client={this.props.client}
      />
    );
  }

  renderList() {
    if (!this.state.list) return <p>Loading...</p>;
    return <BenchmarkJobList list={this.state.list.jobs} />;
  }
}
