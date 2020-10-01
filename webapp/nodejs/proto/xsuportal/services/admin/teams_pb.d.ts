// package: xsuportal.proto.services.admin
// file: xsuportal/services/admin/teams.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_team_pb from "../../../xsuportal/resources/team_pb";
import * as xsuportal_resources_contestant_pb from "../../../xsuportal/resources/contestant_pb";

export class ListTeamsRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTeamsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListTeamsRequest): ListTeamsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTeamsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTeamsRequest;
    static deserializeBinaryFromReader(message: ListTeamsRequest, reader: jspb.BinaryReader): ListTeamsRequest;
}

export namespace ListTeamsRequest {
    export type AsObject = {
    }
}

export class ListTeamsResponse extends jspb.Message { 
    clearTeamsList(): void;
    getTeamsList(): Array<ListTeamsResponse.TeamListItem>;
    setTeamsList(value: Array<ListTeamsResponse.TeamListItem>): ListTeamsResponse;
    addTeams(value?: ListTeamsResponse.TeamListItem, index?: number): ListTeamsResponse.TeamListItem;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTeamsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTeamsResponse): ListTeamsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTeamsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTeamsResponse;
    static deserializeBinaryFromReader(message: ListTeamsResponse, reader: jspb.BinaryReader): ListTeamsResponse;
}

export namespace ListTeamsResponse {
    export type AsObject = {
        teamsList: Array<ListTeamsResponse.TeamListItem.AsObject>,
    }


    export class TeamListItem extends jspb.Message { 
        getTeamId(): number;
        setTeamId(value: number): TeamListItem;

        getName(): string;
        setName(value: string): TeamListItem;

        clearMemberNamesList(): void;
        getMemberNamesList(): Array<string>;
        setMemberNamesList(value: Array<string>): TeamListItem;
        addMemberNames(value: string, index?: number): string;

        getIsStudent(): boolean;
        setIsStudent(value: boolean): TeamListItem;

        getWithdrawn(): boolean;
        setWithdrawn(value: boolean): TeamListItem;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): TeamListItem.AsObject;
        static toObject(includeInstance: boolean, msg: TeamListItem): TeamListItem.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: TeamListItem, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): TeamListItem;
        static deserializeBinaryFromReader(message: TeamListItem, reader: jspb.BinaryReader): TeamListItem;
    }

    export namespace TeamListItem {
        export type AsObject = {
            teamId: number,
            name: string,
            memberNamesList: Array<string>,
            isStudent: boolean,
            withdrawn: boolean,
        }
    }

}

export class GetTeamRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): GetTeamRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetTeamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetTeamRequest): GetTeamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetTeamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetTeamRequest;
    static deserializeBinaryFromReader(message: GetTeamRequest, reader: jspb.BinaryReader): GetTeamRequest;
}

export namespace GetTeamRequest {
    export type AsObject = {
        id: number,
    }
}

export class GetTeamResponse extends jspb.Message { 

    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): GetTeamResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetTeamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetTeamResponse): GetTeamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetTeamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetTeamResponse;
    static deserializeBinaryFromReader(message: GetTeamResponse, reader: jspb.BinaryReader): GetTeamResponse;
}

export namespace GetTeamResponse {
    export type AsObject = {
        team?: xsuportal_resources_team_pb.Team.AsObject,
    }
}

export class UpdateTeamRequest extends jspb.Message { 

    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): UpdateTeamRequest;

    clearContestantsList(): void;
    getContestantsList(): Array<xsuportal_resources_contestant_pb.Contestant>;
    setContestantsList(value: Array<xsuportal_resources_contestant_pb.Contestant>): UpdateTeamRequest;
    addContestants(value?: xsuportal_resources_contestant_pb.Contestant, index?: number): xsuportal_resources_contestant_pb.Contestant;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateTeamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateTeamRequest): UpdateTeamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateTeamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateTeamRequest;
    static deserializeBinaryFromReader(message: UpdateTeamRequest, reader: jspb.BinaryReader): UpdateTeamRequest;
}

export namespace UpdateTeamRequest {
    export type AsObject = {
        team?: xsuportal_resources_team_pb.Team.AsObject,
        contestantsList: Array<xsuportal_resources_contestant_pb.Contestant.AsObject>,
    }
}

export class UpdateTeamResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateTeamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateTeamResponse): UpdateTeamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateTeamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateTeamResponse;
    static deserializeBinaryFromReader(message: UpdateTeamResponse, reader: jspb.BinaryReader): UpdateTeamResponse;
}

export namespace UpdateTeamResponse {
    export type AsObject = {
    }
}
