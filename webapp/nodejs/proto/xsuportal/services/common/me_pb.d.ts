// package: xsuportal.proto.services.common
// file: xsuportal/services/common/me.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_team_pb from "../../../xsuportal/resources/team_pb";
import * as xsuportal_resources_contestant_pb from "../../../xsuportal/resources/contestant_pb";
import * as xsuportal_resources_contest_pb from "../../../xsuportal/resources/contest_pb";

export class GetCurrentSessionResponse extends jspb.Message { 

    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): GetCurrentSessionResponse;


    hasContestant(): boolean;
    clearContestant(): void;
    getContestant(): xsuportal_resources_contestant_pb.Contestant | undefined;
    setContestant(value?: xsuportal_resources_contestant_pb.Contestant): GetCurrentSessionResponse;


    hasContest(): boolean;
    clearContest(): void;
    getContest(): xsuportal_resources_contest_pb.Contest | undefined;
    setContest(value?: xsuportal_resources_contest_pb.Contest): GetCurrentSessionResponse;

    getPushVapidKey(): string;
    setPushVapidKey(value: string): GetCurrentSessionResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetCurrentSessionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetCurrentSessionResponse): GetCurrentSessionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetCurrentSessionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetCurrentSessionResponse;
    static deserializeBinaryFromReader(message: GetCurrentSessionResponse, reader: jspb.BinaryReader): GetCurrentSessionResponse;
}

export namespace GetCurrentSessionResponse {
    export type AsObject = {
        team?: xsuportal_resources_team_pb.Team.AsObject,
        contestant?: xsuportal_resources_contestant_pb.Contestant.AsObject,
        contest?: xsuportal_resources_contest_pb.Contest.AsObject,
        pushVapidKey: string,
    }
}
