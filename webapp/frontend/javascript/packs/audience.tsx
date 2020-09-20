import './application.scss';
import { ApiClient } from "../ApiClient";
import { updateNavBarSession } from "../NavbarSession";
import { AudienceApp } from "../AudienceApp";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  updateNavBarSession(session);
  const elem = document.getElementById("app");
  ReactDOM.render(<AudienceApp session={session} client={client} />, elem);
})();
