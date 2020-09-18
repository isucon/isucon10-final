import type { xsuportal } from "./pb";
import { ApiError, ApiClient } from "./ApiClient";

import React from "react";
import { Link } from "react-router-dom";

import { Timestamp } from "./Timestamp";
import { TimeDuration } from "./TimeDuration";

export interface Props {
  clarification: xsuportal.proto.resources.IClarification;
  admin: boolean;
}

export const Clarification: React.FC<Props> = (props: Props) => {
  const clar = props.clarification;

  const onQuestionTabClick = (flag: boolean) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
    };
  };

  return (
    <article className="message mt-5">
      <div className="message-header">
        <h4 className="is-4 message-header-title">
          Clarification #{clar.id!.toString()}
        </h4>
      </div>
      <div className="message-body">
        <div className="level">
          <div className="level-left">
            <p>
              {clar.team ? (
                clar.answered ? (
                  <span className="tag is-primary mr-1">回答済</span>
                ) : (
                  <span className="tag is-danger mr-1">未回答</span>
                )
              ) : null}
              {!clar.answered ? null : clar.disclosed ? (
                <span className="tag is-primary mr-1">全体公開</span>
              ) : (
                <span className="tag is-warning mr-1">個別回答</span>
              )}
            </p>
            <p>
              <span className="mr-2">
                送信: <Timestamp timestamp={clar.createdAt!} />
              </span>
              {clar.answeredAt ? (
                <span>
                  回答: <Timestamp timestamp={clar.answeredAt} />
                </span>
              ) : null}
            </p>
          </div>
          <div className="level-right">
            <div className="level-item">
              {clar.team ? (
                <>
                  チーム:
                  {props.admin ? (
                    <Link
                      to={`/admin/teams/${encodeURIComponent(
                        clar.team!.id!.toString()
                      )}`}
                    >
                      {clar.team.name} (#{clar.team.id!.toString()})
                    </Link>
                  ) : (
                    <>
                      {clar.team.name} (#{clar.team.id!.toString()})
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-6">
            <h5 className="is-5">質問/要求</h5>
            <section>
              <pre className="xsu-clarification-pre">{clar.question}</pre>
            </section>
          </div>
          <div className="column is-6">
            <h5 className="is-5">回答</h5>
            <section>
              {clar.answered ? (
                <pre className="xsu-clarification-pre">{clar.answer}</pre>
              ) : (
                <p>N/A</p>
              )}
            </section>
          </div>
        </div>
        <p>
          {props.admin ? (
            <Link
              to={`/admin/clarifications/${encodeURIComponent(
                clar.id!.toString()
              )}`}
              className="button is-small is-info mr-2"
            >
              回答/編集
            </Link>
          ) : null}
        </p>
      </div>
    </article>
  );
};
