// package: xsuportal.proto.services.admin
// file: xsuportal/services/admin/initialize.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_contest_pb from "../../../xsuportal/resources/contest_pb";

export class InitializeRequest extends jspb.Message { 

    hasContest(): boolean;
    clearContest(): void;
    getContest(): xsuportal_resources_contest_pb.Contest | undefined;
    setContest(value?: xsuportal_resources_contest_pb.Contest): InitializeRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitializeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InitializeRequest): InitializeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitializeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitializeRequest;
    static deserializeBinaryFromReader(message: InitializeRequest, reader: jspb.BinaryReader): InitializeRequest;
}

export namespace InitializeRequest {
    export type AsObject = {
        contest?: xsuportal_resources_contest_pb.Contest.AsObject,
    }
}

export class InitializeResponse extends jspb.Message { 
    getLanguage(): string;
    setLanguage(value: string): InitializeResponse;


    hasBenchmarkServer(): boolean;
    clearBenchmarkServer(): void;
    getBenchmarkServer(): InitializeResponse.BenchmarkServer | undefined;
    setBenchmarkServer(value?: InitializeResponse.BenchmarkServer): InitializeResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitializeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InitializeResponse): InitializeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitializeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitializeResponse;
    static deserializeBinaryFromReader(message: InitializeResponse, reader: jspb.BinaryReader): InitializeResponse;
}

export namespace InitializeResponse {
    export type AsObject = {
        language: string,
        benchmarkServer?: InitializeResponse.BenchmarkServer.AsObject,
    }


    export class BenchmarkServer extends jspb.Message { 
        getHost(): string;
        setHost(value: string): BenchmarkServer;

        getPort(): number;
        setPort(value: number): BenchmarkServer;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): BenchmarkServer.AsObject;
        static toObject(includeInstance: boolean, msg: BenchmarkServer): BenchmarkServer.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: BenchmarkServer, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): BenchmarkServer;
        static deserializeBinaryFromReader(message: BenchmarkServer, reader: jspb.BinaryReader): BenchmarkServer;
    }

    export namespace BenchmarkServer {
        export type AsObject = {
            host: string,
            port: number,
        }
    }

}
