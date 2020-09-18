import type { xsuportal } from "../pb";
import { ApiError, ApiClient } from "../ApiClient";

import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Clarification } from "../Clarification";
import { ErrorMessage } from "../ErrorMessage";

interface FormProps {
  session: xsuportal.proto.services.common.GetCurrentSessionResponse;
  client: ApiClient;
  onSubmit: (clar: xsuportal.proto.resources.IClarification) => any;
}

const ClarForm: React.FC<FormProps> = (props: FormProps) => {
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { reset, register, handleSubmit, watch, setValue, errors } = useForm<{
    question: string;
  }>({
    shouldUnregister: false,
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = handleSubmit(async (data, e) => {
    try {
      setRequesting(true);
      const resp = await props.client.requestClarification({
        question: data.question,
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
        <h4 className="is-4 card-header-title">
          質問もしくはサポート依頼を送信する
        </h4>
      </div>
      <div className="card-content">
        <form onSubmit={onSubmit}>
          <div className="field">
            <label
              className="label"
              htmlFor="ContestantClarificationList-question"
            >
              質問内容
            </label>
            <div className="control">
              <textarea
                className="textarea"
                name="question"
                id="ContestantClarificationList-question"
                ref={register}
                placeholder=""
                autoFocus
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
                送信
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
  client: ApiClient;
  onLastClarificationIdSeenChange: (id?: number) => any;
}

export const ContestantClarificationList: React.FC<Props> = (props: Props) => {
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

  React.useEffect(() => {
    if (!list) return;
    const clar = list.find((clar) => clar.answered);
    props.onLastClarificationIdSeenChange((clar?.id! as number) ?? undefined);
  }, [list]);

  const renderList = () => {
    if (!list) return null;
    return list.map((clar) => {
      return (
        <Clarification
          clarification={clar}
          admin={false}
          key={clar.id!.toString()}
        />
      );
    });
  };

  return (
    <>
      <ClarForm
        session={props.session}
        client={props.client}
        onSubmit={onClarSubmit}
      />
      {error ? <ErrorMessage error={error} /> : null}
      {list ? renderList() : <p>Loading..</p>}
    </>
  );
};
