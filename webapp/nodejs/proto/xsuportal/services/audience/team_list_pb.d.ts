// package: xsuportal.proto.services.audience
// file: xsuportal/services/audience/team_list.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

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
        }
    }

}
