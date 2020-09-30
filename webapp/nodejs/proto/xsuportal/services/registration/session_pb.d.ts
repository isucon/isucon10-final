// package: xsuportal.proto.services.registration
// file: xsuportal/services/registration/session.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_team_pb from "../../../xsuportal/resources/team_pb";

export class GetRegistrationSessionQuery extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): GetRegistrationSessionQuery;

    getInviteToken(): string;
    setInviteToken(value: string): GetRegistrationSessionQuery;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRegistrationSessionQuery.AsObject;
    static toObject(includeInstance: boolean, msg: GetRegistrationSessionQuery): GetRegistrationSessionQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRegistrationSessionQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRegistrationSessionQuery;
    static deserializeBinaryFromReader(message: GetRegistrationSessionQuery, reader: jspb.BinaryReader): GetRegistrationSessionQuery;
}

export namespace GetRegistrationSessionQuery {
    export type AsObject = {
        teamId: number,
        inviteToken: string,
    }
}

export class GetRegistrationSessionResponse extends jspb.Message { 

    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): GetRegistrationSessionResponse;

    getStatus(): GetRegistrationSessionResponse.Status;
    setStatus(value: GetRegistrationSessionResponse.Status): GetRegistrationSessionResponse;

    getMemberInviteUrl(): string;
    setMemberInviteUrl(value: string): GetRegistrationSessionResponse;

    getInviteToken(): string;
    setInviteToken(value: string): GetRegistrationSessionResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRegistrationSessionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetRegistrationSessionResponse): GetRegistrationSessionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRegistrationSessionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRegistrationSessionResponse;
    static deserializeBinaryFromReader(message: GetRegistrationSessionResponse, reader: jspb.BinaryReader): GetRegistrationSessionResponse;
}

export namespace GetRegistrationSessionResponse {
    export type AsObject = {
        team?: xsuportal_resources_team_pb.Team.AsObject,
        status: GetRegistrationSessionResponse.Status,
        memberInviteUrl: string,
        inviteToken: string,
    }

    export enum Status {
    CLOSED = 0,
    NOT_JOINABLE = 1,
    NOT_LOGGED_IN = 2,
    CREATABLE = 3,
    JOINABLE = 4,
    JOINED = 5,
    }

}

export class UpdateRegistrationRequest extends jspb.Message { 
    getTeamName(): string;
    setTeamName(value: string): UpdateRegistrationRequest;

    getName(): string;
    setName(value: string): UpdateRegistrationRequest;

    getEmailAddress(): string;
    setEmailAddress(value: string): UpdateRegistrationRequest;

    getIsStudent(): boolean;
    setIsStudent(value: boolean): UpdateRegistrationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateRegistrationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateRegistrationRequest): UpdateRegistrationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateRegistrationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateRegistrationRequest;
    static deserializeBinaryFromReader(message: UpdateRegistrationRequest, reader: jspb.BinaryReader): UpdateRegistrationRequest;
}

export namespace UpdateRegistrationRequest {
    export type AsObject = {
        teamName: string,
        name: string,
        emailAddress: string,
        isStudent: boolean,
    }
}

export class UpdateRegistrationResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateRegistrationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateRegistrationResponse): UpdateRegistrationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateRegistrationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateRegistrationResponse;
    static deserializeBinaryFromReader(message: UpdateRegistrationResponse, reader: jspb.BinaryReader): UpdateRegistrationResponse;
}

export namespace UpdateRegistrationResponse {
    export type AsObject = {
    }
}

export class DeleteRegistrationRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteRegistrationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteRegistrationRequest): DeleteRegistrationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteRegistrationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteRegistrationRequest;
    static deserializeBinaryFromReader(message: DeleteRegistrationRequest, reader: jspb.BinaryReader): DeleteRegistrationRequest;
}

export namespace DeleteRegistrationRequest {
    export type AsObject = {
    }
}

export class DeleteRegistrationResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteRegistrationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteRegistrationResponse): DeleteRegistrationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteRegistrationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteRegistrationResponse;
    static deserializeBinaryFromReader(message: DeleteRegistrationResponse, reader: jspb.BinaryReader): DeleteRegistrationResponse;
}

export namespace DeleteRegistrationResponse {
    export type AsObject = {
    }
}
