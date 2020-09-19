export type TeamPinsMap = Map<string, boolean>;

const loadPins = () => {
  const map: TeamPinsMap = new Map();
  const item = window.localStorage.getItem("xsuportal-dashboard-pins");
  if (item) {
    const teamIds: string[] = JSON.parse(item);
    for (const id of teamIds) {
      map.set(id, true);
    }
  }
  return map;
};

const savePins = (pins: TeamPinsMap) => {
  const data = JSON.stringify(Array.from(pins.keys()));
  try {
    window.localStorage.setItem("xsuportal-dashboard-pins", data);
  } catch (e) {
    console.warn(e);
  }
};

export class TeamPins {
  pins: TeamPinsMap;
  public onChange?: (newMap: TeamPinsMap) => void;

  constructor() {
    this.pins = loadPins();
    this.set = this.set.bind(this);
  }

  public set(teamId: string, flag: boolean) {
    if (flag) {
      this.pins.set(teamId, true);
    } else {
      this.pins.delete(teamId);
    }
    savePins(this.pins);
    if (this.onChange) this.onChange(this.all());
  }

  public all(): TeamPinsMap {
    return new Map(this.pins);
  }
}
