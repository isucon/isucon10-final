import type { xsuportal } from "../pb";
import { ApiError, ApiClient } from "../ApiClient";
import { AdminApiClient } from "./AdminApiClient";

import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Clarification } from "../Clarification";
import { ErrorMessage } from "../ErrorMessage";

interface FormProps {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: AdminApiClient;
  clarification: xsuportal.proto.resources.IClarification;
  onSubmit: (clar: xsuportal.proto.resources.IClarification) => any;
}

const ClarForm: React.FC<FormProps> = (props: FormProps) => {
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { reset, register, handleSubmit, watch, setValue, errors } = useForm<{
    answer: string;
    question: string;
    disclose: boolean;
  }>({
    shouldUnregister: false,
    defaultValues: {
      question: props.clarification.question!,
      answer: props.clarification.answer!,
      disclose: props.clarification.disclosed!,
    },
  });

  const onSubmit = handleSubmit(async (data, e) => {
    try {
      setRequesting(true);
      console.log(data);
      const resp = await props.client.respondClarification({
        id: props.clarification.id!,
        answer: data.answer,
        question: data.question,
        disclose: data.disclose,
      });
      props.onSubmit(resp.clarification!);
      e!.target.reset();
      setRequesting(false);
    } catch (e) {
      setError(e);
      setRequesting(false);
    }
  });

  return (
    <div className="card mt-5">
      <div className="card-header">
        <h4 className="is-4 card-header-title">Response</h4>
      </div>
      <div className="card-content">
        <form onSubmit={onSubmit}>
          <div className="columns">
            <div className="column field is-6">
              <label
                className="label"
                htmlFor="AdminClarificationDetail-question"
              >
                Question
              </label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="question"
                  id="AdminClarificationDetail-question"
                  ref={register}
                  placeholder=""
                  autoFocus
                  disabled
                />
              </div>
            </div>
            <div className="column field is-6">
              <div className="control">
                <label
                  className="label"
                  htmlFor="AdminClarificationDetail-answer"
                >
                  Answer
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="answer"
                    id="AdminClarificationDetail-answer"
                    ref={register}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" name="disclose" ref={register} />
                Disclose (Visible to all teams)
              </label>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                type="submit"
                disabled={requesting}
              >
                Respond
              </button>
            </div>
          </div>
          {error ? <ErrorMessage error={error} /> : null}
        </form>
      </div>
    </div>
  );
};

export interface Props {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: AdminApiClient;
  id: string;
}

export const AdminClarificationDetail: React.FC<Props> = (props: Props) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [
    clar,
    setClar,
  ] = React.useState<xsuportal.proto.resources.IClarification | null>(null);

  React.useEffect(() => {
    props.client
      .getClarification(parseInt(props.id, 10))
      .then((resp) => setClar(resp.clarification!))
      .catch((e) => setError(e));
  }, []);
  const onClarSubmit = (clar: xsuportal.proto.resources.IClarification) => {
    setClar(clar);
  };

  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      {clar ? (
        <Clarification clarification={clar} admin={true} />
      ) : (
        <p>Loading..</p>
      )}
      {clar ? (
        <ClarForm
          session={props.session}
          client={props.client}
          onSubmit={onClarSubmit}
          clarification={clar}
        />
      ) : null}
    </>
  );
};
