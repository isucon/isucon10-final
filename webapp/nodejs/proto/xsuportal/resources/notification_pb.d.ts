// package: xsuportal.proto.resources
// file: xsuportal/resources/notification.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Notification extends jspb.Message { 
    getId(): number;
    setId(value: number): Notification;


    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Notification;


    hasContentBenchmarkJob(): boolean;
    clearContentBenchmarkJob(): void;
    getContentBenchmarkJob(): Notification.BenchmarkJobMessage | undefined;
    setContentBenchmarkJob(value?: Notification.BenchmarkJobMessage): Notification;


    hasContentClarification(): boolean;
    clearContentClarification(): void;
    getContentClarification(): Notification.ClarificationMessage | undefined;
    setContentClarification(value?: Notification.ClarificationMessage): Notification;


    hasContentTest(): boolean;
    clearContentTest(): void;
    getContentTest(): Notification.TestMessage | undefined;
    setContentTest(value?: Notification.TestMessage): Notification;


    getContentCase(): Notification.ContentCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Notification.AsObject;
    static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Notification;
    static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
    export type AsObject = {
        id: number,
        createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        contentBenchmarkJob?: Notification.BenchmarkJobMessage.AsObject,
        contentClarification?: Notification.ClarificationMessage.AsObject,
        contentTest?: Notification.TestMessage.AsObject,
    }


    export class BenchmarkJobMessage extends jspb.Message { 
        getBenchmarkJobId(): number;
        setBenchmarkJobId(value: number): BenchmarkJobMessage;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): BenchmarkJobMessage.AsObject;
        static toObject(includeInstance: boolean, msg: BenchmarkJobMessage): BenchmarkJobMessage.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: BenchmarkJobMessage, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): BenchmarkJobMessage;
        static deserializeBinaryFromReader(message: BenchmarkJobMessage, reader: jspb.BinaryReader): BenchmarkJobMessage;
    }

    export namespace BenchmarkJobMessage {
        export type AsObject = {
            benchmarkJobId: number,
        }
    }

    export class ClarificationMessage extends jspb.Message { 
        getClarificationId(): number;
        setClarificationId(value: number): ClarificationMessage;

        getOwned(): boolean;
        setOwned(value: boolean): ClarificationMessage;

        getUpdated(): boolean;
        setUpdated(value: boolean): ClarificationMessage;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ClarificationMessage.AsObject;
        static toObject(includeInstance: boolean, msg: ClarificationMessage): ClarificationMessage.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: ClarificationMessage, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ClarificationMessage;
        static deserializeBinaryFromReader(message: ClarificationMessage, reader: jspb.BinaryReader): ClarificationMessage;
    }

    export namespace ClarificationMessage {
        export type AsObject = {
            clarificationId: number,
            owned: boolean,
            updated: boolean,
        }
    }

    export class TestMessage extends jspb.Message { 
        getSomething(): number;
        setSomething(value: number): TestMessage;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): TestMessage.AsObject;
        static toObject(includeInstance: boolean, msg: TestMessage): TestMessage.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: TestMessage, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): TestMessage;
        static deserializeBinaryFromReader(message: TestMessage, reader: jspb.BinaryReader): TestMessage;
    }

    export namespace TestMessage {
        export type AsObject = {
            something: number,
        }
    }


    export enum ContentCase {
        CONTENT_NOT_SET = 0,
    
    CONTENT_BENCHMARK_JOB = 3,

    CONTENT_CLARIFICATION = 4,

    CONTENT_TEST = 5,

    }

}
