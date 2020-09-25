// package: xsuportal.proto.resources
// file: xsuportal/resources/benchmark_job.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_benchmark_result_pb from "../../xsuportal/resources/benchmark_result_pb";
import * as xsuportal_resources_team_pb from "../../xsuportal/resources/team_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class BenchmarkJob extends jspb.Message { 
    getId(): number;
    setId(value: number): BenchmarkJob;

    getTeamId(): number;
    setTeamId(value: number): BenchmarkJob;

    getStatus(): BenchmarkJob.Status;
    setStatus(value: BenchmarkJob.Status): BenchmarkJob;


    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): BenchmarkJob;


    hasUpdatedAt(): boolean;
    clearUpdatedAt(): void;
    getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): BenchmarkJob;


    hasStartedAt(): boolean;
    clearStartedAt(): void;
    getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): BenchmarkJob;


    hasFinishedAt(): boolean;
    clearFinishedAt(): void;
    getFinishedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setFinishedAt(value?: google_protobuf_timestamp_pb.Timestamp): BenchmarkJob;


    hasTeam(): boolean;
    clearTeam(): void;
    getTeam(): xsuportal_resources_team_pb.Team | undefined;
    setTeam(value?: xsuportal_resources_team_pb.Team): BenchmarkJob;


    hasResult(): boolean;
    clearResult(): void;
    getResult(): xsuportal_resources_benchmark_result_pb.BenchmarkResult | undefined;
    setResult(value?: xsuportal_resources_benchmark_result_pb.BenchmarkResult): BenchmarkJob;

    getTargetHostname(): string;
    setTargetHostname(value: string): BenchmarkJob;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BenchmarkJob.AsObject;
    static toObject(includeInstance: boolean, msg: BenchmarkJob): BenchmarkJob.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BenchmarkJob, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BenchmarkJob;
    static deserializeBinaryFromReader(message: BenchmarkJob, reader: jspb.BinaryReader): BenchmarkJob;
}

export namespace BenchmarkJob {
    export type AsObject = {
        id: number,
        teamId: number,
        status: BenchmarkJob.Status,
        createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        finishedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        team?: xsuportal_resources_team_pb.Team.AsObject,
        result?: xsuportal_resources_benchmark_result_pb.BenchmarkResult.AsObject,
        targetHostname: string,
    }

    export enum Status {
    PENDING = 0,
    SENT = 1,
    RUNNING = 2,
    ERRORED = 3,
    CANCELLED = 4,
    FINISHED = 5,
    }

}
