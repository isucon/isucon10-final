import type { xsuportal } from "./pb";
import React from "react";

import { Timestamp } from "./Timestamp";
import type { TeamPinsMap } from "./TeamPins";

const NUMBER_OF_ROWS_VISIBLE_BY_DEFAULT = 25;

interface TeamItemProps {
  position: number;
  item: xsuportal.proto.resources.Leaderboard.ILeaderboardItem;
  changed: boolean;
  pinned: boolean;
  onPin: (teamId: string, flag: boolean) => void;
  me: boolean;
  itemType: ItemType;
  lastPosition?: number;
}
type ItemType = "pinned" | "standings" | "me";

const TeamItem: React.FC<TeamItemProps> = (props: TeamItemProps) => {
  const {
    position,
    lastPosition,
    changed,
    item,
    pinned,
    onPin,
    me,
    itemType,
  } = props;
  const [animationClassName, setAnimationClassName] = React.useState<
    string | null
  >(null);
  const [animationEpoch, setAnimationEpoch] = React.useState<number>(0);

  const studentStatus = item.team!.student?.status && (
    <span className="tag is-info is-pulled-right">学生</span>
  );
  const classNames = [];
  if (pinned && itemType == "pinned") classNames.push("xsu-leaderboard-pinned");
  if (me) classNames.push("xsu-leaderboard-me");
  if (animationClassName) classNames.push(animationClassName);

  React.useEffect(() => {
    if (!lastPosition) return;
    if (!changed) return;
    const set = lastPosition && lastPosition != position;
    if (lastPosition > position) {
      setAnimationClassName("xsu-leaderboard-change-up");
    } else if (lastPosition < position) {
      setAnimationClassName("xsu-leaderboard-change-down");
    }
    if (!set) return;
    setAnimationEpoch(animationEpoch + 1);
  }, [lastPosition, position]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimationClassName(null);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [animationEpoch]);

  return (
    <tr className={classNames.join(" ")}>
      <th className="has-text-centered">
        {me ? null : (
          <i
            className={`xsu-pin-button is-small ${
              pinned
                ? "material-icons has-text-danger"
                : "material-icons-outlined has-text-grey-light"
            }`}
            onClick={() => onPin(item.team!.id!.toString(), !pinned)}
          >
            push_pin
          </i>
        )}
      </th>
      <th className="has-text-right">{position}</th>
      <td>
        {item.team!.id}: {item.team!.name}
      </td>
      <td className="has-text-right">{item.bestScore?.score || 0}</td>
      <td className="has-text-weight-semibold has-text-right">
        {item.latestScore?.score || 0}
      </td>
      <td>
        {item.latestScore ? (
          <Timestamp timestamp={item.latestScore.markedAt!} short />
        ) : (
          "N/A"
        )}
      </td>
      <td>{studentStatus}</td>
    </tr>
  );
};

type Mode = "all" | "general" | "students" | "hidden";

interface Props {
  teamPins: TeamPinsMap;
  onPin: (teamId: string, flag: boolean) => void;
  leaderboard: xsuportal.proto.resources.ILeaderboard;
  teamId?: number | Long;
  enableHiddenTeamsMode?: boolean;
}

const usePrevious = function <T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const chooseTeamList = (
  mode: Mode,
  leaderboard: xsuportal.proto.resources.ILeaderboard
) => {
  switch (mode) {
    case "all":
      return leaderboard.teams || [];
    case "general":
      return leaderboard.generalTeams || [];
    case "students":
      return leaderboard.studentTeams || [];
    default:
      throw new Error("[BUG] invalid mode");
  }
};

export const Leaderboard: React.FC<Props> = (props: Props) => {
  const { leaderboard, teamId } = props;
  const [expanded, setExpanded] = React.useState(false);
  const pins = props.teamPins;
  const [mode, setMode] = React.useState<Mode>("all");

  const prevProps = usePrevious(props);
  const prevLeaderboard = prevProps?.leaderboard;

  const filteredTeams = chooseTeamList(mode, leaderboard);
  const prevFilteredTeams =
    prevLeaderboard && chooseTeamList(mode, prevLeaderboard);

  const prevRanks = new Map(
    (prevFilteredTeams || []).map((t, idx) => {
      return [t.team!.id, idx + 1];
    })
  );
  const prevScores = new Map(
    (prevFilteredTeams || []).map((t, idx) => {
      return [t.team!.id, t.latestScore?.score!];
    })
  );

  type TeamStanding = {
    position: number;
    item: xsuportal.proto.resources.Leaderboard.ILeaderboardItem;
    pinned: boolean;
    me: boolean;
    lastPosition?: number;
    lastScore?: number | Long;
  };
  const teams = filteredTeams.map(
    (item, idx): TeamStanding => {
      const pinned = pins.has(item.team!.id!.toString());
      const me = item.team!.id === teamId;
      if (
        prevRanks.get(item.team!.id!) &&
        prevRanks.get(item.team!.id!) !== idx + 1
      )
        console.log(item);
      return {
        position: idx + 1,
        lastPosition: prevRanks.get(item.team!.id!),
        lastScore: prevScores.get(item.team!.id!),
        item,
        pinned,
        me,
      };
    }
  );
  const renderTeam = (key: string, standing: TeamStanding) => {
    const { item, pinned, me, position, lastPosition, lastScore } = standing;
    return (
      <TeamItem
        item={item}
        position={position}
        lastPosition={lastPosition}
        changed={lastScore != item.latestScore?.score!}
        key={`${mode}-${key}-${item.team!.id!.toString()}`}
        pinned={pinned}
        onPin={props.onPin}
        me={me}
        itemType={key as ItemType}
      />
    );
  };
  const teamMe = teams.filter((v) => v.me);
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
          {props.enableHiddenTeamsMode ? (
            <li className={mode === "hidden" ? "is-active" : ""}>
              <a onClick={() => setMode("hidden")}>
                <span>Hidden</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
      <table className="table is-hoverable is-fullwidth xsu-leaderboard">
        <thead>
          <tr className="has-background-light">
            <th></th>
            <th className="has-text-right">#</th>
            <th>Team</th>
            <th className="has-text-right">Best</th>
            <th className="has-text-right">Latest</th>
            <th>Time</th>
            <th>{/* isStudent? */}</th>
          </tr>
        </thead>
        <tbody>
          {teamMe[0] && teamMe[0].position > NUMBER_OF_ROWS_VISIBLE_BY_DEFAULT
            ? teamMe.map((v) => renderTeam("me", v))
            : []}
          {teams.filter((v) => v.pinned).map((v) => renderTeam("pinned", v))}
          {teams
            .slice(0, expanded ? undefined : NUMBER_OF_ROWS_VISIBLE_BY_DEFAULT)
            .map((v) => renderTeam("standings", v))}
          <tr>
            <td colSpan={7} className="has-text-centered">
              {expanded ? (
                <button
                  className="button is-text"
                  onClick={() => setExpanded(false)}
                >
                  Collapse...
                </button>
              ) : (
                <button
                  className="button is-text"
                  onClick={() => setExpanded(true)}
                >
                  Show All
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
