import { ApiClient } from "../ApiClient";
import { updateNavBarSession } from "../NavbarSession";
import { Index } from "../Index";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  updateNavBarSession(session);
  const elem = document.getElementById("index");
  ReactDOM.render(<Index session={session} client={client} />, elem);
})();
