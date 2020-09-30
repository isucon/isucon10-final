// package: xsuportal.proto.resources
// file: xsuportal/resources/contest.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Contest extends jspb.Message { 

    hasRegistrationOpenAt(): boolean;
    clearRegistrationOpenAt(): void;
    getRegistrationOpenAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setRegistrationOpenAt(value?: google_protobuf_timestamp_pb.Timestamp): Contest;


    hasContestStartsAt(): boolean;
    clearContestStartsAt(): void;
    getContestStartsAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setContestStartsAt(value?: google_protobuf_timestamp_pb.Timestamp): Contest;


    hasContestFreezesAt(): boolean;
    clearContestFreezesAt(): void;
    getContestFreezesAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setContestFreezesAt(value?: google_protobuf_timestamp_pb.Timestamp): Contest;


    hasContestEndsAt(): boolean;
    clearContestEndsAt(): void;
    getContestEndsAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setContestEndsAt(value?: google_protobuf_timestamp_pb.Timestamp): Contest;

    getStatus(): Contest.Status;
    setStatus(value: Contest.Status): Contest;

    getFrozen(): boolean;
    setFrozen(value: boolean): Contest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Contest.AsObject;
    static toObject(includeInstance: boolean, msg: Contest): Contest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Contest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Contest;
    static deserializeBinaryFromReader(message: Contest, reader: jspb.BinaryReader): Contest;
}

export namespace Contest {
    export type AsObject = {
        registrationOpenAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        contestStartsAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        contestFreezesAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        contestEndsAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        status: Contest.Status,
        frozen: boolean,
    }

    export enum Status {
    STANDBY = 0,
    REGISTRATION = 1,
    STARTED = 2,
    FINISHED = 3,
    }

}
