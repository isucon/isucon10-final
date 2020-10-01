// package: xsuportal.proto.services.bench
// file: xsuportal/services/bench/reporting.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_benchmark_result_pb from "../../../xsuportal/resources/benchmark_result_pb";

export class ReportBenchmarkResultRequest extends jspb.Message { 
    getJobId(): number;
    setJobId(value: number): ReportBenchmarkResultRequest;

    getHandle(): string;
    setHandle(value: string): ReportBenchmarkResultRequest;

    getNonce(): number;
    setNonce(value: number): ReportBenchmarkResultRequest;


    hasResult(): boolean;
    clearResult(): void;
    getResult(): xsuportal_resources_benchmark_result_pb.BenchmarkResult | undefined;
    setResult(value?: xsuportal_resources_benchmark_result_pb.BenchmarkResult): ReportBenchmarkResultRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportBenchmarkResultRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReportBenchmarkResultRequest): ReportBenchmarkResultRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportBenchmarkResultRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportBenchmarkResultRequest;
    static deserializeBinaryFromReader(message: ReportBenchmarkResultRequest, reader: jspb.BinaryReader): ReportBenchmarkResultRequest;
}

export namespace ReportBenchmarkResultRequest {
    export type AsObject = {
        jobId: number,
        handle: string,
        nonce: number,
        result?: xsuportal_resources_benchmark_result_pb.BenchmarkResult.AsObject,
    }
}

export class ReportBenchmarkResultResponse extends jspb.Message { 
    getAckedNonce(): number;
    setAckedNonce(value: number): ReportBenchmarkResultResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReportBenchmarkResultResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ReportBenchmarkResultResponse): ReportBenchmarkResultResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReportBenchmarkResultResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReportBenchmarkResultResponse;
    static deserializeBinaryFromReader(message: ReportBenchmarkResultResponse, reader: jspb.BinaryReader): ReportBenchmarkResultResponse;
}

export namespace ReportBenchmarkResultResponse {
    export type AsObject = {
        ackedNonce: number,
    }
}
