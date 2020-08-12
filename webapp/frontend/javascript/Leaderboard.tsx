import React, { useState, useEffect } from "react";

import type { xsuportal } from "./pb";

interface TeamItemProps {
  rank: number;
  item: xsuportal.proto.resources.Leaderboard.ILeaderboardItem;
}

const TeamItem: React.FC<TeamItemProps> = ({ rank, item }) => {
  const latestScoreMarkedAt =
    item.latestScore?.markedAt?.seconds &&
    new Date(
      (item.latestScore.markedAt.seconds as number) * 1000
    ).toLocaleTimeString();
  const studentStatus = item.team?.student?.status && (
    <span className="tag is-info is-pulled-right">学生チーム</span>
  );
  return (
    <tr>
      <th>{rank + 1}</th>
      <td>{item.team?.id}</td>
      <td>{item.team?.name}</td>
      <td>{item.bestScore?.score}</td>
      <td>{item.latestScore?.score}</td>
      <td>{latestScoreMarkedAt}</td>
      <td>{studentStatus}</td>
    </tr>
  );
};

type Mode = "all" | "general" | "students";

interface Props {
  leaderboard: xsuportal.proto.resources.ILeaderboard | undefined | null;
}

export const Leaderboard: React.FC<Props> = ({ leaderboard }) => {
  const [mode, setMode] = useState<Mode>("all");

  return (
    <>
      <div className="tabs is-boxed mb-0">
        <ul>
          <li className={mode === "all" ? "is-active" : ""}>
            <a onClick={() => setMode("all")}>
              <span>All</span>
            </a>
          </li>
          <li className={mode === "general" ? "is-active" : ""}>
            <a onClick={() => setMode("general")}>
              <span>General</span>
            </a>
          </li>
          <li className={mode === "students" ? "is-active" : ""}>
            <a onClick={() => setMode("students")}>
              <span>Students</span>
            </a>
          </li>
        </ul>
      </div>
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr className="has-background-light">
            <th>Rank</th>
            <th>Id</th>
            <th>Name</th>
            <th>Best Score</th>
            <th>Latest Score</th>
            <th>Finish Time</th>
            <th>{/* isStudent? */}</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.teams
            ? leaderboard.teams
                .filter(({ team }) => {
                  switch (mode) {
                    case "all":
                      return true;
                    case "general":
                      return !team?.student?.status;
                    case "students":
                      return team?.student?.status;
                    default:
                      true;
                  }
                })
                .map((team, rank) => (
                  <TeamItem item={team} rank={rank} key={rank} />
                ))
            : null}
        </tbody>
      </table>
    </>
  );
};
