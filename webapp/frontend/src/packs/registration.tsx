import {ApiClient} from "../ApiClient";
import {updateNavBarSession} from "../NavbarSession";
import {Registration} from "../Registration";
import React from "react";
import ReactDOM from "react-dom";


(async function() {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  updateNavBarSession(session);
  const elem = document.getElementById('registration');
  ReactDOM.render(
    <Registration session={session} client={client} />,
    elem,
  );
})();

