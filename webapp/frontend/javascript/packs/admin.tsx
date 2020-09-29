import "./application.scss";
import { ApiClient } from "../ApiClient";
import { AdminApp } from "../AdminApp";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  const elem = document.getElementById("app");
  if (session.contestant?.isStaff) {
    ReactDOM.render(<AdminApp session={session} client={client} />, elem);
  } else {
    location.href = "/";
  }
})();
