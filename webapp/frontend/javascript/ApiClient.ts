import { xsuportal } from "./pb";
// import * as Rails from "@rails/ujs";

export class ApiError extends Error {
  public status: number;
  public localError: Error;
  public remoteError: xsuportal.proto.Error | null;

  constructor(
    status: number,
    localError: Error,
    remoteError: xsuportal.proto.Error | null,
    ...params: any[]
  ) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    this.name = `ApiError(local=${localError.name},remote=${
      remoteError && remoteError.name
    })`;
    this.message = `${localError.message}, ${
      remoteError && remoteError.humanMessage
    }`;
    this.status = status;
    this.localError = localError;
    this.remoteError = remoteError;
  }
}

export class ApiClient {
  public baseUrl: string;

  constructor(baseUrl?: string) {
    if (!baseUrl) {
      const metaBaseUrl = document.querySelector(
        'meta[name="xsu:api-base-url"]'
      ) as HTMLMetaElement;
      if (!metaBaseUrl) {
        throw new Error("undeterminable base url");
      }
      baseUrl = metaBaseUrl.content;
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  public async listTeams() {
    const klass = xsuportal.proto.services.audience.ListTeamsResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/audience/teams`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getAudienceDashboard() {
    const responseClass = xsuportal.proto.services.audience.DashboardResponse;
    const payloadClass = xsuportal.proto.services.audience.DashboardRequest;
    const resp = await this.request(
      `${this.baseUrl}/api/audience/dashboard`,
      "GET",
      null,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getCurrentSession() {
    const klass = xsuportal.proto.services.common.GetCurrentSessionResponse;
    // const pb = payload ? klass.encode(klass.fromObject(payload)).finish() : null;
    const resp = await this.request(
      `${this.baseUrl}/api/session`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getRegistrationSession(
    query?: xsuportal.proto.services.registration.IGetRegistrationSessionQuery
  ) {
    const responseClass =
      xsuportal.proto.services.registration.GetRegistrationSessionResponse;
    const queryClass =
      xsuportal.proto.services.registration.GetRegistrationSessionQuery;
    const queryMessage = query ? queryClass.fromObject(query) : null;
    const resp = await this.request(
      `${this.baseUrl}/api/registration/session`,
      "GET",
      queryMessage,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async createTeam(
    payload: xsuportal.proto.services.registration.ICreateTeamRequest
  ) {
    const responseClass =
      xsuportal.proto.services.registration.CreateTeamResponse;
    const payloadClass =
      xsuportal.proto.services.registration.CreateTeamRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/registration/team`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async joinTeam(
    payload: xsuportal.proto.services.registration.IJoinTeamRequest
  ) {
    const responseClass =
      xsuportal.proto.services.registration.JoinTeamResponse;
    const payloadClass = xsuportal.proto.services.registration.JoinTeamRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/registration/contestant`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async updateRegistration(
    payload: xsuportal.proto.services.registration.IUpdateRegistrationRequest
  ) {
    const responseClass =
      xsuportal.proto.services.registration.UpdateRegistrationResponse;
    const payloadClass =
      xsuportal.proto.services.registration.UpdateRegistrationRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/registration`,
      "PUT",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async deleteRegistration() {
    const responseClass =
      xsuportal.proto.services.registration.DeleteRegistrationResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/registration`,
      "DELETE",
      null,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async signup(
    payload: xsuportal.proto.services.contestant.ISignupRequest
  ) {
    const responseClass = xsuportal.proto.services.contestant.SignupResponse;
    const payloadClass = xsuportal.proto.services.contestant.SignupRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/signup`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async login(
    payload: xsuportal.proto.services.contestant.ILoginRequest
  ) {
    const responseClass = xsuportal.proto.services.contestant.LoginResponse;
    const payloadClass = xsuportal.proto.services.contestant.LoginRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/login`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async logout(
    payload: xsuportal.proto.services.contestant.ILogoutRequest
  ) {
    const responseClass = xsuportal.proto.services.contestant.LogoutResponse;
    const payloadClass = xsuportal.proto.services.contestant.LogoutRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/logout`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getContestantDashboard() {
    const responseClass = xsuportal.proto.services.contestant.DashboardResponse;
    const payloadClass = xsuportal.proto.services.contestant.DashboardRequest;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/dashboard`,
      "GET",
      null,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async enqueueBenchmarkJob(
    payload: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobRequest
  ) {
    const responseClass =
      xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse;
    const payloadClass =
      xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/benchmark_jobs`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async listBenchmarkJobs() {
    const responseClass =
      xsuportal.proto.services.contestant.ListBenchmarkJobsResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/benchmark_jobs`,
      "GET",
      null,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getBenchmarkJob(id: number) {
    const responseClass =
      xsuportal.proto.services.contestant.GetBenchmarkJobResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/benchmark_jobs/${id}`,
      "GET",
      null,
      null
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async listClarifications() {
    const klass =
      xsuportal.proto.services.contestant.ListClarificationsResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/clarifications`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async requestClarification(
    payload: xsuportal.proto.services.contestant.IRequestClarificationRequest
  ) {
    const responseClass =
      xsuportal.proto.services.contestant.RequestClarificationResponse;
    const payloadClass =
      xsuportal.proto.services.contestant.RequestClarificationRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/clarifications`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async listNotifications(after?: number) {
    const klass = xsuportal.proto.services.contestant.ListNotificationsResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/notifications?after=${
        after ? encodeURIComponent(after.toString()) : ""
      }`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async subscribeNotification(subscription: PushSubscription) {
    const responseClass =
      xsuportal.proto.services.contestant.SubscribeNotificationResponse;
    const payloadClass =
      xsuportal.proto.services.contestant.SubscribeNotificationRequest;
    const b64 = (buf: ArrayBuffer | null) =>
      buf ? btoa(String.fromCharCode(...new Uint8Array(buf))) : null;
    const payloadMessage = payloadClass
      .encode(
        payloadClass.fromObject({
          endpoint: subscription.endpoint,
          p256dh: b64(subscription.getKey("p256dh")),
          auth: b64(subscription.getKey("auth")),
        })
      )
      .finish();
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/push_subscriptions`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async unsubscribeNotification(subscription: PushSubscription) {
    const responseClass =
      xsuportal.proto.services.contestant.UnsubscribeNotificationResponse;
    const payloadClass =
      xsuportal.proto.services.contestant.UnsubscribeNotificationRequest;
    const payloadMessage = payloadClass
      .encode(
        payloadClass.fromObject({
          endpoint: subscription.endpoint,
        })
      )
      .finish();
    const resp = await this.request(
      `${this.baseUrl}/api/contestant/push_subscriptions`,
      "DELETE",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async request(
    path: string,
    method: string,
    query: object | null,
    payload: Uint8Array | null
  ) {
    let url = path[0] == "/" ? `${this.baseUrl}${path}` : path;
    const headers = new Headers();
    const opts: RequestInit = { method: method, headers: headers };
    if (query) {
      const queryParams = [];
      for (const [k, v] of Object.entries(query)) {
        const snakeK = k.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
        queryParams.push(`${snakeK}=${encodeURIComponent(v as string)}`);
      }
      url += `?${queryParams.join("&")}`;
    }
    headers.append("Accept", "application/vnd.google.protobuf, text/plain");
    // headers.append("X-Csrf-Token", Rails.csrfToken() || "");
    if (payload) {
      opts.body = payload;
      headers.append("Content-Type", "application/vnd.google.protobuf");
    }
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const contentType = resp.headers.get("Content-Type");

      let err;
      if (
        contentType &&
        contentType.match(
          /^application\/vnd\.google\.protobuf(; proto=xsuportal\.proto\.Error|; charset=.*)?$/
        )
      ) {
        const pbError = xsuportal.proto.Error.decode(
          new Uint8Array(await resp.arrayBuffer())
        );
        err = new ApiError(
          resp.status,
          new Error(`${path} returned error ${resp.status}`),
          pbError
        );
      } else {
        err = new ApiError(
          resp.status,
          new Error(
            `${path} returned error ${resp.status}: ${await resp.text()}`
          ),
          null
        );
      }
      console.error(err.localError, err.remoteError);
      throw err;
    }
    return resp;
  }
}
