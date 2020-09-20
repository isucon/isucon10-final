import { xsuportal } from "../pb";
import { ApiError, ApiClient } from "../ApiClient";

import React from "react";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "../ErrorMessage";

type Props = {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
};

export const ContestantBenchmarkJobForm: React.FC<Props> = (props: Props) => {
  const [redirect, setRedirect] = React.useState<JSX.Element | null>(null);
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { register, handleSubmit, watch, setValue, errors } = useForm<{
    targetHostname: string;
  }>({
    defaultValues: {
      targetHostname:
        window.localStorage.getItem("xsuportal-last-target-hostname") || "",
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      setRequesting(true);
      const resp = await props.client.enqueueBenchmarkJob({
        targetHostname: data.targetHostname,
      });
      try {
        window.localStorage.setItem(
          "xsuportal-last-target-hostname",
          data.targetHostname
        );
      } catch (e) {
        console.warn(e);
      }
      setRedirect(
        <Redirect
          push={true}
          to={{
            pathname: `/contestant/benchmark_jobs/${encodeURIComponent(
              resp.job!.id!.toString()
            )}`,
          }}
        />
      );
    } catch (e) {
      setError(e);
      setRequesting(false);
    }
  });

  return (
    <div className="card mt-5">
      {redirect}
      <div className="card-content">
        <form onSubmit={onSubmit}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-fullwidth"
                type="text"
                name="targetHostname"
                placeholder="target hostname"
                ref={register}
              />
            </div>
            <div className="control">
              <button
                className="button is-primary"
                type="submit"
                disabled={requesting}
              >
                Enqueue
              </button>
            </div>
          </div>
          <p className="is-size-7">
            ベンチ対象サーバーを選択して Enqueue
            してください。最終計測には最後に利用したサーバーが利用されます。
          </p>
          {error ? <ErrorMessage error={error} /> : null}
        </form>
      </div>
    </div>
  );
};
