// package: xsuportal.proto.resources
// file: xsuportal/resources/contestant.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Contestant extends jspb.Message { 
    getId(): string;
    setId(value: string): Contestant;

    getTeamId(): number;
    setTeamId(value: number): Contestant;

    getName(): string;
    setName(value: string): Contestant;

    getIsStudent(): boolean;
    setIsStudent(value: boolean): Contestant;

    getIsStaff(): boolean;
    setIsStaff(value: boolean): Contestant;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Contestant.AsObject;
    static toObject(includeInstance: boolean, msg: Contestant): Contestant.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Contestant, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Contestant;
    static deserializeBinaryFromReader(message: Contestant, reader: jspb.BinaryReader): Contestant;
}

export namespace Contestant {
    export type AsObject = {
        id: string,
        teamId: number,
        name: string,
        isStudent: boolean,
        isStaff: boolean,
    }
}
