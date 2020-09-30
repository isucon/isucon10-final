// package: xsuportal.proto.resources
// file: xsuportal/resources/benchmark_result.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class BenchmarkResult extends jspb.Message { 
    getFinished(): boolean;
    setFinished(value: boolean): BenchmarkResult;

    getPassed(): boolean;
    setPassed(value: boolean): BenchmarkResult;

    getScore(): number;
    setScore(value: number): BenchmarkResult;


    hasScoreBreakdown(): boolean;
    clearScoreBreakdown(): void;
    getScoreBreakdown(): BenchmarkResult.ScoreBreakdown | undefined;
    setScoreBreakdown(value?: BenchmarkResult.ScoreBreakdown): BenchmarkResult;

    getReason(): string;
    setReason(value: string): BenchmarkResult;


    hasMarkedAt(): boolean;
    clearMarkedAt(): void;
    getMarkedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setMarkedAt(value?: google_protobuf_timestamp_pb.Timestamp): BenchmarkResult;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BenchmarkResult.AsObject;
    static toObject(includeInstance: boolean, msg: BenchmarkResult): BenchmarkResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BenchmarkResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BenchmarkResult;
    static deserializeBinaryFromReader(message: BenchmarkResult, reader: jspb.BinaryReader): BenchmarkResult;
}

export namespace BenchmarkResult {
    export type AsObject = {
        finished: boolean,
        passed: boolean,
        score: number,
        scoreBreakdown?: BenchmarkResult.ScoreBreakdown.AsObject,
        reason: string,
        markedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }


    export class ScoreBreakdown extends jspb.Message { 
        getRaw(): number;
        setRaw(value: number): ScoreBreakdown;

        getDeduction(): number;
        setDeduction(value: number): ScoreBreakdown;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ScoreBreakdown.AsObject;
        static toObject(includeInstance: boolean, msg: ScoreBreakdown): ScoreBreakdown.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: ScoreBreakdown, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ScoreBreakdown;
        static deserializeBinaryFromReader(message: ScoreBreakdown, reader: jspb.BinaryReader): ScoreBreakdown;
    }

    export namespace ScoreBreakdown {
        export type AsObject = {
            raw: number,
            deduction: number,
        }
    }

}
