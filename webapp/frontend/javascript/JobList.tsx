import React, { useState } from "react";
import dayjs from "dayjs";
import { xsuportal } from "./pb";

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
  [xsuportal.proto.resources.BenchmarkJob.Status.RUNNING, "Running"],
  [xsuportal.proto.resources.BenchmarkJob.Status.ERRORED, "Failed"],
  [xsuportal.proto.resources.BenchmarkJob.Status.CANCELLED, "Cancelled"],
  [xsuportal.proto.resources.BenchmarkJob.Status.FINISHED, "Success"],
]);

const JobListItem: React.FC<JobListItemProps> = ({ job }) => {
  if (job?.status) {
    return (
      <tr className={`has-background-${STATUS_COLOR_MAP.get(job?.status)}`}>
        <td className="has-text-centered">
          {job.startedAt?.seconds
            ? dayjs((job.startedAt?.seconds as number) * 1000).format(
                "HH:MM:ss"
              )
            : ""}
        </td>
        <td className="has-text-centered">
          {job.finishedAt?.seconds
            ? dayjs((job.finishedAt?.seconds as number) * 1000).format(
                "HH:MM:ss"
              )
            : ""}
        </td>
        <td className="has-text-centered">
          {STATUS_TEXT_MAP.get(job?.status)}
        </td>
      </tr>
    );
  } else {
    return <></>;
  }
};

interface Props {
  jobs: xsuportal.proto.resources.IBenchmarkJob[] | undefined;
}

export const JobList: React.FC<Props> = ({ jobs }) => {
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr className="has-background-light">
          <th className="has-text-centered">Started</th>
          <th className="has-text-centered">Finished</th>
          <th className="has-text-centered">Status</th>
        </tr>
      </thead>
      <tbody>
        {jobs?.map((job, key) => (
          <JobListItem job={job} key={key} />
        ))}
      </tbody>
    </table>
  );
};
