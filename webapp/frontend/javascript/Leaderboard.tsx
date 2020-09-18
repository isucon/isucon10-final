import type { xsuportal } from "./pb";
import React from "react";

import { Timestamp } from "./Timestamp";
import type { TeamPinsMap, TeamPins } from "./TeamPins";

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

const TeamItem: React.FC<TeamItemProps> = ({
  position,
  lastPosition,
  changed,
  item,
  pinned,
  onPin,
  me,
  itemType,
}) => {
  const [animationClassName, setAnimationClassName] = React.useState<
    string | null
  >(null);
  const [animationEpoch, setAnimationEpoch] = React.useState<number>(0);

  const studentStatus = item.team!.student?.status && (
    <span className="tag is-info is-pulled-right">学生</span>
  );
  const classNames = [];
  if (pinned && itemType == "pinned")
    classNames.push("isux-leaderboard-pinned");
  if (me) classNames.push("isux-leaderboard-me");
  if (animationClassName) classNames.push(animationClassName);

  React.useEffect(() => {
    if (!lastPosition) return;
    if (!changed) return;
    const set = lastPosition && lastPosition != position;
    if (lastPosition > position) {
      setAnimationClassName("isux-leaderboard-change-up");
    } else if (lastPosition < position) {
      setAnimationClassName("isux-leaderboard-change-down");
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
            className={`isux-pin-button is-small ${
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
      <td className="has-text-right">{item.latestScore?.score || 0}</td>
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

type Mode = "all" | "general" | "students";

interface Props {
  teamPins: TeamPinsMap;
  onPin: (teamId: string, flag: boolean) => void;
  leaderboard: xsuportal.proto.resources.ILeaderboard;
  teamId?: number | Long;
}

const usePrevious = function <T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Leaderboard: React.FC<Props> = (props: Props) => {
  const { leaderboard, teamId } = props;
  const [expanded, setExpanded] = React.useState(false);
  const pins = props.teamPins;
  const [mode, setMode] = React.useState<Mode>("all");

  const prevProps = usePrevious(props);
  const prevLeaderboard = prevProps?.leaderboard;
  const prevRanks = new Map(
    (prevLeaderboard?.teams || []).map((t, idx) => {
      return [t.team!.id, idx + 1];
    })
  );
  const prevScores = new Map(
    (prevLeaderboard?.teams || []).map((t, idx) => {
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
  const teams = leaderboard
    .teams!.filter(({ team }) => {
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
    .map(
      (item, idx): TeamStanding => {
        const pinned = pins.has(item.team!.id!.toString());
        const me = item.team!.id === teamId;
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
  const renderTeam = (
    key: string,
    { item, pinned, me, position, lastPosition, lastScore }: TeamStanding
  ) => {
    return (
      <TeamItem
        item={item}
        position={position}
        lastPosition={lastPosition}
        changed={lastScore != item.latestScore?.score!}
        key={`${key}-${item.team!.id!.toString()}`}
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
        </ul>
      </div>
      <table className="table is-hoverable is-fullwidth isux-leaderboard">
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
