import { xsuportal } from "../pb";
import { ApiClient } from "../ApiClient";

export class AdminApiClient {
  public apiClient: ApiClient;
  public baseUrl: string;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.baseUrl = this.apiClient.baseUrl;
  }

  public async listClarifications(teamId?: number) {
    const klass = xsuportal.proto.services.admin.ListClarificationsResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/admin/clarifications?team_id=${encodeURIComponent(
        teamId || ""
      )}`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async getClarification(id: number) {
    const klass = xsuportal.proto.services.admin.GetClarificationResponse;
    const resp = await this.request(
      `${this.baseUrl}/api/admin/clarifications/${encodeURIComponent(
        id.toString()
      )}`,
      "GET",
      null,
      null
    );
    return klass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async respondClarification(
    payload: xsuportal.proto.services.admin.IRespondClarificationRequest
  ) {
    const responseClass =
      xsuportal.proto.services.admin.RespondClarificationResponse;
    const payloadClass =
      xsuportal.proto.services.admin.RespondClarificationRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/admin/clarifications/${encodeURIComponent(
        payload.id!.toString()
      )}`,
      "PUT",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public async createClarification(
    payload: xsuportal.proto.services.admin.ICreateClarificationRequest
  ) {
    const responseClass =
      xsuportal.proto.services.admin.CreateClarificationResponse;
    const payloadClass =
      xsuportal.proto.services.admin.CreateClarificationRequest;
    const payloadMessage = payload
      ? payloadClass.encode(payloadClass.fromObject(payload)).finish()
      : null;
    const resp = await this.request(
      `${this.baseUrl}/api/admin/clarifications`,
      "POST",
      null,
      payloadMessage
    );
    return responseClass.decode(new Uint8Array(await resp.arrayBuffer()));
  }

  public request(
    path: string,
    method: string,
    query: object | null,
    payload: Uint8Array | null
  ) {
    return this.apiClient.request(path, method, query, payload);
  }
}
