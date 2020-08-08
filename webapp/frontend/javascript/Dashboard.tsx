import React from "react";

import { ScoreGraph } from "./ScoreGraph";
import { Leaderboard } from "./Leaderboard";
import { JobEnqueueForm } from "./JobEnqueueForm";
import { JobList } from "./JobList";
import { ApiClient } from "./ApiClient";

interface Props {
  client: ApiClient;
}

export const Dashboard: React.FC<Props> = ({ client }) => {
  return (
    <div className="container">
      <section className="is-fullwidth px-5 py-5">
        <ScoreGraph client={client} />
      </section>
      <div className="columns">
        <div className="column is-7 px-5">
          <section className="py-5">
            <p className="title"> Leader Board </p>
            <Leaderboard client={client} />
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
