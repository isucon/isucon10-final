// package: xsuportal.proto.services.admin
// file: xsuportal/services/admin/clarifications.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_clarification_pb from "../../../xsuportal/resources/clarification_pb";

export class ListClarificationsRequest extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): ListClarificationsRequest;


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
        teamId: number,
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

export class GetClarificationRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): GetClarificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetClarificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetClarificationRequest): GetClarificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetClarificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetClarificationRequest;
    static deserializeBinaryFromReader(message: GetClarificationRequest, reader: jspb.BinaryReader): GetClarificationRequest;
}

export namespace GetClarificationRequest {
    export type AsObject = {
        id: number,
    }
}

export class GetClarificationResponse extends jspb.Message { 

    hasClarification(): boolean;
    clearClarification(): void;
    getClarification(): xsuportal_resources_clarification_pb.Clarification | undefined;
    setClarification(value?: xsuportal_resources_clarification_pb.Clarification): GetClarificationResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetClarificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetClarificationResponse): GetClarificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetClarificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetClarificationResponse;
    static deserializeBinaryFromReader(message: GetClarificationResponse, reader: jspb.BinaryReader): GetClarificationResponse;
}

export namespace GetClarificationResponse {
    export type AsObject = {
        clarification?: xsuportal_resources_clarification_pb.Clarification.AsObject,
    }
}

export class RespondClarificationRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): RespondClarificationRequest;

    getDisclose(): boolean;
    setDisclose(value: boolean): RespondClarificationRequest;

    getAnswer(): string;
    setAnswer(value: string): RespondClarificationRequest;

    getQuestion(): string;
    setQuestion(value: string): RespondClarificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RespondClarificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RespondClarificationRequest): RespondClarificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RespondClarificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RespondClarificationRequest;
    static deserializeBinaryFromReader(message: RespondClarificationRequest, reader: jspb.BinaryReader): RespondClarificationRequest;
}

export namespace RespondClarificationRequest {
    export type AsObject = {
        id: number,
        disclose: boolean,
        answer: string,
        question: string,
    }
}

export class RespondClarificationResponse extends jspb.Message { 

    hasClarification(): boolean;
    clearClarification(): void;
    getClarification(): xsuportal_resources_clarification_pb.Clarification | undefined;
    setClarification(value?: xsuportal_resources_clarification_pb.Clarification): RespondClarificationResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RespondClarificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RespondClarificationResponse): RespondClarificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RespondClarificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RespondClarificationResponse;
    static deserializeBinaryFromReader(message: RespondClarificationResponse, reader: jspb.BinaryReader): RespondClarificationResponse;
}

export namespace RespondClarificationResponse {
    export type AsObject = {
        clarification?: xsuportal_resources_clarification_pb.Clarification.AsObject,
    }
}

export class CreateClarificationRequest extends jspb.Message { 
    getAnswer(): string;
    setAnswer(value: string): CreateClarificationRequest;

    getQuestion(): string;
    setQuestion(value: string): CreateClarificationRequest;

    getTeamId(): number;
    setTeamId(value: number): CreateClarificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateClarificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateClarificationRequest): CreateClarificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateClarificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateClarificationRequest;
    static deserializeBinaryFromReader(message: CreateClarificationRequest, reader: jspb.BinaryReader): CreateClarificationRequest;
}

export namespace CreateClarificationRequest {
    export type AsObject = {
        answer: string,
        question: string,
        teamId: number,
    }
}

export class CreateClarificationResponse extends jspb.Message { 

    hasClarification(): boolean;
    clearClarification(): void;
    getClarification(): xsuportal_resources_clarification_pb.Clarification | undefined;
    setClarification(value?: xsuportal_resources_clarification_pb.Clarification): CreateClarificationResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateClarificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateClarificationResponse): CreateClarificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateClarificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateClarificationResponse;
    static deserializeBinaryFromReader(message: CreateClarificationResponse, reader: jspb.BinaryReader): CreateClarificationResponse;
}

export namespace CreateClarificationResponse {
    export type AsObject = {
        clarification?: xsuportal_resources_clarification_pb.Clarification.AsObject,
    }
}
