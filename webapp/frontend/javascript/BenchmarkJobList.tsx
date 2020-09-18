import { xsuportal } from "./pb";

import React from "react";
import { Link } from "react-router-dom";

import { TimeDuration } from "./TimeDuration";
import { Timestamp } from "./Timestamp";
import { BenchmarkJobStatus } from "./BenchmarkJobStatus";

export interface Props {
  list: xsuportal.proto.resources.IBenchmarkJob[];
}

export const BenchmarkJobList: React.FC<Props> = (props: Props) => {
  const renderJob = (
    job: xsuportal.proto.resources.IBenchmarkJob,
    i: number
  ) => {
    const id = job.id!.toString();
    return (
      <tr key={id}>
        <td>
          <Link to={`/contestant/benchmark_jobs/${encodeURIComponent(id)}`}>
            #{id}
          </Link>
        </td>
        <td className="has-text-right">{job.result?.score}</td>
        <td>
          <BenchmarkJobStatus status={job.status!} />
        </td>
        <td>
          <Timestamp timestamp={job.createdAt!} />
        </td>
        <td>
          <TimeDuration a={job.createdAt!} b={job.finishedAt} />
        </td>
      </tr>
    );
  };
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Score</th>
          <th>Status</th>
          <th>Time</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>{props.list.map(renderJob)}</tbody>
    </table>
  );
};
