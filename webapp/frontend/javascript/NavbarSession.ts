import { xsuportal } from "./pb";
import { ApiClient } from "./ApiClient";

export function updateNavBarSession(
  session: xsuportal.proto.services.common.GetCurrentSessionResponse
) {
  if (session.contestant) {
    document.body.classList.add("xsu-session-user");
  } else {
    document.body.classList.add("xsu-session-guest");
  }
  console.log(session);
}

export async function fetchAndUpdateNavbarSession() {
  const client = new ApiClient();
  updateNavBarSession(await client.getCurrentSession());
}
