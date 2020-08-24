import React, { useRef, useCallback, useState } from "react";
import { ApiClient, ApiError } from "../common/ApiClient";
import { ErrorMessage } from "../common/ErrorMessage";

const renderError = (error: Error | ApiError | null) => {
  if (error) {
    return <ErrorMessage error={error} />;
  } else {
    return <></>;
  }
};

interface Props {
  client: ApiClient;
}

export const JobEnqueueForm: React.FC<Props> = ({ client }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | ApiError | null>(null);
  const handleClick = useCallback(async () => {
    if (inputRef?.current?.value && inputRef.current.value.length > 0) {
      try {
        await client.enqueueBenchmarkJob({
          targetHostname: inputRef.current.value,
        });
        inputRef.current.value = "";
        setError(null);
      } catch (error) {
        setError(error);
      }
    }
  }, [!inputRef, error]);

  return (
    <>
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
      {renderError(error)}
    </>
  );
};
