import React, { useRef, useCallback } from "react";
import { ApiClient } from "./ApiClient";

interface Props {
  client: ApiClient;
}

export const JobEnqueueForm: React.FC<Props> = ({ client }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => {
    if (inputRef?.current?.value && inputRef.current.value.length > 0) {
      client.enqueueBenchmarkJob({ targetHostname: inputRef.current.value });
      inputRef.current.value = "";
    }
  }, [!inputRef]);

  return (
    <div className="field has-addons">
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Target Hostname"
          ref={inputRef}
        />
      </div>
      <div className="control">
        <button className="button is-primary" onClick={handleClick}>
          Enqueue
        </button>
      </div>
    </div>
  );
};
