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
  onSubmit: (clar: xsuportal.proto.resources.IClarification) => any;
}

const ClarForm: React.FC<FormProps> = (props: FormProps) => {
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { reset, register, handleSubmit, watch, setValue, errors } = useForm<{
    answer: string;
    question: string;
    teamId: string;
  }>({
    shouldUnregister: false,
    defaultValues: {
      answer: "",
      question: "",
      teamId: "",
    },
  });

  const onSubmit = handleSubmit(async (data, e) => {
    try {
      setRequesting(true);
      console.log(data);
      const resp = await props.client.createClarification({
        answer: data.answer,
        question: data.question,
        teamId: data.teamId !== "" ? parseInt(data.teamId, 10) : 0,
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
        <h4 className="is-4 card-header-title">Create a clarification</h4>
      </div>
      <div className="card-content">
        <form onSubmit={onSubmit}>
          <div className="columns">
            <div className="column field is-6">
              <label
                className="label"
                htmlFor="AdminClarificationListForm-question"
              >
                Question
              </label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="question"
                  id="AdminClarificationListForm-question"
                  ref={register}
                  placeholder=""
                  autoFocus
                />
              </div>
            </div>
            <div className="column field is-6">
              <div className="control">
                <label
                  className="label"
                  htmlFor="AdminClarificationListForm-answer"
                >
                  Answer
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="answer"
                    id="AdminClarificationListForm-answer"
                    ref={register}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label
              className="label"
              htmlFor="AdminClarificationListForm-teamId"
            >
              Team ID
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="AdminClarificationListForm-teamId"
                name="teamId"
                ref={register}
                placeholder="optional; disclosed to the all teams if not set"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                type="submit"
                disabled={requesting}
              >
                Send
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
}

export const AdminClarificationList: React.FC<Props> = (props: Props) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [list, setList] = React.useState<
    xsuportal.proto.resources.IClarification[] | null
  >(null);

  React.useEffect(() => {
    props.client
      .listClarifications()
      .then((resp) => setList(resp.clarifications))
      .catch((e) => setError(e));
  }, []);
  const onClarSubmit = (clar: xsuportal.proto.resources.IClarification) => {
    setList(list ? [clar, ...list] : [clar]);
  };

  const renderList = () => {
    if (!list) return null;
    return list.map((clar) => {
      return (
        <Clarification
          clarification={clar}
          admin={true}
          key={clar.id!.toString()}
        />
      );
    });
  };

  return (
    <>
      {/* <ClarForm
        session={props.session}
        client={props.client}
        onSubmit={onClarSubmit}
      /> */}
      {error ? <ErrorMessage error={error} /> : null}
      {list ? renderList() : <p>Loading..</p>}
    </>
  );
};
