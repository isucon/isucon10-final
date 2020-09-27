import type { google } from "./pb";

import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

import React from "react";

export interface Props {
  a: google.protobuf.ITimestamp;
  b?: google.protobuf.ITimestamp | undefined | null;
}

export const TimeDuration: React.FC<Props> = (props: Props) => {
  const tA = dayjs((props.a.seconds as number) * 1000 + (props.a.nanos as number) / 1000000);
  const tB = props.b ? dayjs((props.b.seconds as number) * 1000 + (props.b.nanos as number) / 1000000) : dayjs();
  const d = dayjs.duration(tB.diff(tA));
  return <span>{d.humanize(false)}</span>;
};

