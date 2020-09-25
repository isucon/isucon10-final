// package: xsuportal.proto.resources
// file: xsuportal/resources/clarification.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_team_pb from "../../xsuportal/resources/team_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Clarification extends jspb.Message { 
    getId(): number;
    setId(value: number): Clarification;

    getTeamId(): number;
    setTeamId(value: number): Clarification;

    getAnswered(): boolean;
    setAnswered(value: boolean): Clarification;

    getDisclosed(): boolean;
    setDisclosed(value: boolean): Clarification;

    getQuestion(): string;
    setQuestion(value: string): Clarification;

    getAnswer(): string;
    setAnswer(value: string): Clarification;


    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Clarification;


    hasAnsweredAt(): boolean;
    clearAnsweredAt(): void;
    getAnsweredAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setAnsweredAt(value?: google_protobuf_timestamp_pb.Timestamp): Clarification;


    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): Clarification;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Clarification.AsObject;
    static toObject(includeInstance: boolean, msg: Clarification): Clarification.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Clarification, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Clarification;
    static deserializeBinaryFromReader(message: Clarification, reader: jspb.BinaryReader): Clarification;
}

export namespace Clarification {
    export type AsObject = {
        id: number,
        teamId: number,
        answered: boolean,
        disclosed: boolean,
        question: string,
        answer: string,
        createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        answeredAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        team?: xsuportal_resources_team_pb.Team.AsObject,
    }
}
