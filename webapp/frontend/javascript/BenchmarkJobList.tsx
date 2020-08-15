import { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";

import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "./ErrorMessage";
import { TimeDuration } from "./TimeDuration";

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
  );
};

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  incompleteOnly: boolean;
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
        <Switch>
          <Route exact path="/benchmark_jobs">
            <header>
              <h1 className="title is-1">Benchmark Jobs</h1>
            </header>
            <main>
              {this.renderForm()}
              {this.renderFilter()}
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

  renderFilter() {
    const teamId = this.props.session.team?.id;
    if (teamId != null) {
      return (
        <ListFilter
          teamId={teamId as number}
          incompleteOnly={this.props.incompleteOnly}
        />
      );
    } else {
      return <></>;
    }
  }

  renderList() {
    if (!this.state.list) return <p>Loading...</p>;
    return (
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Team</th>
            <th>Score</th>
            <th>Target Hostname</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {this.state.list.jobs!.map((job, i) => this.renderJob(job, i))}
        </tbody>
      </table>
    );
  }

  renderJob(job: xsuportal.proto.resources.IBenchmarkJob, i: number) {
    const id = job.id!.toString();
    return (
      <tr key={id}>
        <td>
          <Link to={`/benchmark_jobs/${encodeURIComponent(id)}`}>#{id}</Link>
        </td>
        <td>{this.props.session.team?.name}</td>
        <td>{job.result?.score}</td>
        <td>{job.targetHostname}</td>
        <td>{xsuportal.proto.resources.BenchmarkJob.Status[job.status!]}</td>
        <td>
          <TimeDuration a={job.createdAt!} b={job.finishedAt} />
        </td>
      </tr>
    );
  }
}
