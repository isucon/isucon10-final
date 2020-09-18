import type { google } from "./pb";
import dayjs from "dayjs";

import React from "react";

export interface Props {
  timestamp: google.protobuf.ITimestamp;
  short?: boolean;
}

export const Timestamp: React.FC<Props> = (props: Props) => {
  const ts = props.timestamp;
  if (ts) {
    const t = dayjs(
      (ts.seconds as number) * 1000 + (ts.nanos as number) / 1000000
    );
    return (
      <time dateTime={t.toISOString()}>
        {t.format(props.short ? "HH:mm:ss" : "YYYY-MM-DD HH:mm:ss.SSS")}
      </time>
    );
  } else {
    return <></>;
  }
};
