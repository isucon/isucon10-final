import "./application.scss";
import { ApiClient } from "../common/ApiClient";
import { Index } from "../Index";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  const elem = document.getElementById("index");
  ReactDOM.render(<Index session={session} client={client} />, elem);
})();
