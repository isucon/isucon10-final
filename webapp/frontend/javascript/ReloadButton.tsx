import React from "react";

export interface Props {
  requesting: boolean;
  onClick: () => any;
}

export const ReloadButton: React.FC<Props> = ({ requesting, onClick }) => {
  return (
    <button className="button is-light is-small" disabled={requesting} onClick={onClick} aria-label="Reload">
      <span className="material-icons">refresh</span>
    </button>
  );
};
