import { xsuportal } from "./pb";

import React from "react";
import { Link } from "react-router-dom";

import { BenchmarkJobStatus } from "./BenchmarkJobStatus";
import { Timestamp } from "./Timestamp";

export interface Props {
  job: xsuportal.proto.resources.IBenchmarkJob;
  admin?: boolean;
}

const renderJobSummary = (
  job: xsuportal.proto.resources.IBenchmarkJob,
  admin: boolean
) => {
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
          <b>Target:</b> {job.targetHostname}
        </p>
        <p>
          <b>Status:</b> <BenchmarkJobStatus status={job.status!} />
        </p>
        <p>
          <b>Enqueued At:</b> <Timestamp timestamp={job.createdAt!} />
        </p>
        <p>
          <b>Updated At:</b> <Timestamp timestamp={job.updatedAt!} />
        </p>
        <p>
          <b>Started At:</b>{" "}
          {job.startedAt ? <Timestamp timestamp={job.startedAt} /> : "N/A"}
        </p>
        <p>
          <b>Finished At:</b>{" "}
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
              <span className="tag is-success ml-2">Passed</span>
            ) : (
              <span className="tag is-danger ml-2">Failed</span>
            )
          ) : null}
        </p>
        <p>
          <b>Marked At:</b> <Timestamp timestamp={result.markedAt!} />
        </p>
        <p>
          <b>Score:</b> {result.score}
        </p>
        {result.scoreBreakdown ? (
          <p>
            <b>Score Breakdown:</b> base={result.scoreBreakdown.raw}, deduction=
            {result.scoreBreakdown.deduction}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const renderJobExecution = (
  job: xsuportal.proto.resources.IBenchmarkJob,
  admin: boolean
) => {
  if (!job.result) return;
  const execution = job.result;
  return (
    <div className="card mt-5">
      <header className="card-header">
        <h4 className="is-4 card-header-title">Conclusion</h4>
      </header>
      <div className="card-content">
        <p>
          <b>Reason:</b> {execution.reason}
        </p>
      </div>
    </div>
  );
};

export const BenchmarkJobDetail: React.FC<Props> = (props: Props) => {
  const { job } = props;
  return (
    <>
      <section>
        {renderJobSummary(job, !!props.admin)}
        {props.admin ? renderTeam(job.team!) : null}
        {renderJobResult(job)}
        {renderJobExecution(job, !!props.admin)}
      </section>
    </>
  );
};
