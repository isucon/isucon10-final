import "./application.scss";
import { ApiClient } from "../ApiClient";
import { updateNavBarSession } from "../NavbarSession";
import { ContestantApp } from "../ContestantApp";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  const release = document.querySelector<HTMLMetaElement>(
    'meta[name="xsu:release"]'
  )?.content;
  updateNavBarSession(session);
  const elem = document.getElementById("app");
  if (session.team) {
    ReactDOM.render(
      <ContestantApp session={session} client={client} release={release} />,
      elem
    );
  } else {
    location.href = "/";
  }
})();
