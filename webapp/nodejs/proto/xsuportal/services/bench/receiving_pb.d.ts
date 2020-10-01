// package: xsuportal.proto.services.bench
// file: xsuportal/services/bench/receiving.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class ReceiveBenchmarkJobRequest extends jspb.Message { 
    getTeamId(): number;
    setTeamId(value: number): ReceiveBenchmarkJobRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReceiveBenchmarkJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReceiveBenchmarkJobRequest): ReceiveBenchmarkJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReceiveBenchmarkJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReceiveBenchmarkJobRequest;
    static deserializeBinaryFromReader(message: ReceiveBenchmarkJobRequest, reader: jspb.BinaryReader): ReceiveBenchmarkJobRequest;
}

export namespace ReceiveBenchmarkJobRequest {
    export type AsObject = {
        teamId: number,
    }
}

export class ReceiveBenchmarkJobResponse extends jspb.Message { 

    hasJobHandle(): boolean;
    clearJobHandle(): void;
    getJobHandle(): ReceiveBenchmarkJobResponse.JobHandle | undefined;
    setJobHandle(value?: ReceiveBenchmarkJobResponse.JobHandle): ReceiveBenchmarkJobResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReceiveBenchmarkJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ReceiveBenchmarkJobResponse): ReceiveBenchmarkJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReceiveBenchmarkJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReceiveBenchmarkJobResponse;
    static deserializeBinaryFromReader(message: ReceiveBenchmarkJobResponse, reader: jspb.BinaryReader): ReceiveBenchmarkJobResponse;
}

export namespace ReceiveBenchmarkJobResponse {
    export type AsObject = {
        jobHandle?: ReceiveBenchmarkJobResponse.JobHandle.AsObject,
    }


    export class JobHandle extends jspb.Message { 
        getJobId(): number;
        setJobId(value: number): JobHandle;

        getHandle(): string;
        setHandle(value: string): JobHandle;

        getTargetHostname(): string;
        setTargetHostname(value: string): JobHandle;


        hasContestStartedAt(): boolean;
        clearContestStartedAt(): void;
        getContestStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
        setContestStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): JobHandle;


        hasJobCreatedAt(): boolean;
        clearJobCreatedAt(): void;
        getJobCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
        setJobCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): JobHandle;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): JobHandle.AsObject;
        static toObject(includeInstance: boolean, msg: JobHandle): JobHandle.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: JobHandle, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): JobHandle;
        static deserializeBinaryFromReader(message: JobHandle, reader: jspb.BinaryReader): JobHandle;
    }

    export namespace JobHandle {
        export type AsObject = {
            jobId: number,
            handle: string,
            targetHostname: string,
            contestStartedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
            jobCreatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        }
    }

}
