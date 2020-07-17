import {ApiClient} from "../ApiClient";
import {updateNavBarSession} from "../NavbarSession";
import {TeamList} from "../TeamList";
import React from "react";
import ReactDOM from "react-dom";

(async function() {
  const client = new ApiClient();
  const session = await client.getCurrentSession();
  updateNavBarSession(session);
  const elem = document.getElementById('team_list');
  ReactDOM.render(
    <TeamList session={session} client={client} />,
    elem,
  );
})();
