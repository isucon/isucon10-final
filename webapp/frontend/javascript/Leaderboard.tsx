import React, { useState } from "react";
import useInterval from "use-interval";
import { ApiClient } from "./ApiClient";

import type { xsuportal } from "./pb";

type Team = {
  score: number;
  team: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem;
};

interface TeamItemProps {
  rank: number;
  team: Team;
}

const TeamItem: React.FC<TeamItemProps> = ({ rank, team }) => (
  <tr>
    <th>{rank}</th>
    <td>{team.score}</td>
    <td>{team.team.name}</td>
    <td>
      {team.team.isStudent && (
        <span className="tag is-info is-pulled-right">学生チーム</span>
      )}
    </td>
  </tr>
);

type Mode = "all" | "general" | "students";

interface Props {
  client: ApiClient;
}

export const Leaderboard: React.FC<Props> = ({ client }) => {
  const [mode, setMode] = useState<Mode>("all");
  const [topTeams, setTopTeams] = useState<Team[]>([]);

  useInterval(
    async () => {
      setTopTeams(await client.getLeaderboard());
    },
    1000,
    true
  );

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
            <th>Score</th>
            <th>Team</th>
            <th>{/* isStudent? */}</th>
          </tr>
        </thead>
        <tbody>
          {topTeams
            .filter(({ team }) => {
              switch (mode) {
                case "all":
                  return true;
                case "general":
                  return !team.isStudent;
                case "students":
                  return team.isStudent;
                default:
                  true;
              }
            })
            .map((team, rank) => (
              <TeamItem team={team} rank={rank} key={rank} />
            ))}
        </tbody>
      </table>
    </>
  );
};
