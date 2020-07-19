import { ApiClient } from "../ApiClient";
import { updateNavBarSession } from "../NavbarSession";
import { Signup } from "../Signup";
import React from "react";
import ReactDOM from "react-dom";

(async function () {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  updateNavBarSession(session);
  const elem = document.getElementById("signup");
  ReactDOM.render(<Signup session={session} client={client} />, elem);
})();
