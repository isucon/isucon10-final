import React, { useEffect, useCallback, useState } from "react";
import useInterval from "use-interval";

import { ScoreGraph } from "./ScoreGraph";
import { Leaderboard } from "./Leaderboard";
import { JobEnqueueForm } from "./JobEnqueueForm";
import { JobList } from "./JobList";
import { ApiClient } from "./ApiClient";
import { xsuportal } from "./pb";

interface Props {
  client: ApiClient;
}

export const Dashboard: React.FC<Props> = ({ client }) => {
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
            <JobList client={client} />
          </section>
        </div>
      </div>
    </div>
  );
};
