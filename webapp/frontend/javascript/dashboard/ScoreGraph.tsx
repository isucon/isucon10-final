import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { BasicTooltip } from "@nivo/tooltip";
import dayjs from "dayjs";

import type { PointTooltipProps, Serie } from "@nivo/line";
import { xsuportal } from "../pb";

const ToolTip = React.memo<PointTooltipProps>(({ point }) => (
  <BasicTooltip
    id={
      <div>
        <p>
          <strong>Team:</strong> {point.serieId}
        </p>
        <p>
          <strong>Score:</strong> {point.data.yFormatted}
        </p>
        <p>
          <strong>Marked At:</strong> {point.data.xFormatted}
        </p>
      </div>
    }
    enableChip={false}
    color={point.serieColor}
  />
));

interface Props {
  teams:
    | xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]
    | undefined
    | null;
}

export const ScoreGraph: React.FC<Props> = ({ teams }) => {
  const [series, setSeries] = useState<Serie[]>([]);

  useEffect(() => {
    if (teams) {
      setSeries(
        teams.map((team) => {
          return {
            id: team.team?.name || "",
            data:
              team.scores?.map((score) => {
                const time = dayjs(
                  (score.markedAt?.seconds as number) * 1000
                ).format("HH:mm:ss");
                return {
                  x: time,
                  y: score.score as number,
                };
              }) || [],
          };
        })
      );
    }
  }, [teams]);

  return (
    <div className="is-fullwidth" style={{ height: 480 }}>
      <ResponsiveLine
        data={series}
        margin={{ top: 10, right: 100, bottom: 55, left: 55 }}
        xScale={{
          type: "time",
          format: "%H:%M:%S",
          useUTC: false,
          precision: "second",
        }}
        xFormat="time:%H:%M:%S"
        yScale={{ type: "linear" }}
        axisBottom={{
          format: "%H:%M:%S",
          legend: "Time",
          legendOffset: 50,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickRotation: 0,
          legend: "Score",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        enableGridX={true}
        enableGridY={true}
        colors={{ scheme: "category10" }}
        lineWidth={1}
        pointSize={3}
        pointColor={{ theme: "background" }}
        pointBorderWidth={1}
        pointBorderColor={{ from: "serieColor" }}
        useMesh={true}
        tooltip={ToolTip}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: 80,
            itemHeight: 12,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};
