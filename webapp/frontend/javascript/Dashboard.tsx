import React, { useEffect, useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import useInterval from "use-interval";

import { ScoreGraph } from "./dashboard/ScoreGraph";
import { Leaderboard } from "./dashboard/Leaderboard";
import { JobEnqueueForm } from "./dashboard/JobEnqueueForm";
import { JobList } from "./dashboard/JobList";
import { ApiClient } from "./common/ApiClient";
import { xsuportal } from "./pb";

import { BenchmarkJobList } from "./BenchmarkJobList";
import { LoginRequired } from "./common/LoginRequired";
import { Index } from "./Index";

interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  root: Index;
}

export const Dashboard: React.FC<Props> = ({ session, client, root }) => {
  const [
    dashboard,
    setDashboard,
  ] = React.useState<xsuportal.proto.services.contestant.DashboardResponse | null>(
    null
  );
  useEffect(() => {
    if (!dashboard) {
      (async () => {
        setDashboard(await client.getDashboard());
      })();
    }
  }, [dashboard]);

  useInterval(() => {
    (async () => {
      setDashboard(await client.getDashboard());
    })();
  }, 5000);

  return (
    <>
      <LoginRequired root={root}></LoginRequired>
      <Router>
        <div className="container">
          <section className="is-fullwidth px-5 py-5">
            <ScoreGraph teams={dashboard?.leaderboard?.teams} />
          </section>
          <div className="columns">
            <div className="column is-7 px-5">
              <section className="py-5">
                <p className="title"> Leader Board </p>
                <Leaderboard leaderboard={dashboard?.leaderboard} />
              </section>
            </div>
            <div className="column is-5 px-5">
              <section className="py-5">
                <p className="title"> Job Enqueue Form </p>
                <JobEnqueueForm client={client} />
              </section>
              <section className="py-5">
                <p className="title"> Job List </p>
                <p>
                  <Link to="/benchmark_jobs">Show All</Link>
                </p>
                <JobList jobs={dashboard?.jobs} />
              </section>
            </div>
          </div>
        </div>
        <Switch>
          <Route path="/benchmark_jobs">
            <BenchmarkJobList
              session={session}
              client={client}
              incompleteOnly={false}
              root={root}
            />
          </Route>
        </Switch>
      </Router>
    </>
  );
};
