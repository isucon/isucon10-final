// package: xsuportal.proto.services.registration
// file: xsuportal/services/registration/create_team.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CreateTeamRequest extends jspb.Message { 
    getTeamName(): string;
    setTeamName(value: string): CreateTeamRequest;

    getName(): string;
    setName(value: string): CreateTeamRequest;

    getEmailAddress(): string;
    setEmailAddress(value: string): CreateTeamRequest;

    getIsStudent(): boolean;
    setIsStudent(value: boolean): CreateTeamRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTeamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTeamRequest): CreateTeamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTeamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTeamRequest;
    static deserializeBinaryFromReader(message: CreateTeamRequest, reader: jspb.BinaryReader): CreateTeamRequest;
}

export namespace CreateTeamRequest {
    export type AsObject = {
        teamName: string,
        name: string,
        emailAddress: string,
        isStudent: boolean,
    }
}

export class CreateTeamResponse extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): CreateTeamResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTeamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTeamResponse): CreateTeamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTeamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTeamResponse;
    static deserializeBinaryFromReader(message: CreateTeamResponse, reader: jspb.BinaryReader): CreateTeamResponse;
}

export namespace CreateTeamResponse {
    export type AsObject = {
        teamId: number,
    }
}
