import React, { useEffect, useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import useInterval from "use-interval";

import { ScoreGraph } from "./dashboard/ScoreGraph";
import { Leaderboard } from "./dashboard/Leaderboard";
import { ApiClient } from "./common/ApiClient";
import { xsuportal } from "./pb";

import { Index } from "./Index";

interface Props {
  client: ApiClient;
}

export const AudienceDashboard: React.FC<Props> = ({ client }) => {
  const [
    dashboard,
    setDashboard,
  ] = React.useState<xsuportal.proto.services.audience.DashboardResponse | null>(
    null
  );

  const updateDashboard = async () => {
    setDashboard(await client.getAudienceDashboard());
  };

  useEffect(() => {
    if (!dashboard) {
      (async () => {
        updateDashboard();
      })();
    }
  }, [dashboard]);

  useInterval(() => {
    (async () => {
      updateDashboard();
    })();
  }, 5000);

  return (
    <>
      <div className="container">
        <section className="is-fullwidth px-5 py-5">
          <ScoreGraph teams={dashboard?.leaderboard?.teams} />
        </section>
        <section className="is-fullwidth px-5 py-5">
          <Leaderboard leaderboard={dashboard?.leaderboard} />
        </section>
      </div>
    </>
  );
};
