import * as $protobuf from "protobufjs";
/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Namespace xsuportal. */
export namespace xsuportal {

    /** Namespace proto. */
    namespace proto {

        /** Namespace resources. */
        namespace resources {

            /** Properties of a Notification. */
            interface INotification {

                /** Notification id */
                id?: (number|Long|null);

                /** Notification createdAt */
                createdAt?: (google.protobuf.ITimestamp|null);

                /** Notification contentBenchmarkJob */
                contentBenchmarkJob?: (xsuportal.proto.resources.Notification.IBenchmarkJobMessage|null);

                /** Notification contentClarification */
                contentClarification?: (xsuportal.proto.resources.Notification.IClarificationMessage|null);

                /** Notification contentTest */
                contentTest?: (xsuportal.proto.resources.Notification.ITestMessage|null);
            }

            /** Represents a Notification. */
            class Notification implements INotification {

                /**
                 * Constructs a new Notification.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.INotification);

                /** Notification id. */
                public id: (number|Long);

                /** Notification createdAt. */
                public createdAt?: (google.protobuf.ITimestamp|null);

                /** Notification contentBenchmarkJob. */
                public contentBenchmarkJob?: (xsuportal.proto.resources.Notification.IBenchmarkJobMessage|null);

                /** Notification contentClarification. */
                public contentClarification?: (xsuportal.proto.resources.Notification.IClarificationMessage|null);

                /** Notification contentTest. */
                public contentTest?: (xsuportal.proto.resources.Notification.ITestMessage|null);

                /** Notification content. */
                public content?: ("contentBenchmarkJob"|"contentClarification"|"contentTest");

                /**
                 * Creates a new Notification instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Notification instance
                 */
                public static create(properties?: xsuportal.proto.resources.INotification): xsuportal.proto.resources.Notification;

                /**
                 * Encodes the specified Notification message. Does not implicitly {@link xsuportal.proto.resources.Notification.verify|verify} messages.
                 * @param message Notification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.INotification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Notification message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.verify|verify} messages.
                 * @param message Notification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.INotification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Notification message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Notification;

                /**
                 * Decodes a Notification message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Notification;

                /**
                 * Verifies a Notification message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Notification
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Notification;

                /**
                 * Creates a plain object from a Notification message. Also converts values to other types if specified.
                 * @param message Notification
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Notification, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Notification to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Notification {

                /** Properties of a BenchmarkJobMessage. */
                interface IBenchmarkJobMessage {

                    /** BenchmarkJobMessage benchmarkJobId */
                    benchmarkJobId?: (number|Long|null);
                }

                /** Represents a BenchmarkJobMessage. */
                class BenchmarkJobMessage implements IBenchmarkJobMessage {

                    /**
                     * Constructs a new BenchmarkJobMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.Notification.IBenchmarkJobMessage);

                    /** BenchmarkJobMessage benchmarkJobId. */
                    public benchmarkJobId: (number|Long);

                    /**
                     * Creates a new BenchmarkJobMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BenchmarkJobMessage instance
                     */
                    public static create(properties?: xsuportal.proto.resources.Notification.IBenchmarkJobMessage): xsuportal.proto.resources.Notification.BenchmarkJobMessage;

                    /**
                     * Encodes the specified BenchmarkJobMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.BenchmarkJobMessage.verify|verify} messages.
                     * @param message BenchmarkJobMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.Notification.IBenchmarkJobMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BenchmarkJobMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.BenchmarkJobMessage.verify|verify} messages.
                     * @param message BenchmarkJobMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.Notification.IBenchmarkJobMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BenchmarkJobMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BenchmarkJobMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Notification.BenchmarkJobMessage;

                    /**
                     * Decodes a BenchmarkJobMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BenchmarkJobMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Notification.BenchmarkJobMessage;

                    /**
                     * Verifies a BenchmarkJobMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BenchmarkJobMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BenchmarkJobMessage
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Notification.BenchmarkJobMessage;

                    /**
                     * Creates a plain object from a BenchmarkJobMessage message. Also converts values to other types if specified.
                     * @param message BenchmarkJobMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.Notification.BenchmarkJobMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BenchmarkJobMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ClarificationMessage. */
                interface IClarificationMessage {

                    /** ClarificationMessage clarificationId */
                    clarificationId?: (number|Long|null);

                    /** ClarificationMessage owned */
                    owned?: (boolean|null);

                    /** ClarificationMessage updated */
                    updated?: (boolean|null);
                }

                /** Represents a ClarificationMessage. */
                class ClarificationMessage implements IClarificationMessage {

                    /**
                     * Constructs a new ClarificationMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.Notification.IClarificationMessage);

                    /** ClarificationMessage clarificationId. */
                    public clarificationId: (number|Long);

                    /** ClarificationMessage owned. */
                    public owned: boolean;

                    /** ClarificationMessage updated. */
                    public updated: boolean;

                    /**
                     * Creates a new ClarificationMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ClarificationMessage instance
                     */
                    public static create(properties?: xsuportal.proto.resources.Notification.IClarificationMessage): xsuportal.proto.resources.Notification.ClarificationMessage;

                    /**
                     * Encodes the specified ClarificationMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.ClarificationMessage.verify|verify} messages.
                     * @param message ClarificationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.Notification.IClarificationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ClarificationMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.ClarificationMessage.verify|verify} messages.
                     * @param message ClarificationMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.Notification.IClarificationMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ClarificationMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ClarificationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Notification.ClarificationMessage;

                    /**
                     * Decodes a ClarificationMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ClarificationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Notification.ClarificationMessage;

                    /**
                     * Verifies a ClarificationMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ClarificationMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ClarificationMessage
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Notification.ClarificationMessage;

                    /**
                     * Creates a plain object from a ClarificationMessage message. Also converts values to other types if specified.
                     * @param message ClarificationMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.Notification.ClarificationMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ClarificationMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a TestMessage. */
                interface ITestMessage {

                    /** TestMessage something */
                    something?: (number|Long|null);
                }

                /** Represents a TestMessage. */
                class TestMessage implements ITestMessage {

                    /**
                     * Constructs a new TestMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.Notification.ITestMessage);

                    /** TestMessage something. */
                    public something: (number|Long);

                    /**
                     * Creates a new TestMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TestMessage instance
                     */
                    public static create(properties?: xsuportal.proto.resources.Notification.ITestMessage): xsuportal.proto.resources.Notification.TestMessage;

                    /**
                     * Encodes the specified TestMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.TestMessage.verify|verify} messages.
                     * @param message TestMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.Notification.ITestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TestMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.TestMessage.verify|verify} messages.
                     * @param message TestMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.Notification.ITestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TestMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Notification.TestMessage;

                    /**
                     * Decodes a TestMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Notification.TestMessage;

                    /**
                     * Verifies a TestMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TestMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TestMessage
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Notification.TestMessage;

                    /**
                     * Creates a plain object from a TestMessage message. Also converts values to other types if specified.
                     * @param message TestMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.Notification.TestMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TestMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }
        }
    }
}
