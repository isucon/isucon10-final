// package: xsuportal.proto.services.contestant
// file: xsuportal/services/contestant/notifications.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xsuportal_resources_notification_pb from "../../../xsuportal/resources/notification_pb";

export class ListNotificationsQuery extends jspb.Message { 
    getAfter(): number;
    setAfter(value: number): ListNotificationsQuery;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListNotificationsQuery.AsObject;
    static toObject(includeInstance: boolean, msg: ListNotificationsQuery): ListNotificationsQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListNotificationsQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListNotificationsQuery;
    static deserializeBinaryFromReader(message: ListNotificationsQuery, reader: jspb.BinaryReader): ListNotificationsQuery;
}

export namespace ListNotificationsQuery {
    export type AsObject = {
        after: number,
    }
}

export class ListNotificationsResponse extends jspb.Message { 
    getLastAnsweredClarificationId(): number;
    setLastAnsweredClarificationId(value: number): ListNotificationsResponse;

    clearNotificationsList(): void;
    getNotificationsList(): Array<xsuportal_resources_notification_pb.Notification>;
    setNotificationsList(value: Array<xsuportal_resources_notification_pb.Notification>): ListNotificationsResponse;
    addNotifications(value?: xsuportal_resources_notification_pb.Notification, index?: number): xsuportal_resources_notification_pb.Notification;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListNotificationsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListNotificationsResponse): ListNotificationsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListNotificationsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListNotificationsResponse;
    static deserializeBinaryFromReader(message: ListNotificationsResponse, reader: jspb.BinaryReader): ListNotificationsResponse;
}

export namespace ListNotificationsResponse {
    export type AsObject = {
        lastAnsweredClarificationId: number,
        notificationsList: Array<xsuportal_resources_notification_pb.Notification.AsObject>,
    }
}

export class SubscribeNotificationRequest extends jspb.Message { 
    getEndpoint(): string;
    setEndpoint(value: string): SubscribeNotificationRequest;

    getP256dh(): string;
    setP256dh(value: string): SubscribeNotificationRequest;

    getAuth(): string;
    setAuth(value: string): SubscribeNotificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeNotificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeNotificationRequest): SubscribeNotificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeNotificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeNotificationRequest;
    static deserializeBinaryFromReader(message: SubscribeNotificationRequest, reader: jspb.BinaryReader): SubscribeNotificationRequest;
}

export namespace SubscribeNotificationRequest {
    export type AsObject = {
        endpoint: string,
        p256dh: string,
        auth: string,
    }
}

export class SubscribeNotificationResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeNotificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeNotificationResponse): SubscribeNotificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeNotificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeNotificationResponse;
    static deserializeBinaryFromReader(message: SubscribeNotificationResponse, reader: jspb.BinaryReader): SubscribeNotificationResponse;
}

export namespace SubscribeNotificationResponse {
    export type AsObject = {
    }
}

export class UnsubscribeNotificationRequest extends jspb.Message { 
    getEndpoint(): string;
    setEndpoint(value: string): UnsubscribeNotificationRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnsubscribeNotificationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnsubscribeNotificationRequest): UnsubscribeNotificationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnsubscribeNotificationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnsubscribeNotificationRequest;
    static deserializeBinaryFromReader(message: UnsubscribeNotificationRequest, reader: jspb.BinaryReader): UnsubscribeNotificationRequest;
}

export namespace UnsubscribeNotificationRequest {
    export type AsObject = {
        endpoint: string,
    }
}

export class UnsubscribeNotificationResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnsubscribeNotificationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnsubscribeNotificationResponse): UnsubscribeNotificationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnsubscribeNotificationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnsubscribeNotificationResponse;
    static deserializeBinaryFromReader(message: UnsubscribeNotificationResponse, reader: jspb.BinaryReader): UnsubscribeNotificationResponse;
}

export namespace UnsubscribeNotificationResponse {
    export type AsObject = {
    }
}
