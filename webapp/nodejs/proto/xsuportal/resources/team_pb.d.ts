// package: xsuportal.proto.resources
// file: xsuportal/resources/team.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_contestant_pb from "../../xsuportal/resources/contestant_pb";

export class Team extends jspb.Message { 
    getId(): number;
    setId(value: number): Team;

    getName(): string;
    setName(value: string): Team;

    getLeaderId(): string;
    setLeaderId(value: string): Team;

    clearMemberIdsList(): void;
    getMemberIdsList(): Array<string>;
    setMemberIdsList(value: Array<string>): Team;
    addMemberIds(value: string, index?: number): string;

    getWithdrawn(): boolean;
    setWithdrawn(value: boolean): Team;


    hasStudent(): boolean;
    clearStudent(): void;
    getStudent(): Team.StudentStatus | undefined;
    setStudent(value?: Team.StudentStatus): Team;


    hasDetail(): boolean;
    clearDetail(): void;
    getDetail(): Team.TeamDetail | undefined;
    setDetail(value?: Team.TeamDetail): Team;


    hasLeader(): boolean;
    clearLeader(): void;
    getLeader(): xsuportal_resources_contestant_pb.Contestant | undefined;
    setLeader(value?: xsuportal_resources_contestant_pb.Contestant): Team;

    clearMembersList(): void;
    getMembersList(): Array<xsuportal_resources_contestant_pb.Contestant>;
    setMembersList(value: Array<xsuportal_resources_contestant_pb.Contestant>): Team;
    addMembers(value?: xsuportal_resources_contestant_pb.Contestant, index?: number): xsuportal_resources_contestant_pb.Contestant;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Team.AsObject;
    static toObject(includeInstance: boolean, msg: Team): Team.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Team, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Team;
    static deserializeBinaryFromReader(message: Team, reader: jspb.BinaryReader): Team;
}

export namespace Team {
    export type AsObject = {
        id: number,
        name: string,
        leaderId: string,
        memberIdsList: Array<string>,
        withdrawn: boolean,
        student?: Team.StudentStatus.AsObject,
        detail?: Team.TeamDetail.AsObject,
        leader?: xsuportal_resources_contestant_pb.Contestant.AsObject,
        membersList: Array<xsuportal_resources_contestant_pb.Contestant.AsObject>,
    }


    export class StudentStatus extends jspb.Message { 
        getStatus(): boolean;
        setStatus(value: boolean): StudentStatus;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): StudentStatus.AsObject;
        static toObject(includeInstance: boolean, msg: StudentStatus): StudentStatus.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: StudentStatus, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): StudentStatus;
        static deserializeBinaryFromReader(message: StudentStatus, reader: jspb.BinaryReader): StudentStatus;
    }

    export namespace StudentStatus {
        export type AsObject = {
            status: boolean,
        }
    }

    export class TeamDetail extends jspb.Message { 
        getEmailAddress(): string;
        setEmailAddress(value: string): TeamDetail;

        getInviteToken(): string;
        setInviteToken(value: string): TeamDetail;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): TeamDetail.AsObject;
        static toObject(includeInstance: boolean, msg: TeamDetail): TeamDetail.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: TeamDetail, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): TeamDetail;
        static deserializeBinaryFromReader(message: TeamDetail, reader: jspb.BinaryReader): TeamDetail;
    }

    export namespace TeamDetail {
        export type AsObject = {
            emailAddress: string,
            inviteToken: string,
        }
    }

}
