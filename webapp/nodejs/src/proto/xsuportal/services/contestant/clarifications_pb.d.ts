// package: xsuportal.proto.services.contestant
// file: xsuportal/services/contestant/clarifications.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_clarification_pb from "../../../xsuportal/resources/clarification_pb";

export class ListClarificationsRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListClarificationsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListClarificationsRequest): ListClarificationsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListClarificationsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListClarificationsRequest;
    static deserializeBinaryFromReader(message: ListClarificationsRequest, reader: jspb.BinaryReader): ListClarificationsRequest;
}

export namespace ListClarificationsRequest {
    export type AsObject = {
    }
}

export class ListClarificationsResponse extends jspb.Message { 
    clearClarificationsList(): void;
    getClarificationsList(): Array<xsuportal_resources_clarification_pb.Clarification>;
    setClarificationsList(value: Array<xsuportal_resources_clarification_pb.Clarification>): ListClarificationsResponse;
    addClarifications(value?: xsuportal_resources_clarification_pb.Clarification, index?: number): xsuportal_resources_clarification_pb.Clarification;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListClarificationsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListClarificationsResponse): ListClarificationsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListClarificationsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListClarificationsResponse;
    static deserializeBinaryFromReader(message: ListClarificationsResponse, reader: jspb.BinaryReader): ListClarificationsResponse;
}

export namespace ListClarificationsResponse {
    export type AsObject = {
        clarificationsList: Array<xsuportal_resources_clarification_pb.Clarification.AsObject>,
    }
}

export class RequestClarificationRequest extends jspb.Message { 
    getQuestion(): string;
    setQuestion(value: string): RequestClarificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestClarificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RequestClarificationRequest): RequestClarificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RequestClarificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestClarificationRequest;
    static deserializeBinaryFromReader(message: RequestClarificationRequest, reader: jspb.BinaryReader): RequestClarificationRequest;
}

export namespace RequestClarificationRequest {
    export type AsObject = {
        question: string,
    }
}

export class RequestClarificationResponse extends jspb.Message { 

    hasClarification(): boolean;
    clearClarification(): void;
    getClarification(): xsuportal_resources_clarification_pb.Clarification | undefined;
    setClarification(value?: xsuportal_resources_clarification_pb.Clarification): RequestClarificationResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestClarificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RequestClarificationResponse): RequestClarificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RequestClarificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestClarificationResponse;
    static deserializeBinaryFromReader(message: RequestClarificationResponse, reader: jspb.BinaryReader): RequestClarificationResponse;
}

export namespace RequestClarificationResponse {
    export type AsObject = {
        clarification?: xsuportal_resources_clarification_pb.Clarification.AsObject,
    }
}
