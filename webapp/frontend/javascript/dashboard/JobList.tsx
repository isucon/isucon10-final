import React, { useState } from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import { xsuportal } from "../pb";
import { BenchmarkJobStatus } from "./BenchmarkJobStatus";

interface JobListItemProps {
  job: xsuportal.proto.resources.IBenchmarkJob;
}

const STATUS_COLOR_MAP = new Map<number, string>([
  [xsuportal.proto.resources.BenchmarkJob.Status.PENDING, "white"],
  [xsuportal.proto.resources.BenchmarkJob.Status.RUNNING, "info-light"],
  [xsuportal.proto.resources.BenchmarkJob.Status.ERRORED, "danger-light"],
  [xsuportal.proto.resources.BenchmarkJob.Status.CANCELLED, "warning-light"],
  [xsuportal.proto.resources.BenchmarkJob.Status.FINISHED, "success-light"],
]);

const STATUS_TEXT_MAP = new Map<number, string>([
  [xsuportal.proto.resources.BenchmarkJob.Status.PENDING, "Pending"],
  [xsuportal.proto.resources.BenchmarkJob.Status.SENT, "Sent"],
  [xsuportal.proto.resources.BenchmarkJob.Status.RUNNING, "Running"],
  [xsuportal.proto.resources.BenchmarkJob.Status.ERRORED, "Failed"],
  [xsuportal.proto.resources.BenchmarkJob.Status.CANCELLED, "Cancelled"],
  [xsuportal.proto.resources.BenchmarkJob.Status.FINISHED, "Success"],
]);

const JobListItem: React.FC<JobListItemProps> = ({ job }) => {
  const trClassName =
    job.status != null
      ? `has-background-${STATUS_COLOR_MAP.get(job.status)}`
      : "";
  return (
    <tr className={trClassName}>
      <td className="has-text-centered">
        <Link to={`/contestant/benchmark_jobs/${job.id}`}>{job.id}</Link>
      </td>
      <td className="has-text-centered">{job.targetHostname}</td>
      <td className="has-text-centered">
        {job.createdAt?.seconds
          ? dayjs((job.createdAt?.seconds as number) * 1000).format("HH:MM:ss")
          : ""}
      </td>
      <td className="has-text-centered">
        {job.finishedAt?.seconds
          ? dayjs((job.finishedAt?.seconds as number) * 1000).format("HH:MM:ss")
          : ""}
      </td>
      <td className="has-text-centered">
        <BenchmarkJobStatus status={job.status!} />
        {job.result?.finished ? (
          job.result.passed ? (
            <span className="tag is-success">Passed</span>
          ) : (
            <span className="tag is-danger">Failed</span>
          )
        ) : null}
      </td>
      <td className="has-text-centered">{job.result?.score}</td>
    </tr>
  );
};

interface Props {
  jobs: xsuportal.proto.resources.IBenchmarkJob[] | null;
}

export const JobList: React.FC<Props> = ({ jobs }) => {
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr className="has-background-light">
          <th className="has-text-centered">Job ID</th>
          <th className="has-text-centered">Target</th>
          <th className="has-text-centered">Created</th>
          <th className="has-text-centered">Finished</th>
          <th className="has-text-centered">Status</th>
          <th className="has-text-centered">Score</th>
        </tr>
      </thead>
      <tbody>
        {jobs?.slice(0, 5).map((job, key) => (
          <JobListItem job={job} key={key} />
        ))}
      </tbody>
    </table>
  );
};
