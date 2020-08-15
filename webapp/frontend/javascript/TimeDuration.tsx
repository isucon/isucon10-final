
import {google} from "./pb";
import moment from "moment";

import React from "react";

export interface Props {
  a: google.protobuf.ITimestamp,
  b?: google.protobuf.ITimestamp | undefined | null,
}

export const TimeDuration: React.FC<Props> = (props: Props) => {
  const tA = moment((props.a.seconds as number) * 1000 + (props.a.nanos as number) / 1000000);
  const tB = props.b ? moment((props.b.seconds as number) * 1000 + (props.b.nanos as number) / 1000000) : moment();
  const d = moment.duration(tB.diff(tA));
  return <span>
    {d.humanize({s: 600, m: 120})}
  </span>;
}
