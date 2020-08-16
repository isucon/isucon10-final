import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./common/ApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "./common/ErrorMessage";
import { TimeDuration } from "./common/TimeDuration";
import { Index } from "./Index";
import { LoginRequired } from "./common/LoginRequired";
import { Timestamp } from "./common/Timestamp";

type ListFilterProps = {
  teamId: number | null;
  incompleteOnly: boolean;
};
const ListFilter: React.FC<ListFilterProps> = (props: ListFilterProps) => {
  const [redirect, setRedirect] = React.useState<JSX.Element | null>(null);
  const { register, handleSubmit, watch, setValue, errors } = useForm<
    ListFilterProps
  >({
    defaultValues: props,
  });
  const onSubmit = handleSubmit((data) => {
    const search = new URLSearchParams();
    search.set("team_id", data.teamId != null ? data.teamId.toString() : "");
    search.set("incompleteOnly", data.incompleteOnly ? "1" : "0");
    setRedirect(
      <Redirect
        push={true}
        to={{
          pathname: "/admin/benchmark_jobs",
          search: `?${search.toString()}`,
        }}
      />
    );
  });

  return (
    <>
      <div className="card mt-5">
        {redirect}
        <div className="card-content">
          <form onSubmit={onSubmit}>
            <div className="columns">
              <div className="column is-3 field">
                <label
                  className="label"
                  htmlFor="AdminBenchmarkJobListFilter-teamId"
                >
                  Team ID
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="teamId"
                    id="AdminBenchmarkJobListFilter-teamId"
                    ref={register}
                  />
                </div>
              </div>
              <div className="column is-3 field">
                <label
                  className="label"
                  htmlFor="AdminBenchmarkJobListFilter-incompleteOnly"
                >
                  Incomplete only
                </label>
                <div className="control">
                  <input
                    type="checkbox"
                    name="incompleteOnly"
                    id="AdminBenchmarkJobListFilter-incompleteOnly"
                    ref={register}
                  />
                </div>
              </div>
              <div className="column is-3 field">
                <button className="button is-link" type="submit">
                  Filter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  incompleteOnly: boolean;
  root: Index;
}

export interface State {
  list: xsuportal.proto.services.admin.ListBenchmarkJobsResponse | null;
  error: Error | null;
}

export class BenchmarkJobList extends React.Component<Props, State> {
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

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps !== this.props) this.updateList();
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
        <LoginRequired root={this.props.root}></LoginRequired>
        <Switch>
          <Route exact path="/benchmark_jobs">
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
    // return (
    //   <BenchmarkJobForm
    //     session={this.props.session}
    //     client={this.props.client}
    //   />
    // );
    return <p>(form予定地)</p>;
  }

  renderList() {
    if (!this.state.list) return <p>Loading...</p>;
    return (
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Target</th>
            <th>Status</th>
            <th>Result</th>
            <th>Score</th>
            <th>Enqueued</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {this.state.list.jobs!.map((job, i) => this.renderJob(job, i))}
        </tbody>
      </table>
    );
  }

  renderJobStatus(
    status: xsuportal.proto.resources.BenchmarkJob.Status | null | undefined
  ) {
    switch (status) {
      case xsuportal.proto.resources.BenchmarkJob.Status.FINISHED:
        return <span className="tag is-success">Finished</span>;
      case xsuportal.proto.resources.BenchmarkJob.Status.ERRORED:
        return <span className="tag is-danger">Error</span>;
      case xsuportal.proto.resources.BenchmarkJob.Status.CANCELLED:
        return <span className="tag is-dark">Cancelled</span>;
      case xsuportal.proto.resources.BenchmarkJob.Status.PENDING:
        return <span className="tag is-primary">Pending</span>;
      case xsuportal.proto.resources.BenchmarkJob.Status.RUNNING:
        return <span className="tag is-link">Running</span>;
      case xsuportal.proto.resources.BenchmarkJob.Status.SENT:
        return <span className="tag is-info">Sent</span>;
    }
    return <span className="tag is-dark">Unknown({status})</span>;
  }

  renderJobResult(passed: boolean | null | undefined) {
    if (passed == null) {
      return <></>;
    }
    if (passed) {
      return <span className="tag is-success">Passed</span>;
    } else {
      return <span className="tag is-danger">Failed</span>;
    }
  }

  renderJob(job: xsuportal.proto.resources.IBenchmarkJob, i: number) {
    const id = job.id!.toString();
    return (
      <tr key={id}>
        <td>
          <Link to={`/benchmark_jobs/${encodeURIComponent(id)}`}>#{id}</Link>
        </td>
        <td>{job.targetHostname}</td>
        <td>{this.renderJobStatus(job.status)}</td>
        <td>{this.renderJobResult(job.result?.passed)}</td>
        <td>{job.result?.score}</td>
        <td>
          <Timestamp timestamp={job.createdAt!}></Timestamp>
        </td>
        <td>
          <TimeDuration a={job.createdAt!} b={job.finishedAt} />
        </td>
      </tr>
    );
  }
}
