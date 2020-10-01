// package: xsuportal.proto.services.admin
// file: xsuportal/services/admin/benchmark.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_benchmark_job_pb from "../../../xsuportal/resources/benchmark_job_pb";

export class ListBenchmarkJobsRequest extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): ListBenchmarkJobsRequest;

    getIncompleteOnly(): boolean;
    setIncompleteOnly(value: boolean): ListBenchmarkJobsRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListBenchmarkJobsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListBenchmarkJobsRequest): ListBenchmarkJobsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListBenchmarkJobsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListBenchmarkJobsRequest;
    static deserializeBinaryFromReader(message: ListBenchmarkJobsRequest, reader: jspb.BinaryReader): ListBenchmarkJobsRequest;
}

export namespace ListBenchmarkJobsRequest {
    export type AsObject = {
        teamId: number,
        incompleteOnly: boolean,
    }
}

export class ListBenchmarkJobsResponse extends jspb.Message { 
    clearJobsList(): void;
    getJobsList(): Array<xsuportal_resources_benchmark_job_pb.BenchmarkJob>;
    setJobsList(value: Array<xsuportal_resources_benchmark_job_pb.BenchmarkJob>): ListBenchmarkJobsResponse;
    addJobs(value?: xsuportal_resources_benchmark_job_pb.BenchmarkJob, index?: number): xsuportal_resources_benchmark_job_pb.BenchmarkJob;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListBenchmarkJobsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListBenchmarkJobsResponse): ListBenchmarkJobsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListBenchmarkJobsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListBenchmarkJobsResponse;
    static deserializeBinaryFromReader(message: ListBenchmarkJobsResponse, reader: jspb.BinaryReader): ListBenchmarkJobsResponse;
}

export namespace ListBenchmarkJobsResponse {
    export type AsObject = {
        jobsList: Array<xsuportal_resources_benchmark_job_pb.BenchmarkJob.AsObject>,
    }
}

export class EnqueueBenchmarkJobRequest extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): EnqueueBenchmarkJobRequest;

    getTargetId(): number;
    setTargetId(value: number): EnqueueBenchmarkJobRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EnqueueBenchmarkJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: EnqueueBenchmarkJobRequest): EnqueueBenchmarkJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EnqueueBenchmarkJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EnqueueBenchmarkJobRequest;
    static deserializeBinaryFromReader(message: EnqueueBenchmarkJobRequest, reader: jspb.BinaryReader): EnqueueBenchmarkJobRequest;
}

export namespace EnqueueBenchmarkJobRequest {
    export type AsObject = {
        teamId: number,
        targetId: number,
    }
}

export class EnqueueBenchmarkJobResponse extends jspb.Message { 

    hasJob(): boolean;
    clearJob(): void;
    getJob(): xsuportal_resources_benchmark_job_pb.BenchmarkJob | undefined;
    setJob(value?: xsuportal_resources_benchmark_job_pb.BenchmarkJob): EnqueueBenchmarkJobResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EnqueueBenchmarkJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: EnqueueBenchmarkJobResponse): EnqueueBenchmarkJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EnqueueBenchmarkJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EnqueueBenchmarkJobResponse;
    static deserializeBinaryFromReader(message: EnqueueBenchmarkJobResponse, reader: jspb.BinaryReader): EnqueueBenchmarkJobResponse;
}

export namespace EnqueueBenchmarkJobResponse {
    export type AsObject = {
        job?: xsuportal_resources_benchmark_job_pb.BenchmarkJob.AsObject,
    }
}

export class CancelBenchmarkJobRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): CancelBenchmarkJobRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CancelBenchmarkJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CancelBenchmarkJobRequest): CancelBenchmarkJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CancelBenchmarkJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CancelBenchmarkJobRequest;
    static deserializeBinaryFromReader(message: CancelBenchmarkJobRequest, reader: jspb.BinaryReader): CancelBenchmarkJobRequest;
}

export namespace CancelBenchmarkJobRequest {
    export type AsObject = {
        id: number,
    }
}

export class CancelBenchmarkJobResponse extends jspb.Message { 

    hasJob(): boolean;
    clearJob(): void;
    getJob(): xsuportal_resources_benchmark_job_pb.BenchmarkJob | undefined;
    setJob(value?: xsuportal_resources_benchmark_job_pb.BenchmarkJob): CancelBenchmarkJobResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CancelBenchmarkJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CancelBenchmarkJobResponse): CancelBenchmarkJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CancelBenchmarkJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CancelBenchmarkJobResponse;
    static deserializeBinaryFromReader(message: CancelBenchmarkJobResponse, reader: jspb.BinaryReader): CancelBenchmarkJobResponse;
}

export namespace CancelBenchmarkJobResponse {
    export type AsObject = {
        job?: xsuportal_resources_benchmark_job_pb.BenchmarkJob.AsObject,
    }
}

export class GetBenchmarkJobQuery extends jspb.Message { 
    getId(): number;
    setId(value: number): GetBenchmarkJobQuery;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBenchmarkJobQuery.AsObject;
    static toObject(includeInstance: boolean, msg: GetBenchmarkJobQuery): GetBenchmarkJobQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBenchmarkJobQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBenchmarkJobQuery;
    static deserializeBinaryFromReader(message: GetBenchmarkJobQuery, reader: jspb.BinaryReader): GetBenchmarkJobQuery;
}

export namespace GetBenchmarkJobQuery {
    export type AsObject = {
        id: number,
    }
}

export class GetBenchmarkJobResponse extends jspb.Message { 

    hasJob(): boolean;
    clearJob(): void;
    getJob(): xsuportal_resources_benchmark_job_pb.BenchmarkJob | undefined;
    setJob(value?: xsuportal_resources_benchmark_job_pb.BenchmarkJob): GetBenchmarkJobResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBenchmarkJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBenchmarkJobResponse): GetBenchmarkJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBenchmarkJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBenchmarkJobResponse;
    static deserializeBinaryFromReader(message: GetBenchmarkJobResponse, reader: jspb.BinaryReader): GetBenchmarkJobResponse;
}

export namespace GetBenchmarkJobResponse {
    export type AsObject = {
        job?: xsuportal_resources_benchmark_job_pb.BenchmarkJob.AsObject,
    }
}
