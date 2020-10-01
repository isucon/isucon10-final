// package: xsuportal.proto.resources
// file: xsuportal/resources/staff.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Staff extends jspb.Message { 
    getId(): number;
    setId(value: number): Staff;

    getGithubLogin(): string;
    setGithubLogin(value: string): Staff;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Staff.AsObject;
    static toObject(includeInstance: boolean, msg: Staff): Staff.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Staff, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Staff;
    static deserializeBinaryFromReader(message: Staff, reader: jspb.BinaryReader): Staff;
}

export namespace Staff {
    export type AsObject = {
        id: number,
        githubLogin: string,
    }
}
