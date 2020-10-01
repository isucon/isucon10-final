// package: xsuportal.proto.services.contestant
// file: xsuportal/services/contestant/signup.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class SignupRequest extends jspb.Message { 
    getContestantId(): string;
    setContestantId(value: string): SignupRequest;

    getPassword(): string;
    setPassword(value: string): SignupRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignupRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SignupRequest): SignupRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignupRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignupRequest;
    static deserializeBinaryFromReader(message: SignupRequest, reader: jspb.BinaryReader): SignupRequest;
}

export namespace SignupRequest {
    export type AsObject = {
        contestantId: string,
        password: string,
    }
}

export class SignupResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignupResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SignupResponse): SignupResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignupResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignupResponse;
    static deserializeBinaryFromReader(message: SignupResponse, reader: jspb.BinaryReader): SignupResponse;
}

export namespace SignupResponse {
    export type AsObject = {
    }
}
