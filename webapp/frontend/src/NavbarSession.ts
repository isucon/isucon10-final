import {isuxportal} from "./pb";
import {ApiClient} from "./ApiClient";

export function updateNavBarSession(session: isuxportal.proto.services.common.GetCurrentSessionResponse) {
  if (session.contestant) {
    document.body.classList.add('isux-session-user');
  } else {
    document.body.classList.add('isux-session-guest');
  }
  console.log(session);
}

export async function fetchAndUpdateNavbarSession() {
  const client = new ApiClient();
  updateNavBarSession(await client.getCurrentSession());
}
