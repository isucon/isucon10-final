// package: xsuportal.proto.services.audience
// file: xsuportal/services/audience/dashboard.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_leaderboard_pb from "../../../xsuportal/resources/leaderboard_pb";

export class DashboardRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DashboardRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DashboardRequest): DashboardRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DashboardRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DashboardRequest;
    static deserializeBinaryFromReader(message: DashboardRequest, reader: jspb.BinaryReader): DashboardRequest;
}

export namespace DashboardRequest {
    export type AsObject = {
    }
}

export class DashboardResponse extends jspb.Message { 

    hasLeaderboard(): boolean;
    clearLeaderboard(): void;
    getLeaderboard(): xsuportal_resources_leaderboard_pb.Leaderboard | undefined;
    setLeaderboard(value?: xsuportal_resources_leaderboard_pb.Leaderboard): DashboardResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DashboardResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DashboardResponse): DashboardResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DashboardResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DashboardResponse;
    static deserializeBinaryFromReader(message: DashboardResponse, reader: jspb.BinaryReader): DashboardResponse;
}

export namespace DashboardResponse {
    export type AsObject = {
        leaderboard?: xsuportal_resources_leaderboard_pb.Leaderboard.AsObject,
    }
}
