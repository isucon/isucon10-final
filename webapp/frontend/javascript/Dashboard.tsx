import React, { useEffect, useCallback } from "react";

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
    (async () => {
      setDashboard(await client.getDashboard());
    })();
  }, [client]);

  return (
    <div className="container">
      <section className="is-fullwidth px-5 py-5">
        <ScoreGraph client={client} />
      </section>
      <div className="columns">
        <div className="column is-7 px-5">
          <section className="py-5">
            <p className="title"> Leader Board </p>
            <Leaderboard client={client} dashboard={dashboard} />
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
