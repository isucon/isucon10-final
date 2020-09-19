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
    targetId: string;
  }>({
    defaultValues: {
      targetId: window.localStorage.getItem("xsuportal-last-target-id") || "",
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      setRequesting(true);
      const resp = await props.client.enqueueBenchmarkJob({
        targetHostname: "target hostname (仮)",
      });
      try {
        window.localStorage.setItem("xsuportal-last-target-id", data.targetId);
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
              <div className="select is-fullwidth">
                <select name="targetId" ref={register}>
                  <option key="1" value="1">
                    1: host1
                  </option>
                  {/* {(props.session.contestantInstances || []).map((ci) => {
                    return (
                      <option key={ci.id!.toString()} value={ci.id!.toString()}>
                        {ci.number}: {ci.publicIpv4Address}
                      </option>
                    );
                  })} */}
                </select>
              </div>
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
