import {isuxportal} from "./pb";
import * as Rails from "@rails/ujs";

export class ApiError extends Error {
  public localError: Error;
  public remoteError: isuxportal.proto.Error | null;

  constructor(localError: Error, remoteError: isuxportal.proto.Error | null, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    this.name = `ApiError(local=${localError.name},remote=${remoteError && remoteError.name})`;
    this.message = `${localError.message}, ${remoteError && remoteError.humanMessage}`;
    this.localError = localError;
    this.remoteError = remoteError;
  }

}


export class ApiClient {
  public baseUrl: string;


  constructor(baseUrl?: string) {
    if (!baseUrl) {
      const metaBaseUrl= document.querySelector('meta[name="isux:api-base-url"]') as HTMLMetaElement;
      if (!metaBaseUrl) {
        throw new Error("undeterminable base url");
      }
      baseUrl = metaBaseUrl.content;
    }
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public async listTeams() {
    const klass = isuxportal.proto.services.audience.ListTeamsResponse;
    const resp = await this.request(`${this.baseUrl}/api/audience/teams`, "GET", null, null);
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getCurrentSession() {
    const klass = isuxportal.proto.services.common.GetCurrentSessionResponse;
    // const pb = payload ? klass.encode(klass.fromObject(payload)).finish() : null;
    const resp = await this.request(`${this.baseUrl}/api/session`, "GET", null, null);
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getRegistrationSession(query?: isuxportal.proto.services.registration.IGetRegistrationSessionQuery) {
    const responseClass = isuxportal.proto.services.registration.GetRegistrationSessionResponse;
    const queryClass = isuxportal.proto.services.registration.GetRegistrationSessionQuery;
    const queryMessage = query ? queryClass.fromObject(query) : null;
    const resp = await this.request(`${this.baseUrl}/api/registration/session`, "GET", queryMessage, null);
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async createTeam(payload: isuxportal.proto.services.registration.ICreateTeamRequest) {
    const responseClass = isuxportal.proto.services.registration.CreateTeamResponse;
    const payloadClass = isuxportal.proto.services.registration.CreateTeamRequest;
    const payloadMessage = payload ? payloadClass.encode(payloadClass.fromObject(payload)).finish() : null;
    const resp = await this.request(`${this.baseUrl}/api/registration/team`, "POST", null, payloadMessage);
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async joinTeam(payload: isuxportal.proto.services.registration.IJoinTeamRequest) {
    const responseClass = isuxportal.proto.services.registration.JoinTeamResponse;
    const payloadClass = isuxportal.proto.services.registration.JoinTeamRequest;
    const payloadMessage = payload ? payloadClass.encode(payloadClass.fromObject(payload)).finish() : null;
    const resp = await this.request(`${this.baseUrl}/api/registration/contestant`, "POST", null, payloadMessage);
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async updateRegistration(payload: isuxportal.proto.services.registration.IUpdateRegistrationRequest) {
    const responseClass = isuxportal.proto.services.registration.UpdateRegistrationResponse;
    const payloadClass = isuxportal.proto.services.registration.UpdateRegistrationRequest;
    const payloadMessage = payload ? payloadClass.encode(payloadClass.fromObject(payload)).finish() : null;
    const resp = await this.request(`${this.baseUrl}/api/registration`, "PUT", null, payloadMessage);
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async deleteRegistration() {
    const responseClass = isuxportal.proto.services.registration.DeleteRegistrationResponse;
    const resp = await this.request(`${this.baseUrl}/api/registration`, "DELETE", null, null);
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async request(path: string, method: string, query: object | null, payload: Uint8Array | null) {
    let url = path[0] == '/' ? `${this.baseUrl}${path}` : path;
    const headers = new Headers();
    const opts: RequestInit = { method: method, headers: headers };
    if (query) {
      const queryParams = [];
      for (const [k,v] of Object.entries(query)) {
        const snakeK = k.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
        queryParams.push(`${snakeK}=${encodeURIComponent(v as string)}`);
      }
      url += `?${queryParams.join("&")}`;
    }
    headers.append("Accept", "application/vnd.google.protobuf, text/plain");
    headers.append("X-Csrf-Token", Rails.csrfToken() || "");
    if (payload) {
      opts.body = payload;
      headers.append("Content-Type", "application/vnd.google.protobuf");
    }
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const contentType = resp.headers.get('Content-Type');
      
      let err;
      if (contentType && contentType.match(/^application\/vnd\.google\.protobuf(; proto=isuxportal\.proto\.Error|; charset=.*)?$/)) {
        const pbError = isuxportal.proto.Error.decode(new Uint8Array(await resp.arrayBuffer()));
        err = new ApiError(new Error(`${path} returned error ${resp.status}`), pbError);
      } else {
        err = new ApiError(new Error(`${path} returned error ${resp.status}: ${await resp.text()}`), null);
      }
      console.error(err.localError, err.remoteError);
      throw err;
    }
    return resp;
  }
}
