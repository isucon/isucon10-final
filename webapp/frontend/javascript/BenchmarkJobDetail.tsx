import { xsuportal } from "./pb";

import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Timestamp } from "./Timestamp";
import { ApiClient } from "./ApiClient";

export interface Props {
  client: ApiClient;
  id: number;
}

const renderJobSummary = (job: xsuportal.proto.resources.IBenchmarkJob) => {
  return (
    <div className="card mt-5">
      <header className="card-header">
        <h4 className="is-4 card-header-title">Summary</h4>
      </header>
      <div className="card-content">
        <p>
          <b>ID:</b> {job.id}
        </p>
        <p>
          <b>Status:</b>
          {xsuportal.proto.resources.BenchmarkJob.Status[job.status!]}
        </p>
        <p>
          <b>Enqueued At:</b>
          {job.createdAt ? <Timestamp timestamp={job.createdAt} /> : "N/A"}
        </p>
        <p>
          <b>Updated At:</b>
          {job.updatedAt ? <Timestamp timestamp={job.updatedAt} /> : "N/A"}
        </p>
        <p>
          <b>Started At:</b>
          {job.startedAt ? <Timestamp timestamp={job.startedAt} /> : "N/A"}
        </p>
        <p>
          <b>Finished At:</b>
          {job.finishedAt ? <Timestamp timestamp={job.finishedAt} /> : "N/A"}
        </p>
      </div>
    </div>
  );
};

const renderTeam = (team: xsuportal.proto.resources.ITeam) => {
  return (
    <div className="card mt-5">
      <header className="card-header">
        <h4 className="is-4 card-header-title">Team</h4>
      </header>
      <div className="card-content">
        <p>
          <Link to={`/admin/teams/${encodeURIComponent(team.id!.toString())}`}>
            {team.name} (#{team.id!.toString()})
          </Link>
        </p>
      </div>
    </div>
  );
};

const renderJobResult = (job: xsuportal.proto.resources.IBenchmarkJob) => {
  if (!job.result) return;
  const { result } = job;
  return (
    <div className="card mt-5">
      <header className="card-header">
        <h4 className="is-4 card-header-title">Result</h4>
      </header>
      <div className="card-content">
        <p>
          {result.finished ? (
            <span className="tag is-info">Finished</span>
          ) : (
            <span className="tag is-warning">In progress</span>
          )}
          {result.finished ? (
            result.passed ? (
              <span className="tag is-success">Passed</span>
            ) : (
              <span className="tag is-danger">Failed</span>
            )
          ) : null}
        </p>
        <p>
          <b>Marked At:</b>
          {job.result.markedAt ? (
            <Timestamp timestamp={job.result.markedAt} />
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <b>Score:</b> {result.score}
        </p>
        {result.scoreBreakdown ? (
          <p>
            + {result.scoreBreakdown.raw} - {result.scoreBreakdown.deduction}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const renderJobExecution = (job: xsuportal.proto.resources.IBenchmarkJob) => {
  if (!job.result) return;
  return (
    <div className="card mt-5">
      <header className="card-header">
        <h4 className="is-4 card-header-title">Conclusion</h4>
      </header>
      <div className="card-content">
        <p>
          <b>Reason:</b> {job.result.reason}
        </p>
      </div>
    </div>
  );
};

export const BenchmarkJobDetail: React.FC<Props> = ({ client, id }) => {
  const [
    job,
    setJob,
  ] = React.useState<xsuportal.proto.resources.IBenchmarkJob | null>(null);
  useEffect(() => {
    if (!job) {
      (async () => {
        setJob(await client.getBenchmarkJob(id));
      })();
    }
  }, [job]);
  if (job) {
    return (
      <section>
        {renderJobSummary(job)}
        {renderJobResult(job)}
        {renderJobExecution(job)}
      </section>
    );
  } else {
    return <>何も出ない</>;
  }
};
