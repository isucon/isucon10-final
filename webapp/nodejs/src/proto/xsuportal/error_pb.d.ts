// package: xsuportal.proto
// file: xsuportal/error.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Error extends jspb.Message { 
    getCode(): number;
    setCode(value: number): Error;

    getName(): string;
    setName(value: string): Error;

    getHumanMessage(): string;
    setHumanMessage(value: string): Error;

    clearHumanDescriptionsList(): void;
    getHumanDescriptionsList(): Array<string>;
    setHumanDescriptionsList(value: Array<string>): Error;
    addHumanDescriptions(value: string, index?: number): string;


    hasDebugInfo(): boolean;
    clearDebugInfo(): void;
    getDebugInfo(): Error.DebugInfo | undefined;
    setDebugInfo(value?: Error.DebugInfo): Error;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
    export type AsObject = {
        code: number,
        name: string,
        humanMessage: string,
        humanDescriptionsList: Array<string>,
        debugInfo?: Error.DebugInfo.AsObject,
    }


    export class DebugInfo extends jspb.Message { 
        getException(): string;
        setException(value: string): DebugInfo;

        clearTraceList(): void;
        getTraceList(): Array<string>;
        setTraceList(value: Array<string>): DebugInfo;
        addTrace(value: string, index?: number): string;

        clearApplicationTraceList(): void;
        getApplicationTraceList(): Array<string>;
        setApplicationTraceList(value: Array<string>): DebugInfo;
        addApplicationTrace(value: string, index?: number): string;

        clearFrameworkTraceList(): void;
        getFrameworkTraceList(): Array<string>;
        setFrameworkTraceList(value: Array<string>): DebugInfo;
        addFrameworkTrace(value: string, index?: number): string;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): DebugInfo.AsObject;
        static toObject(includeInstance: boolean, msg: DebugInfo): DebugInfo.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: DebugInfo, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): DebugInfo;
        static deserializeBinaryFromReader(message: DebugInfo, reader: jspb.BinaryReader): DebugInfo;
    }

    export namespace DebugInfo {
        export type AsObject = {
            exception: string,
            traceList: Array<string>,
            applicationTraceList: Array<string>,
            frameworkTraceList: Array<string>,
        }
    }

}
