import type { xsuportal } from "./pb";

import React from "react";
import uPlot from "uplot";

import type { TeamPinsMap } from "./TeamPins";
import { COLORS } from "./ScoreGraphColors";

interface Props {
  teams: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[];
  contest: xsuportal.proto.resources.IContest;
  width?: number;
  teamPins: TeamPinsMap;
  teamId?: number | Long;
}

const calculateGraphCacheKey = (
  teams: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]
) => {
  let numTeams = teams.length;
  let numScores = teams
    .map((item) => (item.scores || []).length)
    .reduce((a, b) => a + b, 0);

  let latestTimestamp = 0;
  teams.forEach((item) => {
    (item.scores || []).forEach((score) => {
      const ts = score.markedAt!.seconds! as number;
      if (latestTimestamp < ts) latestTimestamp = ts;
    });
  });

  return [numTeams, numScores, latestTimestamp];
};

export const ScoreGraph: React.FC<Props> = ({
  teams,
  contest,
  width,
  teamId,
  teamPins,
}) => {
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false);

  const elem = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<Array<Array<number | null>>>([]);
  const [chart, setChart] = React.useState<uPlot | null>(null);

  const teamIds = teams.map((i) => i.team!.id).join(",");
  const teamIdCount = teams.length;
  const cacheKey = JSON.stringify(calculateGraphCacheKey(teams));
  //console.log("render", cacheKey);

  const targetTeams = showPinnedOnly
    ? teams.filter(
        (item) =>
          teamPins.has(item.team!.id!.toString()) || item.team!.id! == teamId
      )
    : teams;

  React.useEffect(() => {
    //console.log("ScoreGraph: setData", cacheKey);
    const timestamps: number[] = [
      ...new Set(
        targetTeams.flatMap((item) =>
          item.scores!.map((s) => s.markedAt!.seconds! as number)
        )
      ),
    ].sort((a, b) => a - b);
    const newData: Array<Array<number | null>> = [timestamps];

    targetTeams.forEach((item, idx) => {
      const scores = item.scores || [];
      const lastTs =
        scores.length > 0 ? scores[scores.length - 1]?.markedAt!.seconds : 0;
      const series = [];
      let tsPtr = 0;
      let scorePtr = -1;
      while (tsPtr < timestamps.length) {
        const ts = timestamps[tsPtr];

        const score = scores[scorePtr];
        const scoreNext = scores[scorePtr + 1];

        //console.log({team: item.team!.id!, tsPtr: tsPtr, scorePtr: scorePtr, now: ts, cur: scores[scorePtr]?.markedAt?.seconds!, next: scoreNext?.markedAt?.seconds! });

        if (!score || (score && ts >= score.markedAt!.seconds!)) {
          if (scoreNext && ts >= scoreNext.markedAt!.seconds!) {
            scorePtr++;
          }
        }

        //if (lastTs && lastTs < ts) {
        //  series.push(null);
        //} else {
        if (scorePtr >= 0) {
          series.push(scores[scorePtr].score! as number);
        } else {
          series.push(0);
        }
        //}

        tsPtr++;
      }
      newData.push(series);
    });

    setData(newData);
  }, [setData, cacheKey]);

  React.useEffect(() => {
    if (!elem.current) return;
    if (!(data[0] && data[0].length - 1 >= teamIdCount)) return;
    //console.log("ScoreGraph: setChart");

    const opts: uPlot.Options = {
      width: width || 950,
      height: 500,
      scales: {
        x: {
          auto: false,
          range: (min, max) => [
            contest.contestStartsAt!.seconds! as number,
            contest.contestEndsAt!.seconds! as number,
          ],
        },
        pt: {
          auto: true,
        },
      },
      series: [
        {
          scale: "x",
        },
        ...targetTeams.map((item) => {
          return {
            label: item.team!.name!,
            stroke: COLORS[(item.team!.id! as number) % COLORS.length],
            scale: "pt",
          };
        }),
      ],
      axes: [
        {},
        {
          label: "Score",
          scale: "pt",
          show: true,
        },
      ],
    };
    //console.log(data);

    const newChart = new uPlot(opts, data, elem.current);
    setChart(newChart);
    return () => newChart.destroy();
  }, [
    setChart,
    elem.current,
    data[0] && data[0].length,
    teamIds,
    teamIdCount,
    showPinnedOnly ? teamPins : null,
  ]);

  React.useEffect(() => {
    if (!chart || !data) return;
    console.log(
      `ScoreGraph: chart.setData data=${data[0] && data[0].length}, series=${
        chart.series.length
      }, teamids=${teamIdCount}`
    );
    if (
      data[0] &&
      data[0].length - 1 >= teamIdCount &&
      chart.series.length - 1 >= teamIdCount
    ) {
      chart.setData(data);
    }
  }, [chart, teamIds, teamIdCount, data]);

  const classNames = ["xsu-scoregraph"];
  if (showPinnedOnly) classNames.push("xsu-scoregraph-pinnedonly");

  return (
    <section>
      <div className="level">
        <div className="level-left">
          <h5 className="title is-5">Timeline</h5>
        </div>

        <div className="level-right has-text-right">
          <label>
            <input
              type="checkbox"
              checked={showPinnedOnly}
              onChange={(e) => setShowPinnedOnly(e.target.checked)}
            />
            Show pinned only
          </label>
        </div>
      </div>
      <div className={classNames.join(" ")} ref={elem} />
    </section>
  );
};
