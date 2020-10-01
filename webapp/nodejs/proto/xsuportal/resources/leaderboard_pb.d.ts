// package: xsuportal.proto.resources
// file: xsuportal/resources/leaderboard.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as xsuportal_resources_team_pb from "../../xsuportal/resources/team_pb";
import * as xsuportal_resources_contest_pb from "../../xsuportal/resources/contest_pb";

export class Leaderboard extends jspb.Message { 
    clearTeamsList(): void;
    getTeamsList(): Array<Leaderboard.LeaderboardItem>;
    setTeamsList(value: Array<Leaderboard.LeaderboardItem>): Leaderboard;
    addTeams(value?: Leaderboard.LeaderboardItem, index?: number): Leaderboard.LeaderboardItem;

    clearGeneralTeamsList(): void;
    getGeneralTeamsList(): Array<Leaderboard.LeaderboardItem>;
    setGeneralTeamsList(value: Array<Leaderboard.LeaderboardItem>): Leaderboard;
    addGeneralTeams(value?: Leaderboard.LeaderboardItem, index?: number): Leaderboard.LeaderboardItem;

    clearStudentTeamsList(): void;
    getStudentTeamsList(): Array<Leaderboard.LeaderboardItem>;
    setStudentTeamsList(value: Array<Leaderboard.LeaderboardItem>): Leaderboard;
    addStudentTeams(value?: Leaderboard.LeaderboardItem, index?: number): Leaderboard.LeaderboardItem;

    clearProgressesList(): void;
    getProgressesList(): Array<Leaderboard.LeaderboardItem>;
    setProgressesList(value: Array<Leaderboard.LeaderboardItem>): Leaderboard;
    addProgresses(value?: Leaderboard.LeaderboardItem, index?: number): Leaderboard.LeaderboardItem;


    hasContest(): boolean;
    clearContest(): void;
    getContest(): xsuportal_resources_contest_pb.Contest | undefined;
    setContest(value?: xsuportal_resources_contest_pb.Contest): Leaderboard;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Leaderboard.AsObject;
    static toObject(includeInstance: boolean, msg: Leaderboard): Leaderboard.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Leaderboard, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Leaderboard;
    static deserializeBinaryFromReader(message: Leaderboard, reader: jspb.BinaryReader): Leaderboard;
}

export namespace Leaderboard {
    export type AsObject = {
        teamsList: Array<Leaderboard.LeaderboardItem.AsObject>,
        generalTeamsList: Array<Leaderboard.LeaderboardItem.AsObject>,
        studentTeamsList: Array<Leaderboard.LeaderboardItem.AsObject>,
        progressesList: Array<Leaderboard.LeaderboardItem.AsObject>,
        contest?: xsuportal_resources_contest_pb.Contest.AsObject,
    }


    export class LeaderboardItem extends jspb.Message { 
        clearScoresList(): void;
        getScoresList(): Array<Leaderboard.LeaderboardItem.LeaderboardScore>;
        setScoresList(value: Array<Leaderboard.LeaderboardItem.LeaderboardScore>): LeaderboardItem;
        addScores(value?: Leaderboard.LeaderboardItem.LeaderboardScore, index?: number): Leaderboard.LeaderboardItem.LeaderboardScore;


        hasBestScore(): boolean;
        clearBestScore(): void;
        getBestScore(): Leaderboard.LeaderboardItem.LeaderboardScore | undefined;
        setBestScore(value?: Leaderboard.LeaderboardItem.LeaderboardScore): LeaderboardItem;


        hasLatestScore(): boolean;
        clearLatestScore(): void;
        getLatestScore(): Leaderboard.LeaderboardItem.LeaderboardScore | undefined;
        setLatestScore(value?: Leaderboard.LeaderboardItem.LeaderboardScore): LeaderboardItem;

        getFinishCount(): number;
        setFinishCount(value: number): LeaderboardItem;


        hasTeam(): boolean;
        clearTeam(): void;
        getTeam(): xsuportal_resources_team_pb.Team | undefined;
        setTeam(value?: xsuportal_resources_team_pb.Team): LeaderboardItem;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): LeaderboardItem.AsObject;
        static toObject(includeInstance: boolean, msg: LeaderboardItem): LeaderboardItem.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: LeaderboardItem, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): LeaderboardItem;
        static deserializeBinaryFromReader(message: LeaderboardItem, reader: jspb.BinaryReader): LeaderboardItem;
    }

    export namespace LeaderboardItem {
        export type AsObject = {
            scoresList: Array<Leaderboard.LeaderboardItem.LeaderboardScore.AsObject>,
            bestScore?: Leaderboard.LeaderboardItem.LeaderboardScore.AsObject,
            latestScore?: Leaderboard.LeaderboardItem.LeaderboardScore.AsObject,
            finishCount: number,
            team?: xsuportal_resources_team_pb.Team.AsObject,
        }


        export class LeaderboardScore extends jspb.Message { 
            getScore(): number;
            setScore(value: number): LeaderboardScore;


            hasStartedAt(): boolean;
            clearStartedAt(): void;
            getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
            setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): LeaderboardScore;


            hasMarkedAt(): boolean;
            clearMarkedAt(): void;
            getMarkedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
            setMarkedAt(value?: google_protobuf_timestamp_pb.Timestamp): LeaderboardScore;


            serializeBinary(): Uint8Array;
            toObject(includeInstance?: boolean): LeaderboardScore.AsObject;
            static toObject(includeInstance: boolean, msg: LeaderboardScore): LeaderboardScore.AsObject;
            static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
            static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
            static serializeBinaryToWriter(message: LeaderboardScore, writer: jspb.BinaryWriter): void;
            static deserializeBinary(bytes: Uint8Array): LeaderboardScore;
            static deserializeBinaryFromReader(message: LeaderboardScore, reader: jspb.BinaryReader): LeaderboardScore;
        }

        export namespace LeaderboardScore {
            export type AsObject = {
                score: number,
                startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
                markedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
            }
        }

    }

}
