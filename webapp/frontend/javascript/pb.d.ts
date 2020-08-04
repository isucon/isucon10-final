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

        /** Properties of an Error. */
        interface IError {

            /** Error code */
            code?: (number|null);

            /** Error name */
            name?: (string|null);

            /** Error humanMessage */
            humanMessage?: (string|null);

            /** Error humanDescriptions */
            humanDescriptions?: (string[]|null);

            /** Error debugInfo */
            debugInfo?: (xsuportal.proto.Error.IDebugInfo|null);
        }

        /** Represents an Error. */
        class Error implements IError {

            /**
             * Constructs a new Error.
             * @param [properties] Properties to set
             */
            constructor(properties?: xsuportal.proto.IError);

            /** Error code. */
            public code: number;

            /** Error name. */
            public name: string;

            /** Error humanMessage. */
            public humanMessage: string;

            /** Error humanDescriptions. */
            public humanDescriptions: string[];

            /** Error debugInfo. */
            public debugInfo?: (xsuportal.proto.Error.IDebugInfo|null);

            /**
             * Creates a new Error instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Error instance
             */
            public static create(properties?: xsuportal.proto.IError): xsuportal.proto.Error;

            /**
             * Encodes the specified Error message. Does not implicitly {@link xsuportal.proto.Error.verify|verify} messages.
             * @param message Error message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: xsuportal.proto.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Error message, length delimited. Does not implicitly {@link xsuportal.proto.Error.verify|verify} messages.
             * @param message Error message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: xsuportal.proto.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Error message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.Error;

            /**
             * Decodes an Error message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.Error;

            /**
             * Verifies an Error message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Error message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Error
             */
            public static fromObject(object: { [k: string]: any }): xsuportal.proto.Error;

            /**
             * Creates a plain object from an Error message. Also converts values to other types if specified.
             * @param message Error
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: xsuportal.proto.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Error to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Error {

            /** Properties of a DebugInfo. */
            interface IDebugInfo {

                /** DebugInfo exception */
                exception?: (string|null);

                /** DebugInfo trace */
                trace?: (string[]|null);

                /** DebugInfo applicationTrace */
                applicationTrace?: (string[]|null);

                /** DebugInfo frameworkTrace */
                frameworkTrace?: (string[]|null);
            }

            /** Represents a DebugInfo. */
            class DebugInfo implements IDebugInfo {

                /**
                 * Constructs a new DebugInfo.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.Error.IDebugInfo);

                /** DebugInfo exception. */
                public exception: string;

                /** DebugInfo trace. */
                public trace: string[];

                /** DebugInfo applicationTrace. */
                public applicationTrace: string[];

                /** DebugInfo frameworkTrace. */
                public frameworkTrace: string[];

                /**
                 * Creates a new DebugInfo instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DebugInfo instance
                 */
                public static create(properties?: xsuportal.proto.Error.IDebugInfo): xsuportal.proto.Error.DebugInfo;

                /**
                 * Encodes the specified DebugInfo message. Does not implicitly {@link xsuportal.proto.Error.DebugInfo.verify|verify} messages.
                 * @param message DebugInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.Error.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DebugInfo message, length delimited. Does not implicitly {@link xsuportal.proto.Error.DebugInfo.verify|verify} messages.
                 * @param message DebugInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.Error.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DebugInfo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DebugInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.Error.DebugInfo;

                /**
                 * Decodes a DebugInfo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DebugInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.Error.DebugInfo;

                /**
                 * Verifies a DebugInfo message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DebugInfo message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DebugInfo
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.Error.DebugInfo;

                /**
                 * Creates a plain object from a DebugInfo message. Also converts values to other types if specified.
                 * @param message DebugInfo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.Error.DebugInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DebugInfo to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Namespace resources. */
        namespace resources {

            /** Properties of a BenchmarkJob. */
            interface IBenchmarkJob {

                /** BenchmarkJob id */
                id?: (number|Long|null);

                /** BenchmarkJob teamId */
                teamId?: (number|Long|null);

                /** BenchmarkJob targetId */
                targetId?: (number|Long|null);

                /** BenchmarkJob status */
                status?: (xsuportal.proto.resources.BenchmarkJob.Status|null);

                /** BenchmarkJob createdAt */
                createdAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob updatedAt */
                updatedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob startedAt */
                startedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob finishedAt */
                finishedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob score */
                score?: (number|Long|null);

                /** BenchmarkJob instanceName */
                instanceName?: (string|null);

                /** BenchmarkJob team */
                team?: (xsuportal.proto.resources.ITeam|null);

                /** BenchmarkJob target */
                target?: (xsuportal.proto.resources.IContestantInstance|null);

                /** BenchmarkJob result */
                result?: (xsuportal.proto.resources.IBenchmarkResult|null);
            }

            /** Represents a BenchmarkJob. */
            class BenchmarkJob implements IBenchmarkJob {

                /**
                 * Constructs a new BenchmarkJob.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IBenchmarkJob);

                /** BenchmarkJob id. */
                public id: (number|Long);

                /** BenchmarkJob teamId. */
                public teamId: (number|Long);

                /** BenchmarkJob targetId. */
                public targetId: (number|Long);

                /** BenchmarkJob status. */
                public status: xsuportal.proto.resources.BenchmarkJob.Status;

                /** BenchmarkJob createdAt. */
                public createdAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob updatedAt. */
                public updatedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob startedAt. */
                public startedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob finishedAt. */
                public finishedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob score. */
                public score: (number|Long);

                /** BenchmarkJob instanceName. */
                public instanceName: string;

                /** BenchmarkJob team. */
                public team?: (xsuportal.proto.resources.ITeam|null);

                /** BenchmarkJob target. */
                public target?: (xsuportal.proto.resources.IContestantInstance|null);

                /** BenchmarkJob result. */
                public result?: (xsuportal.proto.resources.IBenchmarkResult|null);

                /**
                 * Creates a new BenchmarkJob instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BenchmarkJob instance
                 */
                public static create(properties?: xsuportal.proto.resources.IBenchmarkJob): xsuportal.proto.resources.BenchmarkJob;

                /**
                 * Encodes the specified BenchmarkJob message. Does not implicitly {@link xsuportal.proto.resources.BenchmarkJob.verify|verify} messages.
                 * @param message BenchmarkJob message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IBenchmarkJob, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BenchmarkJob message, length delimited. Does not implicitly {@link xsuportal.proto.resources.BenchmarkJob.verify|verify} messages.
                 * @param message BenchmarkJob message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IBenchmarkJob, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BenchmarkJob message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BenchmarkJob
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.BenchmarkJob;

                /**
                 * Decodes a BenchmarkJob message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BenchmarkJob
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.BenchmarkJob;

                /**
                 * Verifies a BenchmarkJob message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BenchmarkJob message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BenchmarkJob
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.BenchmarkJob;

                /**
                 * Creates a plain object from a BenchmarkJob message. Also converts values to other types if specified.
                 * @param message BenchmarkJob
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.BenchmarkJob, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BenchmarkJob to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace BenchmarkJob {

                /** Status enum. */
                enum Status {
                    PENDING = 0,
                    RUNNING = 1,
                    ERRORED = 2,
                    CANCELLED = 3,
                    FINISHED = 4
                }
            }

            /** Properties of a BenchmarkResult. */
            interface IBenchmarkResult {

                /** BenchmarkResult finished */
                finished?: (boolean|null);

                /** BenchmarkResult passed */
                passed?: (boolean|null);

                /** BenchmarkResult score */
                score?: (number|Long|null);

                /** BenchmarkResult scoreBreakdown */
                scoreBreakdown?: (xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown|null);

                /** BenchmarkResult reason */
                reason?: (string|null);

                /** BenchmarkResult stdout */
                stdout?: (string|null);

                /** BenchmarkResult stderr */
                stderr?: (string|null);

                /** BenchmarkResult survey */
                survey?: (xsuportal.proto.resources.BenchmarkResult.ISurvey|null);
            }

            /** Represents a BenchmarkResult. */
            class BenchmarkResult implements IBenchmarkResult {

                /**
                 * Constructs a new BenchmarkResult.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IBenchmarkResult);

                /** BenchmarkResult finished. */
                public finished: boolean;

                /** BenchmarkResult passed. */
                public passed: boolean;

                /** BenchmarkResult score. */
                public score: (number|Long);

                /** BenchmarkResult scoreBreakdown. */
                public scoreBreakdown?: (xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown|null);

                /** BenchmarkResult reason. */
                public reason: string;

                /** BenchmarkResult stdout. */
                public stdout: string;

                /** BenchmarkResult stderr. */
                public stderr: string;

                /** BenchmarkResult survey. */
                public survey?: (xsuportal.proto.resources.BenchmarkResult.ISurvey|null);

                /**
                 * Creates a new BenchmarkResult instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BenchmarkResult instance
                 */
                public static create(properties?: xsuportal.proto.resources.IBenchmarkResult): xsuportal.proto.resources.BenchmarkResult;

                /**
                 * Encodes the specified BenchmarkResult message. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.verify|verify} messages.
                 * @param message BenchmarkResult message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IBenchmarkResult, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BenchmarkResult message, length delimited. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.verify|verify} messages.
                 * @param message BenchmarkResult message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IBenchmarkResult, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BenchmarkResult message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BenchmarkResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.BenchmarkResult;

                /**
                 * Decodes a BenchmarkResult message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BenchmarkResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.BenchmarkResult;

                /**
                 * Verifies a BenchmarkResult message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BenchmarkResult message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BenchmarkResult
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.BenchmarkResult;

                /**
                 * Creates a plain object from a BenchmarkResult message. Also converts values to other types if specified.
                 * @param message BenchmarkResult
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.BenchmarkResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BenchmarkResult to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace BenchmarkResult {

                /** Properties of a ScoreBreakdown. */
                interface IScoreBreakdown {

                    /** ScoreBreakdown base */
                    base?: (number|Long|null);

                    /** ScoreBreakdown deduction */
                    deduction?: (number|Long|null);
                }

                /** Represents a ScoreBreakdown. */
                class ScoreBreakdown implements IScoreBreakdown {

                    /**
                     * Constructs a new ScoreBreakdown.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown);

                    /** ScoreBreakdown base. */
                    public base: (number|Long);

                    /** ScoreBreakdown deduction. */
                    public deduction: (number|Long);

                    /**
                     * Creates a new ScoreBreakdown instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ScoreBreakdown instance
                     */
                    public static create(properties?: xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown): xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Encodes the specified ScoreBreakdown message. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown.verify|verify} messages.
                     * @param message ScoreBreakdown message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ScoreBreakdown message, length delimited. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown.verify|verify} messages.
                     * @param message ScoreBreakdown message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.BenchmarkResult.IScoreBreakdown, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ScoreBreakdown message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ScoreBreakdown
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Decodes a ScoreBreakdown message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ScoreBreakdown
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Verifies a ScoreBreakdown message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ScoreBreakdown message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ScoreBreakdown
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Creates a plain object from a ScoreBreakdown message. Also converts values to other types if specified.
                     * @param message ScoreBreakdown
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.BenchmarkResult.ScoreBreakdown, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ScoreBreakdown to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a Survey. */
                interface ISurvey {

                    /** Survey language */
                    language?: (string|null);
                }

                /** Represents a Survey. */
                class Survey implements ISurvey {

                    /**
                     * Constructs a new Survey.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.BenchmarkResult.ISurvey);

                    /** Survey language. */
                    public language: string;

                    /**
                     * Creates a new Survey instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Survey instance
                     */
                    public static create(properties?: xsuportal.proto.resources.BenchmarkResult.ISurvey): xsuportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Encodes the specified Survey message. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.Survey.verify|verify} messages.
                     * @param message Survey message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.BenchmarkResult.ISurvey, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Survey message, length delimited. Does not implicitly {@link xsuportal.proto.resources.BenchmarkResult.Survey.verify|verify} messages.
                     * @param message Survey message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.BenchmarkResult.ISurvey, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Survey message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Survey
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Decodes a Survey message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Survey
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Verifies a Survey message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Survey message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Survey
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Creates a plain object from a Survey message. Also converts values to other types if specified.
                     * @param message Survey
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.BenchmarkResult.Survey, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Survey to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a ContestantInstance. */
            interface IContestantInstance {

                /** ContestantInstance cloudId */
                cloudId?: (string|null);

                /** ContestantInstance teamId */
                teamId?: (number|Long|null);

                /** ContestantInstance number */
                number?: (number|Long|null);

                /** ContestantInstance publicIpv4Address */
                publicIpv4Address?: (string|null);

                /** ContestantInstance privateIpv4Address */
                privateIpv4Address?: (string|null);

                /** ContestantInstance status */
                status?: (xsuportal.proto.resources.ContestantInstance.Status|null);

                /** ContestantInstance team */
                team?: (xsuportal.proto.resources.ITeam|null);
            }

            /** Represents a ContestantInstance. */
            class ContestantInstance implements IContestantInstance {

                /**
                 * Constructs a new ContestantInstance.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IContestantInstance);

                /** ContestantInstance cloudId. */
                public cloudId: string;

                /** ContestantInstance teamId. */
                public teamId: (number|Long);

                /** ContestantInstance number. */
                public number: (number|Long);

                /** ContestantInstance publicIpv4Address. */
                public publicIpv4Address: string;

                /** ContestantInstance privateIpv4Address. */
                public privateIpv4Address: string;

                /** ContestantInstance status. */
                public status: xsuportal.proto.resources.ContestantInstance.Status;

                /** ContestantInstance team. */
                public team?: (xsuportal.proto.resources.ITeam|null);

                /**
                 * Creates a new ContestantInstance instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ContestantInstance instance
                 */
                public static create(properties?: xsuportal.proto.resources.IContestantInstance): xsuportal.proto.resources.ContestantInstance;

                /**
                 * Encodes the specified ContestantInstance message. Does not implicitly {@link xsuportal.proto.resources.ContestantInstance.verify|verify} messages.
                 * @param message ContestantInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IContestantInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ContestantInstance message, length delimited. Does not implicitly {@link xsuportal.proto.resources.ContestantInstance.verify|verify} messages.
                 * @param message ContestantInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IContestantInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ContestantInstance message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ContestantInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.ContestantInstance;

                /**
                 * Decodes a ContestantInstance message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ContestantInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.ContestantInstance;

                /**
                 * Verifies a ContestantInstance message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ContestantInstance message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ContestantInstance
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.ContestantInstance;

                /**
                 * Creates a plain object from a ContestantInstance message. Also converts values to other types if specified.
                 * @param message ContestantInstance
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.ContestantInstance, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ContestantInstance to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ContestantInstance {

                /** Status enum. */
                enum Status {
                    UNKNOWN = 0,
                    PENDING = 1,
                    MODIFYING = 2,
                    STOPPED = 3,
                    RUNNING = 4,
                    TERMINATED = 5
                }
            }

            /** Properties of a Team. */
            interface ITeam {

                /** Team id */
                id?: (number|Long|null);

                /** Team name */
                name?: (string|null);

                /** Team leaderId */
                leaderId?: (string|null);

                /** Team memberIds */
                memberIds?: (string[]|null);

                /** Team finalParticipation */
                finalParticipation?: (boolean|null);

                /** Team hidden */
                hidden?: (boolean|null);

                /** Team withdrawn */
                withdrawn?: (boolean|null);

                /** Team disqualified */
                disqualified?: (boolean|null);

                /** Team detail */
                detail?: (xsuportal.proto.resources.Team.ITeamDetail|null);

                /** Team leader */
                leader?: (xsuportal.proto.resources.IContestant|null);

                /** Team members */
                members?: (xsuportal.proto.resources.IContestant[]|null);
            }

            /** Represents a Team. */
            class Team implements ITeam {

                /**
                 * Constructs a new Team.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.ITeam);

                /** Team id. */
                public id: (number|Long);

                /** Team name. */
                public name: string;

                /** Team leaderId. */
                public leaderId: string;

                /** Team memberIds. */
                public memberIds: string[];

                /** Team finalParticipation. */
                public finalParticipation: boolean;

                /** Team hidden. */
                public hidden: boolean;

                /** Team withdrawn. */
                public withdrawn: boolean;

                /** Team disqualified. */
                public disqualified: boolean;

                /** Team detail. */
                public detail?: (xsuportal.proto.resources.Team.ITeamDetail|null);

                /** Team leader. */
                public leader?: (xsuportal.proto.resources.IContestant|null);

                /** Team members. */
                public members: xsuportal.proto.resources.IContestant[];

                /**
                 * Creates a new Team instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Team instance
                 */
                public static create(properties?: xsuportal.proto.resources.ITeam): xsuportal.proto.resources.Team;

                /**
                 * Encodes the specified Team message. Does not implicitly {@link xsuportal.proto.resources.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Team message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Team message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Team;

                /**
                 * Decodes a Team message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Team;

                /**
                 * Verifies a Team message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Team message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Team
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Team;

                /**
                 * Creates a plain object from a Team message. Also converts values to other types if specified.
                 * @param message Team
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Team, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Team to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Team {

                /** Properties of a TeamDetail. */
                interface ITeamDetail {

                    /** TeamDetail emailAddress */
                    emailAddress?: (string|null);

                    /** TeamDetail inviteToken */
                    inviteToken?: (string|null);
                }

                /** Represents a TeamDetail. */
                class TeamDetail implements ITeamDetail {

                    /**
                     * Constructs a new TeamDetail.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.Team.ITeamDetail);

                    /** TeamDetail emailAddress. */
                    public emailAddress: string;

                    /** TeamDetail inviteToken. */
                    public inviteToken: string;

                    /**
                     * Creates a new TeamDetail instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TeamDetail instance
                     */
                    public static create(properties?: xsuportal.proto.resources.Team.ITeamDetail): xsuportal.proto.resources.Team.TeamDetail;

                    /**
                     * Encodes the specified TeamDetail message. Does not implicitly {@link xsuportal.proto.resources.Team.TeamDetail.verify|verify} messages.
                     * @param message TeamDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.Team.ITeamDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TeamDetail message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Team.TeamDetail.verify|verify} messages.
                     * @param message TeamDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.Team.ITeamDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TeamDetail message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TeamDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Team.TeamDetail;

                    /**
                     * Decodes a TeamDetail message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TeamDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Team.TeamDetail;

                    /**
                     * Verifies a TeamDetail message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TeamDetail message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TeamDetail
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Team.TeamDetail;

                    /**
                     * Creates a plain object from a TeamDetail message. Also converts values to other types if specified.
                     * @param message TeamDetail
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.Team.TeamDetail, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TeamDetail to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a Contestant. */
            interface IContestant {

                /** Contestant id */
                id?: (string|null);

                /** Contestant teamId */
                teamId?: (number|Long|null);

                /** Contestant name */
                name?: (string|null);

                /** Contestant isStudent */
                isStudent?: (boolean|null);
            }

            /** Represents a Contestant. */
            class Contestant implements IContestant {

                /**
                 * Constructs a new Contestant.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IContestant);

                /** Contestant id. */
                public id: string;

                /** Contestant teamId. */
                public teamId: (number|Long);

                /** Contestant name. */
                public name: string;

                /** Contestant isStudent. */
                public isStudent: boolean;

                /**
                 * Creates a new Contestant instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Contestant instance
                 */
                public static create(properties?: xsuportal.proto.resources.IContestant): xsuportal.proto.resources.Contestant;

                /**
                 * Encodes the specified Contestant message. Does not implicitly {@link xsuportal.proto.resources.Contestant.verify|verify} messages.
                 * @param message Contestant message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IContestant, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Contestant message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Contestant.verify|verify} messages.
                 * @param message Contestant message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IContestant, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Contestant message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Contestant
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Contestant;

                /**
                 * Decodes a Contestant message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Contestant
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Contestant;

                /**
                 * Verifies a Contestant message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Contestant message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Contestant
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Contestant;

                /**
                 * Creates a plain object from a Contestant message. Also converts values to other types if specified.
                 * @param message Contestant
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Contestant, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Contestant to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Clarification. */
            interface IClarification {

                /** Clarification id */
                id?: (number|Long|null);

                /** Clarification teamId */
                teamId?: (number|Long|null);

                /** Clarification answered */
                answered?: (boolean|null);

                /** Clarification disclosed */
                disclosed?: (boolean|null);

                /** Clarification question */
                question?: (string|null);

                /** Clarification answer */
                answer?: (string|null);

                /** Clarification createdAt */
                createdAt?: (google.protobuf.ITimestamp|null);

                /** Clarification answeredAt */
                answeredAt?: (google.protobuf.ITimestamp|null);

                /** Clarification originalQuestion */
                originalQuestion?: (string|null);

                /** Clarification team */
                team?: (xsuportal.proto.resources.ITeam|null);
            }

            /** Represents a Clarification. */
            class Clarification implements IClarification {

                /**
                 * Constructs a new Clarification.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IClarification);

                /** Clarification id. */
                public id: (number|Long);

                /** Clarification teamId. */
                public teamId: (number|Long);

                /** Clarification answered. */
                public answered: boolean;

                /** Clarification disclosed. */
                public disclosed: boolean;

                /** Clarification question. */
                public question: string;

                /** Clarification answer. */
                public answer: string;

                /** Clarification createdAt. */
                public createdAt?: (google.protobuf.ITimestamp|null);

                /** Clarification answeredAt. */
                public answeredAt?: (google.protobuf.ITimestamp|null);

                /** Clarification originalQuestion. */
                public originalQuestion: string;

                /** Clarification team. */
                public team?: (xsuportal.proto.resources.ITeam|null);

                /**
                 * Creates a new Clarification instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Clarification instance
                 */
                public static create(properties?: xsuportal.proto.resources.IClarification): xsuportal.proto.resources.Clarification;

                /**
                 * Encodes the specified Clarification message. Does not implicitly {@link xsuportal.proto.resources.Clarification.verify|verify} messages.
                 * @param message Clarification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IClarification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Clarification message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Clarification.verify|verify} messages.
                 * @param message Clarification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IClarification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Clarification message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Clarification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Clarification;

                /**
                 * Decodes a Clarification message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Clarification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Clarification;

                /**
                 * Verifies a Clarification message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Clarification message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Clarification
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Clarification;

                /**
                 * Creates a plain object from a Clarification message. Also converts values to other types if specified.
                 * @param message Clarification
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Clarification, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Clarification to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Leaderboard. */
            interface ILeaderboard {

                /** Leaderboard teams */
                teams?: (xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]|null);

                /** Leaderboard generalTeams */
                generalTeams?: (xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]|null);

                /** Leaderboard studentTeams */
                studentTeams?: (xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]|null);

                /** Leaderboard progresses */
                progresses?: (xsuportal.proto.resources.Leaderboard.ILeaderboardItem[]|null);

                /** Leaderboard frozen */
                frozen?: (boolean|null);
            }

            /** Represents a Leaderboard. */
            class Leaderboard implements ILeaderboard {

                /**
                 * Constructs a new Leaderboard.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.ILeaderboard);

                /** Leaderboard teams. */
                public teams: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[];

                /** Leaderboard generalTeams. */
                public generalTeams: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[];

                /** Leaderboard studentTeams. */
                public studentTeams: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[];

                /** Leaderboard progresses. */
                public progresses: xsuportal.proto.resources.Leaderboard.ILeaderboardItem[];

                /** Leaderboard frozen. */
                public frozen: boolean;

                /**
                 * Creates a new Leaderboard instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Leaderboard instance
                 */
                public static create(properties?: xsuportal.proto.resources.ILeaderboard): xsuportal.proto.resources.Leaderboard;

                /**
                 * Encodes the specified Leaderboard message. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.verify|verify} messages.
                 * @param message Leaderboard message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.ILeaderboard, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Leaderboard message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.verify|verify} messages.
                 * @param message Leaderboard message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.ILeaderboard, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Leaderboard message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Leaderboard
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Leaderboard;

                /**
                 * Decodes a Leaderboard message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Leaderboard
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Leaderboard;

                /**
                 * Verifies a Leaderboard message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Leaderboard message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Leaderboard
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Leaderboard;

                /**
                 * Creates a plain object from a Leaderboard message. Also converts values to other types if specified.
                 * @param message Leaderboard
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Leaderboard, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Leaderboard to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Leaderboard {

                /** Properties of a LeaderboardItem. */
                interface ILeaderboardItem {

                    /** LeaderboardItem scores */
                    scores?: (xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore[]|null);

                    /** LeaderboardItem team */
                    team?: (xsuportal.proto.resources.ITeam|null);
                }

                /** Represents a LeaderboardItem. */
                class LeaderboardItem implements ILeaderboardItem {

                    /**
                     * Constructs a new LeaderboardItem.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.resources.Leaderboard.ILeaderboardItem);

                    /** LeaderboardItem scores. */
                    public scores: xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore[];

                    /** LeaderboardItem team. */
                    public team?: (xsuportal.proto.resources.ITeam|null);

                    /**
                     * Creates a new LeaderboardItem instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LeaderboardItem instance
                     */
                    public static create(properties?: xsuportal.proto.resources.Leaderboard.ILeaderboardItem): xsuportal.proto.resources.Leaderboard.LeaderboardItem;

                    /**
                     * Encodes the specified LeaderboardItem message. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.LeaderboardItem.verify|verify} messages.
                     * @param message LeaderboardItem message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.resources.Leaderboard.ILeaderboardItem, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LeaderboardItem message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.LeaderboardItem.verify|verify} messages.
                     * @param message LeaderboardItem message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.resources.Leaderboard.ILeaderboardItem, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LeaderboardItem message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LeaderboardItem
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Leaderboard.LeaderboardItem;

                    /**
                     * Decodes a LeaderboardItem message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LeaderboardItem
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Leaderboard.LeaderboardItem;

                    /**
                     * Verifies a LeaderboardItem message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LeaderboardItem message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LeaderboardItem
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Leaderboard.LeaderboardItem;

                    /**
                     * Creates a plain object from a LeaderboardItem message. Also converts values to other types if specified.
                     * @param message LeaderboardItem
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.resources.Leaderboard.LeaderboardItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LeaderboardItem to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace LeaderboardItem {

                    /** Properties of a LeaderboardScore. */
                    interface ILeaderboardScore {

                        /** LeaderboardScore score */
                        score?: (number|Long|null);

                        /** LeaderboardScore startedAt */
                        startedAt?: (google.protobuf.ITimestamp|null);

                        /** LeaderboardScore updatedAt */
                        updatedAt?: (google.protobuf.ITimestamp|null);
                    }

                    /** Represents a LeaderboardScore. */
                    class LeaderboardScore implements ILeaderboardScore {

                        /**
                         * Constructs a new LeaderboardScore.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore);

                        /** LeaderboardScore score. */
                        public score: (number|Long);

                        /** LeaderboardScore startedAt. */
                        public startedAt?: (google.protobuf.ITimestamp|null);

                        /** LeaderboardScore updatedAt. */
                        public updatedAt?: (google.protobuf.ITimestamp|null);

                        /**
                         * Creates a new LeaderboardScore instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns LeaderboardScore instance
                         */
                        public static create(properties?: xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore): xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore;

                        /**
                         * Encodes the specified LeaderboardScore message. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore.verify|verify} messages.
                         * @param message LeaderboardScore message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified LeaderboardScore message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore.verify|verify} messages.
                         * @param message LeaderboardScore message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: xsuportal.proto.resources.Leaderboard.LeaderboardItem.ILeaderboardScore, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a LeaderboardScore message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns LeaderboardScore
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore;

                        /**
                         * Decodes a LeaderboardScore message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns LeaderboardScore
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore;

                        /**
                         * Verifies a LeaderboardScore message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a LeaderboardScore message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns LeaderboardScore
                         */
                        public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore;

                        /**
                         * Creates a plain object from a LeaderboardScore message. Also converts values to other types if specified.
                         * @param message LeaderboardScore
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: xsuportal.proto.resources.Leaderboard.LeaderboardItem.LeaderboardScore, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this LeaderboardScore to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
                }
            }

            /** Properties of a Staff. */
            interface IStaff {

                /** Staff id */
                id?: (number|Long|null);

                /** Staff githubLogin */
                githubLogin?: (string|null);
            }

            /** Represents a Staff. */
            class Staff implements IStaff {

                /**
                 * Constructs a new Staff.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: xsuportal.proto.resources.IStaff);

                /** Staff id. */
                public id: (number|Long);

                /** Staff githubLogin. */
                public githubLogin: string;

                /**
                 * Creates a new Staff instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Staff instance
                 */
                public static create(properties?: xsuportal.proto.resources.IStaff): xsuportal.proto.resources.Staff;

                /**
                 * Encodes the specified Staff message. Does not implicitly {@link xsuportal.proto.resources.Staff.verify|verify} messages.
                 * @param message Staff message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: xsuportal.proto.resources.IStaff, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Staff message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Staff.verify|verify} messages.
                 * @param message Staff message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: xsuportal.proto.resources.IStaff, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Staff message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Staff
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.resources.Staff;

                /**
                 * Decodes a Staff message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Staff
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.resources.Staff;

                /**
                 * Verifies a Staff message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Staff message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Staff
                 */
                public static fromObject(object: { [k: string]: any }): xsuportal.proto.resources.Staff;

                /**
                 * Creates a plain object from a Staff message. Also converts values to other types if specified.
                 * @param message Staff
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: xsuportal.proto.resources.Staff, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Staff to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Namespace services. */
        namespace services {

            /** Namespace admin. */
            namespace admin {

                /** Properties of a ListBenchmarkJobsRequest. */
                interface IListBenchmarkJobsRequest {

                    /** ListBenchmarkJobsRequest teamId */
                    teamId?: (number|Long|null);

                    /** ListBenchmarkJobsRequest incompleteOnly */
                    incompleteOnly?: (boolean|null);
                }

                /** Represents a ListBenchmarkJobsRequest. */
                class ListBenchmarkJobsRequest implements IListBenchmarkJobsRequest {

                    /**
                     * Constructs a new ListBenchmarkJobsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListBenchmarkJobsRequest);

                    /** ListBenchmarkJobsRequest teamId. */
                    public teamId: (number|Long);

                    /** ListBenchmarkJobsRequest incompleteOnly. */
                    public incompleteOnly: boolean;

                    /**
                     * Creates a new ListBenchmarkJobsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListBenchmarkJobsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListBenchmarkJobsRequest): xsuportal.proto.services.admin.ListBenchmarkJobsRequest;

                    /**
                     * Encodes the specified ListBenchmarkJobsRequest message. Does not implicitly {@link xsuportal.proto.services.admin.ListBenchmarkJobsRequest.verify|verify} messages.
                     * @param message ListBenchmarkJobsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListBenchmarkJobsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListBenchmarkJobsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListBenchmarkJobsRequest.verify|verify} messages.
                     * @param message ListBenchmarkJobsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListBenchmarkJobsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListBenchmarkJobsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListBenchmarkJobsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListBenchmarkJobsRequest;

                    /**
                     * Decodes a ListBenchmarkJobsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListBenchmarkJobsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListBenchmarkJobsRequest;

                    /**
                     * Verifies a ListBenchmarkJobsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListBenchmarkJobsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListBenchmarkJobsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListBenchmarkJobsRequest;

                    /**
                     * Creates a plain object from a ListBenchmarkJobsRequest message. Also converts values to other types if specified.
                     * @param message ListBenchmarkJobsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListBenchmarkJobsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListBenchmarkJobsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListBenchmarkJobsResponse. */
                interface IListBenchmarkJobsResponse {

                    /** ListBenchmarkJobsResponse jobs */
                    jobs?: (xsuportal.proto.resources.IBenchmarkJob[]|null);
                }

                /** Represents a ListBenchmarkJobsResponse. */
                class ListBenchmarkJobsResponse implements IListBenchmarkJobsResponse {

                    /**
                     * Constructs a new ListBenchmarkJobsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListBenchmarkJobsResponse);

                    /** ListBenchmarkJobsResponse jobs. */
                    public jobs: xsuportal.proto.resources.IBenchmarkJob[];

                    /**
                     * Creates a new ListBenchmarkJobsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListBenchmarkJobsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListBenchmarkJobsResponse): xsuportal.proto.services.admin.ListBenchmarkJobsResponse;

                    /**
                     * Encodes the specified ListBenchmarkJobsResponse message. Does not implicitly {@link xsuportal.proto.services.admin.ListBenchmarkJobsResponse.verify|verify} messages.
                     * @param message ListBenchmarkJobsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListBenchmarkJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListBenchmarkJobsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListBenchmarkJobsResponse.verify|verify} messages.
                     * @param message ListBenchmarkJobsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListBenchmarkJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListBenchmarkJobsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListBenchmarkJobsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListBenchmarkJobsResponse;

                    /**
                     * Decodes a ListBenchmarkJobsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListBenchmarkJobsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListBenchmarkJobsResponse;

                    /**
                     * Verifies a ListBenchmarkJobsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListBenchmarkJobsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListBenchmarkJobsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListBenchmarkJobsResponse;

                    /**
                     * Creates a plain object from a ListBenchmarkJobsResponse message. Also converts values to other types if specified.
                     * @param message ListBenchmarkJobsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListBenchmarkJobsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListBenchmarkJobsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an EnqueueBenchmarkJobRequest. */
                interface IEnqueueBenchmarkJobRequest {

                    /** EnqueueBenchmarkJobRequest teamId */
                    teamId?: (number|Long|null);

                    /** EnqueueBenchmarkJobRequest targetId */
                    targetId?: (number|Long|null);
                }

                /** Represents an EnqueueBenchmarkJobRequest. */
                class EnqueueBenchmarkJobRequest implements IEnqueueBenchmarkJobRequest {

                    /**
                     * Constructs a new EnqueueBenchmarkJobRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IEnqueueBenchmarkJobRequest);

                    /** EnqueueBenchmarkJobRequest teamId. */
                    public teamId: (number|Long);

                    /** EnqueueBenchmarkJobRequest targetId. */
                    public targetId: (number|Long);

                    /**
                     * Creates a new EnqueueBenchmarkJobRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EnqueueBenchmarkJobRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IEnqueueBenchmarkJobRequest): xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobRequest message. Does not implicitly {@link xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IEnqueueBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IEnqueueBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EnqueueBenchmarkJobRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EnqueueBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest;

                    /**
                     * Decodes an EnqueueBenchmarkJobRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EnqueueBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest;

                    /**
                     * Verifies an EnqueueBenchmarkJobRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EnqueueBenchmarkJobRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EnqueueBenchmarkJobRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest;

                    /**
                     * Creates a plain object from an EnqueueBenchmarkJobRequest message. Also converts values to other types if specified.
                     * @param message EnqueueBenchmarkJobRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.EnqueueBenchmarkJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EnqueueBenchmarkJobRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an EnqueueBenchmarkJobResponse. */
                interface IEnqueueBenchmarkJobResponse {

                    /** EnqueueBenchmarkJobResponse job */
                    job?: (xsuportal.proto.resources.IBenchmarkJob|null);
                }

                /** Represents an EnqueueBenchmarkJobResponse. */
                class EnqueueBenchmarkJobResponse implements IEnqueueBenchmarkJobResponse {

                    /**
                     * Constructs a new EnqueueBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IEnqueueBenchmarkJobResponse);

                    /** EnqueueBenchmarkJobResponse job. */
                    public job?: (xsuportal.proto.resources.IBenchmarkJob|null);

                    /**
                     * Creates a new EnqueueBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EnqueueBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IEnqueueBenchmarkJobResponse): xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IEnqueueBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IEnqueueBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EnqueueBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EnqueueBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse;

                    /**
                     * Decodes an EnqueueBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EnqueueBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse;

                    /**
                     * Verifies an EnqueueBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EnqueueBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EnqueueBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse;

                    /**
                     * Creates a plain object from an EnqueueBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message EnqueueBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.EnqueueBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EnqueueBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a CancelBenchmarkJobRequest. */
                interface ICancelBenchmarkJobRequest {

                    /** CancelBenchmarkJobRequest id */
                    id?: (number|Long|null);
                }

                /** Represents a CancelBenchmarkJobRequest. */
                class CancelBenchmarkJobRequest implements ICancelBenchmarkJobRequest {

                    /**
                     * Constructs a new CancelBenchmarkJobRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.ICancelBenchmarkJobRequest);

                    /** CancelBenchmarkJobRequest id. */
                    public id: (number|Long);

                    /**
                     * Creates a new CancelBenchmarkJobRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CancelBenchmarkJobRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.ICancelBenchmarkJobRequest): xsuportal.proto.services.admin.CancelBenchmarkJobRequest;

                    /**
                     * Encodes the specified CancelBenchmarkJobRequest message. Does not implicitly {@link xsuportal.proto.services.admin.CancelBenchmarkJobRequest.verify|verify} messages.
                     * @param message CancelBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.ICancelBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CancelBenchmarkJobRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.CancelBenchmarkJobRequest.verify|verify} messages.
                     * @param message CancelBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.ICancelBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CancelBenchmarkJobRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CancelBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.CancelBenchmarkJobRequest;

                    /**
                     * Decodes a CancelBenchmarkJobRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CancelBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.CancelBenchmarkJobRequest;

                    /**
                     * Verifies a CancelBenchmarkJobRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CancelBenchmarkJobRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CancelBenchmarkJobRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.CancelBenchmarkJobRequest;

                    /**
                     * Creates a plain object from a CancelBenchmarkJobRequest message. Also converts values to other types if specified.
                     * @param message CancelBenchmarkJobRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.CancelBenchmarkJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CancelBenchmarkJobRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a CancelBenchmarkJobResponse. */
                interface ICancelBenchmarkJobResponse {

                    /** CancelBenchmarkJobResponse job */
                    job?: (xsuportal.proto.resources.IBenchmarkJob|null);
                }

                /** Represents a CancelBenchmarkJobResponse. */
                class CancelBenchmarkJobResponse implements ICancelBenchmarkJobResponse {

                    /**
                     * Constructs a new CancelBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.ICancelBenchmarkJobResponse);

                    /** CancelBenchmarkJobResponse job. */
                    public job?: (xsuportal.proto.resources.IBenchmarkJob|null);

                    /**
                     * Creates a new CancelBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CancelBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.ICancelBenchmarkJobResponse): xsuportal.proto.services.admin.CancelBenchmarkJobResponse;

                    /**
                     * Encodes the specified CancelBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.admin.CancelBenchmarkJobResponse.verify|verify} messages.
                     * @param message CancelBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.ICancelBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CancelBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.CancelBenchmarkJobResponse.verify|verify} messages.
                     * @param message CancelBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.ICancelBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CancelBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CancelBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.CancelBenchmarkJobResponse;

                    /**
                     * Decodes a CancelBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CancelBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.CancelBenchmarkJobResponse;

                    /**
                     * Verifies a CancelBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CancelBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CancelBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.CancelBenchmarkJobResponse;

                    /**
                     * Creates a plain object from a CancelBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message CancelBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.CancelBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CancelBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetBenchmarkJobQuery. */
                interface IGetBenchmarkJobQuery {

                    /** GetBenchmarkJobQuery id */
                    id?: (number|Long|null);
                }

                /** Represents a GetBenchmarkJobQuery. */
                class GetBenchmarkJobQuery implements IGetBenchmarkJobQuery {

                    /**
                     * Constructs a new GetBenchmarkJobQuery.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetBenchmarkJobQuery);

                    /** GetBenchmarkJobQuery id. */
                    public id: (number|Long);

                    /**
                     * Creates a new GetBenchmarkJobQuery instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetBenchmarkJobQuery instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetBenchmarkJobQuery): xsuportal.proto.services.admin.GetBenchmarkJobQuery;

                    /**
                     * Encodes the specified GetBenchmarkJobQuery message. Does not implicitly {@link xsuportal.proto.services.admin.GetBenchmarkJobQuery.verify|verify} messages.
                     * @param message GetBenchmarkJobQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetBenchmarkJobQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetBenchmarkJobQuery message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetBenchmarkJobQuery.verify|verify} messages.
                     * @param message GetBenchmarkJobQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetBenchmarkJobQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetBenchmarkJobQuery message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetBenchmarkJobQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetBenchmarkJobQuery;

                    /**
                     * Decodes a GetBenchmarkJobQuery message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetBenchmarkJobQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetBenchmarkJobQuery;

                    /**
                     * Verifies a GetBenchmarkJobQuery message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetBenchmarkJobQuery message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetBenchmarkJobQuery
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetBenchmarkJobQuery;

                    /**
                     * Creates a plain object from a GetBenchmarkJobQuery message. Also converts values to other types if specified.
                     * @param message GetBenchmarkJobQuery
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetBenchmarkJobQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetBenchmarkJobQuery to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetBenchmarkJobResponse. */
                interface IGetBenchmarkJobResponse {

                    /** GetBenchmarkJobResponse job */
                    job?: (xsuportal.proto.resources.IBenchmarkJob|null);
                }

                /** Represents a GetBenchmarkJobResponse. */
                class GetBenchmarkJobResponse implements IGetBenchmarkJobResponse {

                    /**
                     * Constructs a new GetBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetBenchmarkJobResponse);

                    /** GetBenchmarkJobResponse job. */
                    public job?: (xsuportal.proto.resources.IBenchmarkJob|null);

                    /**
                     * Creates a new GetBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetBenchmarkJobResponse): xsuportal.proto.services.admin.GetBenchmarkJobResponse;

                    /**
                     * Encodes the specified GetBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.admin.GetBenchmarkJobResponse.verify|verify} messages.
                     * @param message GetBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetBenchmarkJobResponse.verify|verify} messages.
                     * @param message GetBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetBenchmarkJobResponse;

                    /**
                     * Decodes a GetBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetBenchmarkJobResponse;

                    /**
                     * Verifies a GetBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetBenchmarkJobResponse;

                    /**
                     * Creates a plain object from a GetBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message GetBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListClarificationsRequest. */
                interface IListClarificationsRequest {

                    /** ListClarificationsRequest teamId */
                    teamId?: (number|Long|null);
                }

                /** Represents a ListClarificationsRequest. */
                class ListClarificationsRequest implements IListClarificationsRequest {

                    /**
                     * Constructs a new ListClarificationsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListClarificationsRequest);

                    /** ListClarificationsRequest teamId. */
                    public teamId: (number|Long);

                    /**
                     * Creates a new ListClarificationsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListClarificationsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListClarificationsRequest): xsuportal.proto.services.admin.ListClarificationsRequest;

                    /**
                     * Encodes the specified ListClarificationsRequest message. Does not implicitly {@link xsuportal.proto.services.admin.ListClarificationsRequest.verify|verify} messages.
                     * @param message ListClarificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListClarificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListClarificationsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListClarificationsRequest.verify|verify} messages.
                     * @param message ListClarificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListClarificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListClarificationsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListClarificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListClarificationsRequest;

                    /**
                     * Decodes a ListClarificationsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListClarificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListClarificationsRequest;

                    /**
                     * Verifies a ListClarificationsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListClarificationsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListClarificationsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListClarificationsRequest;

                    /**
                     * Creates a plain object from a ListClarificationsRequest message. Also converts values to other types if specified.
                     * @param message ListClarificationsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListClarificationsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListClarificationsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListClarificationsResponse. */
                interface IListClarificationsResponse {

                    /** ListClarificationsResponse clarifications */
                    clarifications?: (xsuportal.proto.resources.IClarification[]|null);
                }

                /** Represents a ListClarificationsResponse. */
                class ListClarificationsResponse implements IListClarificationsResponse {

                    /**
                     * Constructs a new ListClarificationsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListClarificationsResponse);

                    /** ListClarificationsResponse clarifications. */
                    public clarifications: xsuportal.proto.resources.IClarification[];

                    /**
                     * Creates a new ListClarificationsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListClarificationsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListClarificationsResponse): xsuportal.proto.services.admin.ListClarificationsResponse;

                    /**
                     * Encodes the specified ListClarificationsResponse message. Does not implicitly {@link xsuportal.proto.services.admin.ListClarificationsResponse.verify|verify} messages.
                     * @param message ListClarificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListClarificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListClarificationsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListClarificationsResponse.verify|verify} messages.
                     * @param message ListClarificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListClarificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListClarificationsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListClarificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListClarificationsResponse;

                    /**
                     * Decodes a ListClarificationsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListClarificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListClarificationsResponse;

                    /**
                     * Verifies a ListClarificationsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListClarificationsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListClarificationsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListClarificationsResponse;

                    /**
                     * Creates a plain object from a ListClarificationsResponse message. Also converts values to other types if specified.
                     * @param message ListClarificationsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListClarificationsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListClarificationsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetClarificationRequest. */
                interface IGetClarificationRequest {

                    /** GetClarificationRequest id */
                    id?: (number|Long|null);
                }

                /** Represents a GetClarificationRequest. */
                class GetClarificationRequest implements IGetClarificationRequest {

                    /**
                     * Constructs a new GetClarificationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetClarificationRequest);

                    /** GetClarificationRequest id. */
                    public id: (number|Long);

                    /**
                     * Creates a new GetClarificationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetClarificationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetClarificationRequest): xsuportal.proto.services.admin.GetClarificationRequest;

                    /**
                     * Encodes the specified GetClarificationRequest message. Does not implicitly {@link xsuportal.proto.services.admin.GetClarificationRequest.verify|verify} messages.
                     * @param message GetClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetClarificationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetClarificationRequest.verify|verify} messages.
                     * @param message GetClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetClarificationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetClarificationRequest;

                    /**
                     * Decodes a GetClarificationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetClarificationRequest;

                    /**
                     * Verifies a GetClarificationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetClarificationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetClarificationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetClarificationRequest;

                    /**
                     * Creates a plain object from a GetClarificationRequest message. Also converts values to other types if specified.
                     * @param message GetClarificationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetClarificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetClarificationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetClarificationResponse. */
                interface IGetClarificationResponse {

                    /** GetClarificationResponse clarification */
                    clarification?: (xsuportal.proto.resources.IClarification|null);
                }

                /** Represents a GetClarificationResponse. */
                class GetClarificationResponse implements IGetClarificationResponse {

                    /**
                     * Constructs a new GetClarificationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetClarificationResponse);

                    /** GetClarificationResponse clarification. */
                    public clarification?: (xsuportal.proto.resources.IClarification|null);

                    /**
                     * Creates a new GetClarificationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetClarificationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetClarificationResponse): xsuportal.proto.services.admin.GetClarificationResponse;

                    /**
                     * Encodes the specified GetClarificationResponse message. Does not implicitly {@link xsuportal.proto.services.admin.GetClarificationResponse.verify|verify} messages.
                     * @param message GetClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetClarificationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetClarificationResponse.verify|verify} messages.
                     * @param message GetClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetClarificationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetClarificationResponse;

                    /**
                     * Decodes a GetClarificationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetClarificationResponse;

                    /**
                     * Verifies a GetClarificationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetClarificationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetClarificationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetClarificationResponse;

                    /**
                     * Creates a plain object from a GetClarificationResponse message. Also converts values to other types if specified.
                     * @param message GetClarificationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetClarificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetClarificationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a RespondClarificationRequest. */
                interface IRespondClarificationRequest {

                    /** RespondClarificationRequest id */
                    id?: (number|Long|null);

                    /** RespondClarificationRequest disclose */
                    disclose?: (boolean|null);

                    /** RespondClarificationRequest answer */
                    answer?: (string|null);

                    /** RespondClarificationRequest question */
                    question?: (string|null);
                }

                /** Represents a RespondClarificationRequest. */
                class RespondClarificationRequest implements IRespondClarificationRequest {

                    /**
                     * Constructs a new RespondClarificationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IRespondClarificationRequest);

                    /** RespondClarificationRequest id. */
                    public id: (number|Long);

                    /** RespondClarificationRequest disclose. */
                    public disclose: boolean;

                    /** RespondClarificationRequest answer. */
                    public answer: string;

                    /** RespondClarificationRequest question. */
                    public question: string;

                    /**
                     * Creates a new RespondClarificationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RespondClarificationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IRespondClarificationRequest): xsuportal.proto.services.admin.RespondClarificationRequest;

                    /**
                     * Encodes the specified RespondClarificationRequest message. Does not implicitly {@link xsuportal.proto.services.admin.RespondClarificationRequest.verify|verify} messages.
                     * @param message RespondClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IRespondClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RespondClarificationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.RespondClarificationRequest.verify|verify} messages.
                     * @param message RespondClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IRespondClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RespondClarificationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RespondClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.RespondClarificationRequest;

                    /**
                     * Decodes a RespondClarificationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RespondClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.RespondClarificationRequest;

                    /**
                     * Verifies a RespondClarificationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RespondClarificationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RespondClarificationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.RespondClarificationRequest;

                    /**
                     * Creates a plain object from a RespondClarificationRequest message. Also converts values to other types if specified.
                     * @param message RespondClarificationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.RespondClarificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RespondClarificationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a RespondClarificationResponse. */
                interface IRespondClarificationResponse {

                    /** RespondClarificationResponse clarification */
                    clarification?: (xsuportal.proto.resources.IClarification|null);
                }

                /** Represents a RespondClarificationResponse. */
                class RespondClarificationResponse implements IRespondClarificationResponse {

                    /**
                     * Constructs a new RespondClarificationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IRespondClarificationResponse);

                    /** RespondClarificationResponse clarification. */
                    public clarification?: (xsuportal.proto.resources.IClarification|null);

                    /**
                     * Creates a new RespondClarificationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RespondClarificationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IRespondClarificationResponse): xsuportal.proto.services.admin.RespondClarificationResponse;

                    /**
                     * Encodes the specified RespondClarificationResponse message. Does not implicitly {@link xsuportal.proto.services.admin.RespondClarificationResponse.verify|verify} messages.
                     * @param message RespondClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IRespondClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RespondClarificationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.RespondClarificationResponse.verify|verify} messages.
                     * @param message RespondClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IRespondClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RespondClarificationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RespondClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.RespondClarificationResponse;

                    /**
                     * Decodes a RespondClarificationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RespondClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.RespondClarificationResponse;

                    /**
                     * Verifies a RespondClarificationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RespondClarificationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RespondClarificationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.RespondClarificationResponse;

                    /**
                     * Creates a plain object from a RespondClarificationResponse message. Also converts values to other types if specified.
                     * @param message RespondClarificationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.RespondClarificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RespondClarificationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a CreateClarificationRequest. */
                interface ICreateClarificationRequest {

                    /** CreateClarificationRequest id */
                    id?: (number|Long|null);

                    /** CreateClarificationRequest answer */
                    answer?: (string|null);

                    /** CreateClarificationRequest question */
                    question?: (string|null);
                }

                /** Represents a CreateClarificationRequest. */
                class CreateClarificationRequest implements ICreateClarificationRequest {

                    /**
                     * Constructs a new CreateClarificationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.ICreateClarificationRequest);

                    /** CreateClarificationRequest id. */
                    public id: (number|Long);

                    /** CreateClarificationRequest answer. */
                    public answer: string;

                    /** CreateClarificationRequest question. */
                    public question: string;

                    /**
                     * Creates a new CreateClarificationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CreateClarificationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.ICreateClarificationRequest): xsuportal.proto.services.admin.CreateClarificationRequest;

                    /**
                     * Encodes the specified CreateClarificationRequest message. Does not implicitly {@link xsuportal.proto.services.admin.CreateClarificationRequest.verify|verify} messages.
                     * @param message CreateClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.ICreateClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateClarificationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.CreateClarificationRequest.verify|verify} messages.
                     * @param message CreateClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.ICreateClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateClarificationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.CreateClarificationRequest;

                    /**
                     * Decodes a CreateClarificationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.CreateClarificationRequest;

                    /**
                     * Verifies a CreateClarificationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CreateClarificationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CreateClarificationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.CreateClarificationRequest;

                    /**
                     * Creates a plain object from a CreateClarificationRequest message. Also converts values to other types if specified.
                     * @param message CreateClarificationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.CreateClarificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CreateClarificationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a CreateClarificationResponse. */
                interface ICreateClarificationResponse {

                    /** CreateClarificationResponse clarification */
                    clarification?: (xsuportal.proto.resources.IClarification|null);
                }

                /** Represents a CreateClarificationResponse. */
                class CreateClarificationResponse implements ICreateClarificationResponse {

                    /**
                     * Constructs a new CreateClarificationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.ICreateClarificationResponse);

                    /** CreateClarificationResponse clarification. */
                    public clarification?: (xsuportal.proto.resources.IClarification|null);

                    /**
                     * Creates a new CreateClarificationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CreateClarificationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.ICreateClarificationResponse): xsuportal.proto.services.admin.CreateClarificationResponse;

                    /**
                     * Encodes the specified CreateClarificationResponse message. Does not implicitly {@link xsuportal.proto.services.admin.CreateClarificationResponse.verify|verify} messages.
                     * @param message CreateClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.ICreateClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateClarificationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.CreateClarificationResponse.verify|verify} messages.
                     * @param message CreateClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.ICreateClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateClarificationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.CreateClarificationResponse;

                    /**
                     * Decodes a CreateClarificationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.CreateClarificationResponse;

                    /**
                     * Verifies a CreateClarificationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CreateClarificationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CreateClarificationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.CreateClarificationResponse;

                    /**
                     * Creates a plain object from a CreateClarificationResponse message. Also converts values to other types if specified.
                     * @param message CreateClarificationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.CreateClarificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CreateClarificationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListContestantInstancesRequest. */
                interface IListContestantInstancesRequest {

                    /** ListContestantInstancesRequest teamId */
                    teamId?: (number|Long|null);
                }

                /** Represents a ListContestantInstancesRequest. */
                class ListContestantInstancesRequest implements IListContestantInstancesRequest {

                    /**
                     * Constructs a new ListContestantInstancesRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListContestantInstancesRequest);

                    /** ListContestantInstancesRequest teamId. */
                    public teamId: (number|Long);

                    /**
                     * Creates a new ListContestantInstancesRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListContestantInstancesRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListContestantInstancesRequest): xsuportal.proto.services.admin.ListContestantInstancesRequest;

                    /**
                     * Encodes the specified ListContestantInstancesRequest message. Does not implicitly {@link xsuportal.proto.services.admin.ListContestantInstancesRequest.verify|verify} messages.
                     * @param message ListContestantInstancesRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListContestantInstancesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListContestantInstancesRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListContestantInstancesRequest.verify|verify} messages.
                     * @param message ListContestantInstancesRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListContestantInstancesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListContestantInstancesRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListContestantInstancesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListContestantInstancesRequest;

                    /**
                     * Decodes a ListContestantInstancesRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListContestantInstancesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListContestantInstancesRequest;

                    /**
                     * Verifies a ListContestantInstancesRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListContestantInstancesRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListContestantInstancesRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListContestantInstancesRequest;

                    /**
                     * Creates a plain object from a ListContestantInstancesRequest message. Also converts values to other types if specified.
                     * @param message ListContestantInstancesRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListContestantInstancesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListContestantInstancesRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListContestantInstancesResponse. */
                interface IListContestantInstancesResponse {

                    /** ListContestantInstancesResponse contestantInstances */
                    contestantInstances?: (xsuportal.proto.resources.IContestantInstance[]|null);
                }

                /** Represents a ListContestantInstancesResponse. */
                class ListContestantInstancesResponse implements IListContestantInstancesResponse {

                    /**
                     * Constructs a new ListContestantInstancesResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListContestantInstancesResponse);

                    /** ListContestantInstancesResponse contestantInstances. */
                    public contestantInstances: xsuportal.proto.resources.IContestantInstance[];

                    /**
                     * Creates a new ListContestantInstancesResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListContestantInstancesResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListContestantInstancesResponse): xsuportal.proto.services.admin.ListContestantInstancesResponse;

                    /**
                     * Encodes the specified ListContestantInstancesResponse message. Does not implicitly {@link xsuportal.proto.services.admin.ListContestantInstancesResponse.verify|verify} messages.
                     * @param message ListContestantInstancesResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListContestantInstancesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListContestantInstancesResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListContestantInstancesResponse.verify|verify} messages.
                     * @param message ListContestantInstancesResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListContestantInstancesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListContestantInstancesResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListContestantInstancesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListContestantInstancesResponse;

                    /**
                     * Decodes a ListContestantInstancesResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListContestantInstancesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListContestantInstancesResponse;

                    /**
                     * Verifies a ListContestantInstancesResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListContestantInstancesResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListContestantInstancesResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListContestantInstancesResponse;

                    /**
                     * Creates a plain object from a ListContestantInstancesResponse message. Also converts values to other types if specified.
                     * @param message ListContestantInstancesResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListContestantInstancesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListContestantInstancesResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DashboardRequest. */
                interface IDashboardRequest {
                }

                /** Represents a DashboardRequest. */
                class DashboardRequest implements IDashboardRequest {

                    /**
                     * Constructs a new DashboardRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IDashboardRequest);

                    /**
                     * Creates a new DashboardRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IDashboardRequest): xsuportal.proto.services.admin.DashboardRequest;

                    /**
                     * Encodes the specified DashboardRequest message. Does not implicitly {@link xsuportal.proto.services.admin.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.DashboardRequest;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.DashboardRequest;

                    /**
                     * Verifies a DashboardRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.DashboardRequest;

                    /**
                     * Creates a plain object from a DashboardRequest message. Also converts values to other types if specified.
                     * @param message DashboardRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.DashboardRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DashboardResponse. */
                interface IDashboardResponse {

                    /** DashboardResponse leaderboard */
                    leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);
                }

                /** Represents a DashboardResponse. */
                class DashboardResponse implements IDashboardResponse {

                    /**
                     * Constructs a new DashboardResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IDashboardResponse);

                    /** DashboardResponse leaderboard. */
                    public leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);

                    /**
                     * Creates a new DashboardResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IDashboardResponse): xsuportal.proto.services.admin.DashboardResponse;

                    /**
                     * Encodes the specified DashboardResponse message. Does not implicitly {@link xsuportal.proto.services.admin.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.DashboardResponse;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.DashboardResponse;

                    /**
                     * Verifies a DashboardResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.DashboardResponse;

                    /**
                     * Creates a plain object from a DashboardResponse message. Also converts values to other types if specified.
                     * @param message DashboardResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.DashboardResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an InitializeRequest. */
                interface IInitializeRequest {
                }

                /** Represents an InitializeRequest. */
                class InitializeRequest implements IInitializeRequest {

                    /**
                     * Constructs a new InitializeRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IInitializeRequest);

                    /**
                     * Creates a new InitializeRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InitializeRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IInitializeRequest): xsuportal.proto.services.admin.InitializeRequest;

                    /**
                     * Encodes the specified InitializeRequest message. Does not implicitly {@link xsuportal.proto.services.admin.InitializeRequest.verify|verify} messages.
                     * @param message InitializeRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IInitializeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InitializeRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.InitializeRequest.verify|verify} messages.
                     * @param message InitializeRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IInitializeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InitializeRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InitializeRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.InitializeRequest;

                    /**
                     * Decodes an InitializeRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InitializeRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.InitializeRequest;

                    /**
                     * Verifies an InitializeRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InitializeRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InitializeRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.InitializeRequest;

                    /**
                     * Creates a plain object from an InitializeRequest message. Also converts values to other types if specified.
                     * @param message InitializeRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.InitializeRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InitializeRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an InitializeResponse. */
                interface IInitializeResponse {

                    /** InitializeResponse language */
                    language?: (string|null);
                }

                /** Represents an InitializeResponse. */
                class InitializeResponse implements IInitializeResponse {

                    /**
                     * Constructs a new InitializeResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IInitializeResponse);

                    /** InitializeResponse language. */
                    public language: string;

                    /**
                     * Creates a new InitializeResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InitializeResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IInitializeResponse): xsuportal.proto.services.admin.InitializeResponse;

                    /**
                     * Encodes the specified InitializeResponse message. Does not implicitly {@link xsuportal.proto.services.admin.InitializeResponse.verify|verify} messages.
                     * @param message InitializeResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IInitializeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InitializeResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.InitializeResponse.verify|verify} messages.
                     * @param message InitializeResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IInitializeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InitializeResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InitializeResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.InitializeResponse;

                    /**
                     * Decodes an InitializeResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InitializeResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.InitializeResponse;

                    /**
                     * Verifies an InitializeResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InitializeResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InitializeResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.InitializeResponse;

                    /**
                     * Creates a plain object from an InitializeResponse message. Also converts values to other types if specified.
                     * @param message InitializeResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.InitializeResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InitializeResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListTeamsRequest. */
                interface IListTeamsRequest {
                }

                /** Represents a ListTeamsRequest. */
                class ListTeamsRequest implements IListTeamsRequest {

                    /**
                     * Constructs a new ListTeamsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListTeamsRequest);

                    /**
                     * Creates a new ListTeamsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListTeamsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListTeamsRequest): xsuportal.proto.services.admin.ListTeamsRequest;

                    /**
                     * Encodes the specified ListTeamsRequest message. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsRequest.verify|verify} messages.
                     * @param message ListTeamsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListTeamsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListTeamsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsRequest.verify|verify} messages.
                     * @param message ListTeamsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListTeamsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListTeamsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListTeamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListTeamsRequest;

                    /**
                     * Decodes a ListTeamsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListTeamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListTeamsRequest;

                    /**
                     * Verifies a ListTeamsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListTeamsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListTeamsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListTeamsRequest;

                    /**
                     * Creates a plain object from a ListTeamsRequest message. Also converts values to other types if specified.
                     * @param message ListTeamsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListTeamsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListTeamsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListTeamsResponse. */
                interface IListTeamsResponse {

                    /** ListTeamsResponse teams */
                    teams?: (xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem[]|null);
                }

                /** Represents a ListTeamsResponse. */
                class ListTeamsResponse implements IListTeamsResponse {

                    /**
                     * Constructs a new ListTeamsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IListTeamsResponse);

                    /** ListTeamsResponse teams. */
                    public teams: xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem[];

                    /**
                     * Creates a new ListTeamsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListTeamsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IListTeamsResponse): xsuportal.proto.services.admin.ListTeamsResponse;

                    /**
                     * Encodes the specified ListTeamsResponse message. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListTeamsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListTeamsResponse;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListTeamsResponse;

                    /**
                     * Verifies a ListTeamsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListTeamsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListTeamsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListTeamsResponse;

                    /**
                     * Creates a plain object from a ListTeamsResponse message. Also converts values to other types if specified.
                     * @param message ListTeamsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.ListTeamsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListTeamsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace ListTeamsResponse {

                    /** Properties of a TeamListItem. */
                    interface ITeamListItem {

                        /** TeamListItem teamId */
                        teamId?: (number|Long|null);

                        /** TeamListItem name */
                        name?: (string|null);

                        /** TeamListItem memberNames */
                        memberNames?: (string[]|null);

                        /** TeamListItem finalParticipation */
                        finalParticipation?: (boolean|null);

                        /** TeamListItem isStudent */
                        isStudent?: (boolean|null);

                        /** TeamListItem withdrawn */
                        withdrawn?: (boolean|null);

                        /** TeamListItem disqualified */
                        disqualified?: (boolean|null);
                    }

                    /** Represents a TeamListItem. */
                    class TeamListItem implements ITeamListItem {

                        /**
                         * Constructs a new TeamListItem.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem);

                        /** TeamListItem teamId. */
                        public teamId: (number|Long);

                        /** TeamListItem name. */
                        public name: string;

                        /** TeamListItem memberNames. */
                        public memberNames: string[];

                        /** TeamListItem finalParticipation. */
                        public finalParticipation: boolean;

                        /** TeamListItem isStudent. */
                        public isStudent: boolean;

                        /** TeamListItem withdrawn. */
                        public withdrawn: boolean;

                        /** TeamListItem disqualified. */
                        public disqualified: boolean;

                        /**
                         * Creates a new TeamListItem instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns TeamListItem instance
                         */
                        public static create(properties?: xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem): xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem;

                        /**
                         * Encodes the specified TeamListItem message. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified TeamListItem message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: xsuportal.proto.services.admin.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem;

                        /**
                         * Verifies a TeamListItem message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a TeamListItem message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns TeamListItem
                         */
                        public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem;

                        /**
                         * Creates a plain object from a TeamListItem message. Also converts values to other types if specified.
                         * @param message TeamListItem
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: xsuportal.proto.services.admin.ListTeamsResponse.TeamListItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this TeamListItem to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
                }

                /** Properties of a GetTeamRequest. */
                interface IGetTeamRequest {

                    /** GetTeamRequest id */
                    id?: (number|Long|null);
                }

                /** Represents a GetTeamRequest. */
                class GetTeamRequest implements IGetTeamRequest {

                    /**
                     * Constructs a new GetTeamRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetTeamRequest);

                    /** GetTeamRequest id. */
                    public id: (number|Long);

                    /**
                     * Creates a new GetTeamRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetTeamRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetTeamRequest): xsuportal.proto.services.admin.GetTeamRequest;

                    /**
                     * Encodes the specified GetTeamRequest message. Does not implicitly {@link xsuportal.proto.services.admin.GetTeamRequest.verify|verify} messages.
                     * @param message GetTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetTeamRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetTeamRequest.verify|verify} messages.
                     * @param message GetTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetTeamRequest;

                    /**
                     * Decodes a GetTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetTeamRequest;

                    /**
                     * Verifies a GetTeamRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetTeamRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetTeamRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetTeamRequest;

                    /**
                     * Creates a plain object from a GetTeamRequest message. Also converts values to other types if specified.
                     * @param message GetTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetTeamRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetTeamResponse. */
                interface IGetTeamResponse {

                    /** GetTeamResponse team */
                    team?: (xsuportal.proto.resources.ITeam|null);
                }

                /** Represents a GetTeamResponse. */
                class GetTeamResponse implements IGetTeamResponse {

                    /**
                     * Constructs a new GetTeamResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IGetTeamResponse);

                    /** GetTeamResponse team. */
                    public team?: (xsuportal.proto.resources.ITeam|null);

                    /**
                     * Creates a new GetTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetTeamResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IGetTeamResponse): xsuportal.proto.services.admin.GetTeamResponse;

                    /**
                     * Encodes the specified GetTeamResponse message. Does not implicitly {@link xsuportal.proto.services.admin.GetTeamResponse.verify|verify} messages.
                     * @param message GetTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IGetTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetTeamResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.GetTeamResponse.verify|verify} messages.
                     * @param message GetTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IGetTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.GetTeamResponse;

                    /**
                     * Decodes a GetTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.GetTeamResponse;

                    /**
                     * Verifies a GetTeamResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetTeamResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetTeamResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.GetTeamResponse;

                    /**
                     * Creates a plain object from a GetTeamResponse message. Also converts values to other types if specified.
                     * @param message GetTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.GetTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetTeamResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an UpdateTeamRequest. */
                interface IUpdateTeamRequest {

                    /** UpdateTeamRequest team */
                    team?: (xsuportal.proto.resources.ITeam|null);

                    /** UpdateTeamRequest contestants */
                    contestants?: (xsuportal.proto.resources.IContestant[]|null);
                }

                /** Represents an UpdateTeamRequest. */
                class UpdateTeamRequest implements IUpdateTeamRequest {

                    /**
                     * Constructs a new UpdateTeamRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IUpdateTeamRequest);

                    /** UpdateTeamRequest team. */
                    public team?: (xsuportal.proto.resources.ITeam|null);

                    /** UpdateTeamRequest contestants. */
                    public contestants: xsuportal.proto.resources.IContestant[];

                    /**
                     * Creates a new UpdateTeamRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpdateTeamRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IUpdateTeamRequest): xsuportal.proto.services.admin.UpdateTeamRequest;

                    /**
                     * Encodes the specified UpdateTeamRequest message. Does not implicitly {@link xsuportal.proto.services.admin.UpdateTeamRequest.verify|verify} messages.
                     * @param message UpdateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IUpdateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateTeamRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.UpdateTeamRequest.verify|verify} messages.
                     * @param message UpdateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IUpdateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.UpdateTeamRequest;

                    /**
                     * Decodes an UpdateTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.UpdateTeamRequest;

                    /**
                     * Verifies an UpdateTeamRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an UpdateTeamRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UpdateTeamRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.UpdateTeamRequest;

                    /**
                     * Creates a plain object from an UpdateTeamRequest message. Also converts values to other types if specified.
                     * @param message UpdateTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.UpdateTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UpdateTeamRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an UpdateTeamResponse. */
                interface IUpdateTeamResponse {
                }

                /** Represents an UpdateTeamResponse. */
                class UpdateTeamResponse implements IUpdateTeamResponse {

                    /**
                     * Constructs a new UpdateTeamResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.admin.IUpdateTeamResponse);

                    /**
                     * Creates a new UpdateTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpdateTeamResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.admin.IUpdateTeamResponse): xsuportal.proto.services.admin.UpdateTeamResponse;

                    /**
                     * Encodes the specified UpdateTeamResponse message. Does not implicitly {@link xsuportal.proto.services.admin.UpdateTeamResponse.verify|verify} messages.
                     * @param message UpdateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.admin.IUpdateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateTeamResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.admin.UpdateTeamResponse.verify|verify} messages.
                     * @param message UpdateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.admin.IUpdateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.admin.UpdateTeamResponse;

                    /**
                     * Decodes an UpdateTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.admin.UpdateTeamResponse;

                    /**
                     * Verifies an UpdateTeamResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an UpdateTeamResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UpdateTeamResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.admin.UpdateTeamResponse;

                    /**
                     * Creates a plain object from an UpdateTeamResponse message. Also converts values to other types if specified.
                     * @param message UpdateTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.admin.UpdateTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UpdateTeamResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace audience. */
            namespace audience {

                /** Properties of a DashboardRequest. */
                interface IDashboardRequest {
                }

                /** Represents a DashboardRequest. */
                class DashboardRequest implements IDashboardRequest {

                    /**
                     * Constructs a new DashboardRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.audience.IDashboardRequest);

                    /**
                     * Creates a new DashboardRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.audience.IDashboardRequest): xsuportal.proto.services.audience.DashboardRequest;

                    /**
                     * Encodes the specified DashboardRequest message. Does not implicitly {@link xsuportal.proto.services.audience.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.audience.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.audience.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.audience.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.audience.DashboardRequest;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.audience.DashboardRequest;

                    /**
                     * Verifies a DashboardRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.audience.DashboardRequest;

                    /**
                     * Creates a plain object from a DashboardRequest message. Also converts values to other types if specified.
                     * @param message DashboardRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.audience.DashboardRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DashboardResponse. */
                interface IDashboardResponse {

                    /** DashboardResponse leaderboard */
                    leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);
                }

                /** Represents a DashboardResponse. */
                class DashboardResponse implements IDashboardResponse {

                    /**
                     * Constructs a new DashboardResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.audience.IDashboardResponse);

                    /** DashboardResponse leaderboard. */
                    public leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);

                    /**
                     * Creates a new DashboardResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.audience.IDashboardResponse): xsuportal.proto.services.audience.DashboardResponse;

                    /**
                     * Encodes the specified DashboardResponse message. Does not implicitly {@link xsuportal.proto.services.audience.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.audience.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.audience.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.audience.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.audience.DashboardResponse;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.audience.DashboardResponse;

                    /**
                     * Verifies a DashboardResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.audience.DashboardResponse;

                    /**
                     * Creates a plain object from a DashboardResponse message. Also converts values to other types if specified.
                     * @param message DashboardResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.audience.DashboardResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListTeamsResponse. */
                interface IListTeamsResponse {

                    /** ListTeamsResponse teams */
                    teams?: (xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem[]|null);
                }

                /** Represents a ListTeamsResponse. */
                class ListTeamsResponse implements IListTeamsResponse {

                    /**
                     * Constructs a new ListTeamsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.audience.IListTeamsResponse);

                    /** ListTeamsResponse teams. */
                    public teams: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem[];

                    /**
                     * Creates a new ListTeamsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListTeamsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.audience.IListTeamsResponse): xsuportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Encodes the specified ListTeamsResponse message. Does not implicitly {@link xsuportal.proto.services.audience.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.audience.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListTeamsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.audience.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.audience.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Verifies a ListTeamsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListTeamsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListTeamsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Creates a plain object from a ListTeamsResponse message. Also converts values to other types if specified.
                     * @param message ListTeamsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.audience.ListTeamsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListTeamsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace ListTeamsResponse {

                    /** Properties of a TeamListItem. */
                    interface ITeamListItem {

                        /** TeamListItem teamId */
                        teamId?: (number|Long|null);

                        /** TeamListItem name */
                        name?: (string|null);

                        /** TeamListItem memberNames */
                        memberNames?: (string[]|null);

                        /** TeamListItem finalParticipation */
                        finalParticipation?: (boolean|null);

                        /** TeamListItem isStudent */
                        isStudent?: (boolean|null);
                    }

                    /** Represents a TeamListItem. */
                    class TeamListItem implements ITeamListItem {

                        /**
                         * Constructs a new TeamListItem.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem);

                        /** TeamListItem teamId. */
                        public teamId: (number|Long);

                        /** TeamListItem name. */
                        public name: string;

                        /** TeamListItem memberNames. */
                        public memberNames: string[];

                        /** TeamListItem finalParticipation. */
                        public finalParticipation: boolean;

                        /** TeamListItem isStudent. */
                        public isStudent: boolean;

                        /**
                         * Creates a new TeamListItem instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns TeamListItem instance
                         */
                        public static create(properties?: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem): xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Encodes the specified TeamListItem message. Does not implicitly {@link xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified TeamListItem message, length delimited. Does not implicitly {@link xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: xsuportal.proto.services.audience.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Verifies a TeamListItem message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a TeamListItem message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns TeamListItem
                         */
                        public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Creates a plain object from a TeamListItem message. Also converts values to other types if specified.
                         * @param message TeamListItem
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: xsuportal.proto.services.audience.ListTeamsResponse.TeamListItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this TeamListItem to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
                }
            }

            /** Namespace bench. */
            namespace bench {

                /** Represents a BenchmarkQueue */
                class BenchmarkQueue extends $protobuf.rpc.Service {

                    /**
                     * Constructs a new BenchmarkQueue service.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     */
                    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                    /**
                     * Creates new BenchmarkQueue service using the specified rpc implementation.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     * @returns RPC service. Useful where requests and/or responses are streamed.
                     */
                    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): BenchmarkQueue;

                    /**
                     * Calls ReceiveBenchmarkJob.
                     * @param request ReceiveBenchmarkJobRequest message or plain object
                     * @param callback Node-style callback called with the error, if any, and ReceiveBenchmarkJobResponse
                     */
                    public receiveBenchmarkJob(request: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest, callback: xsuportal.proto.services.bench.BenchmarkQueue.ReceiveBenchmarkJobCallback): void;

                    /**
                     * Calls ReceiveBenchmarkJob.
                     * @param request ReceiveBenchmarkJobRequest message or plain object
                     * @returns Promise
                     */
                    public receiveBenchmarkJob(request: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest): Promise<xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse>;
                }

                namespace BenchmarkQueue {

                    /**
                     * Callback as used by {@link xsuportal.proto.services.bench.BenchmarkQueue#receiveBenchmarkJob}.
                     * @param error Error, if any
                     * @param [response] ReceiveBenchmarkJobResponse
                     */
                    type ReceiveBenchmarkJobCallback = (error: (Error|null), response?: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse) => void;
                }

                /** Properties of a ReceiveBenchmarkJobRequest. */
                interface IReceiveBenchmarkJobRequest {

                    /** ReceiveBenchmarkJobRequest token */
                    token?: (string|null);

                    /** ReceiveBenchmarkJobRequest instanceName */
                    instanceName?: (string|null);

                    /** ReceiveBenchmarkJobRequest teamId */
                    teamId?: (number|Long|null);
                }

                /** Represents a ReceiveBenchmarkJobRequest. */
                class ReceiveBenchmarkJobRequest implements IReceiveBenchmarkJobRequest {

                    /**
                     * Constructs a new ReceiveBenchmarkJobRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest);

                    /** ReceiveBenchmarkJobRequest token. */
                    public token: string;

                    /** ReceiveBenchmarkJobRequest instanceName. */
                    public instanceName: string;

                    /** ReceiveBenchmarkJobRequest teamId. */
                    public teamId: (number|Long);

                    /**
                     * Creates a new ReceiveBenchmarkJobRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ReceiveBenchmarkJobRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest): xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest;

                    /**
                     * Encodes the specified ReceiveBenchmarkJobRequest message. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest.verify|verify} messages.
                     * @param message ReceiveBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ReceiveBenchmarkJobRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest.verify|verify} messages.
                     * @param message ReceiveBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.bench.IReceiveBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ReceiveBenchmarkJobRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ReceiveBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest;

                    /**
                     * Decodes a ReceiveBenchmarkJobRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ReceiveBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest;

                    /**
                     * Verifies a ReceiveBenchmarkJobRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ReceiveBenchmarkJobRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ReceiveBenchmarkJobRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest;

                    /**
                     * Creates a plain object from a ReceiveBenchmarkJobRequest message. Also converts values to other types if specified.
                     * @param message ReceiveBenchmarkJobRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.bench.ReceiveBenchmarkJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ReceiveBenchmarkJobRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ReceiveBenchmarkJobResponse. */
                interface IReceiveBenchmarkJobResponse {

                    /** ReceiveBenchmarkJobResponse jobHandle */
                    jobHandle?: (xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle|null);
                }

                /** Represents a ReceiveBenchmarkJobResponse. */
                class ReceiveBenchmarkJobResponse implements IReceiveBenchmarkJobResponse {

                    /**
                     * Constructs a new ReceiveBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.bench.IReceiveBenchmarkJobResponse);

                    /** ReceiveBenchmarkJobResponse jobHandle. */
                    public jobHandle?: (xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle|null);

                    /**
                     * Creates a new ReceiveBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ReceiveBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.bench.IReceiveBenchmarkJobResponse): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse;

                    /**
                     * Encodes the specified ReceiveBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.verify|verify} messages.
                     * @param message ReceiveBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.bench.IReceiveBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ReceiveBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.verify|verify} messages.
                     * @param message ReceiveBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.bench.IReceiveBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ReceiveBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ReceiveBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse;

                    /**
                     * Decodes a ReceiveBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ReceiveBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse;

                    /**
                     * Verifies a ReceiveBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ReceiveBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ReceiveBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse;

                    /**
                     * Creates a plain object from a ReceiveBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message ReceiveBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ReceiveBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace ReceiveBenchmarkJobResponse {

                    /** Properties of a JobHandle. */
                    interface IJobHandle {

                        /** JobHandle jobId */
                        jobId?: (number|Long|null);

                        /** JobHandle handle */
                        handle?: (string|null);

                        /** JobHandle targetIpv4Address */
                        targetIpv4Address?: (string|null);

                        /** JobHandle descriptionHuman */
                        descriptionHuman?: (string|null);
                    }

                    /** Represents a JobHandle. */
                    class JobHandle implements IJobHandle {

                        /**
                         * Constructs a new JobHandle.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle);

                        /** JobHandle jobId. */
                        public jobId: (number|Long);

                        /** JobHandle handle. */
                        public handle: string;

                        /** JobHandle targetIpv4Address. */
                        public targetIpv4Address: string;

                        /** JobHandle descriptionHuman. */
                        public descriptionHuman: string;

                        /**
                         * Creates a new JobHandle instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns JobHandle instance
                         */
                        public static create(properties?: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle;

                        /**
                         * Encodes the specified JobHandle message. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle.verify|verify} messages.
                         * @param message JobHandle message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified JobHandle message, length delimited. Does not implicitly {@link xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle.verify|verify} messages.
                         * @param message JobHandle message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.IJobHandle, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a JobHandle message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns JobHandle
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle;

                        /**
                         * Decodes a JobHandle message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns JobHandle
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle;

                        /**
                         * Verifies a JobHandle message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a JobHandle message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns JobHandle
                         */
                        public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle;

                        /**
                         * Creates a plain object from a JobHandle message. Also converts values to other types if specified.
                         * @param message JobHandle
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: xsuportal.proto.services.bench.ReceiveBenchmarkJobResponse.JobHandle, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this JobHandle to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
                }

                /** Represents a BenchmarkReport */
                class BenchmarkReport extends $protobuf.rpc.Service {

                    /**
                     * Constructs a new BenchmarkReport service.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     */
                    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                    /**
                     * Creates new BenchmarkReport service using the specified rpc implementation.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     * @returns RPC service. Useful where requests and/or responses are streamed.
                     */
                    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): BenchmarkReport;

                    /**
                     * Calls ReportBenchmarkResult.
                     * @param request ReportBenchmarkResultRequest message or plain object
                     * @param callback Node-style callback called with the error, if any, and ReportBenchmarkResultResponse
                     */
                    public reportBenchmarkResult(request: xsuportal.proto.services.bench.IReportBenchmarkResultRequest, callback: xsuportal.proto.services.bench.BenchmarkReport.ReportBenchmarkResultCallback): void;

                    /**
                     * Calls ReportBenchmarkResult.
                     * @param request ReportBenchmarkResultRequest message or plain object
                     * @returns Promise
                     */
                    public reportBenchmarkResult(request: xsuportal.proto.services.bench.IReportBenchmarkResultRequest): Promise<xsuportal.proto.services.bench.ReportBenchmarkResultResponse>;
                }

                namespace BenchmarkReport {

                    /**
                     * Callback as used by {@link xsuportal.proto.services.bench.BenchmarkReport#reportBenchmarkResult}.
                     * @param error Error, if any
                     * @param [response] ReportBenchmarkResultResponse
                     */
                    type ReportBenchmarkResultCallback = (error: (Error|null), response?: xsuportal.proto.services.bench.ReportBenchmarkResultResponse) => void;
                }

                /** Properties of a ReportBenchmarkResultRequest. */
                interface IReportBenchmarkResultRequest {

                    /** ReportBenchmarkResultRequest jobId */
                    jobId?: (number|Long|null);

                    /** ReportBenchmarkResultRequest handle */
                    handle?: (string|null);

                    /** ReportBenchmarkResultRequest nonce */
                    nonce?: (number|Long|null);

                    /** ReportBenchmarkResultRequest result */
                    result?: (xsuportal.proto.resources.IBenchmarkResult|null);
                }

                /** Represents a ReportBenchmarkResultRequest. */
                class ReportBenchmarkResultRequest implements IReportBenchmarkResultRequest {

                    /**
                     * Constructs a new ReportBenchmarkResultRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.bench.IReportBenchmarkResultRequest);

                    /** ReportBenchmarkResultRequest jobId. */
                    public jobId: (number|Long);

                    /** ReportBenchmarkResultRequest handle. */
                    public handle: string;

                    /** ReportBenchmarkResultRequest nonce. */
                    public nonce: (number|Long);

                    /** ReportBenchmarkResultRequest result. */
                    public result?: (xsuportal.proto.resources.IBenchmarkResult|null);

                    /**
                     * Creates a new ReportBenchmarkResultRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ReportBenchmarkResultRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.bench.IReportBenchmarkResultRequest): xsuportal.proto.services.bench.ReportBenchmarkResultRequest;

                    /**
                     * Encodes the specified ReportBenchmarkResultRequest message. Does not implicitly {@link xsuportal.proto.services.bench.ReportBenchmarkResultRequest.verify|verify} messages.
                     * @param message ReportBenchmarkResultRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.bench.IReportBenchmarkResultRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ReportBenchmarkResultRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.bench.ReportBenchmarkResultRequest.verify|verify} messages.
                     * @param message ReportBenchmarkResultRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.bench.IReportBenchmarkResultRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ReportBenchmarkResultRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ReportBenchmarkResultRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.bench.ReportBenchmarkResultRequest;

                    /**
                     * Decodes a ReportBenchmarkResultRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ReportBenchmarkResultRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.bench.ReportBenchmarkResultRequest;

                    /**
                     * Verifies a ReportBenchmarkResultRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ReportBenchmarkResultRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ReportBenchmarkResultRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.bench.ReportBenchmarkResultRequest;

                    /**
                     * Creates a plain object from a ReportBenchmarkResultRequest message. Also converts values to other types if specified.
                     * @param message ReportBenchmarkResultRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.bench.ReportBenchmarkResultRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ReportBenchmarkResultRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ReportBenchmarkResultResponse. */
                interface IReportBenchmarkResultResponse {

                    /** ReportBenchmarkResultResponse ackedNonce */
                    ackedNonce?: (number|Long|null);
                }

                /** Represents a ReportBenchmarkResultResponse. */
                class ReportBenchmarkResultResponse implements IReportBenchmarkResultResponse {

                    /**
                     * Constructs a new ReportBenchmarkResultResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.bench.IReportBenchmarkResultResponse);

                    /** ReportBenchmarkResultResponse ackedNonce. */
                    public ackedNonce: (number|Long);

                    /**
                     * Creates a new ReportBenchmarkResultResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ReportBenchmarkResultResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.bench.IReportBenchmarkResultResponse): xsuportal.proto.services.bench.ReportBenchmarkResultResponse;

                    /**
                     * Encodes the specified ReportBenchmarkResultResponse message. Does not implicitly {@link xsuportal.proto.services.bench.ReportBenchmarkResultResponse.verify|verify} messages.
                     * @param message ReportBenchmarkResultResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.bench.IReportBenchmarkResultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ReportBenchmarkResultResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.bench.ReportBenchmarkResultResponse.verify|verify} messages.
                     * @param message ReportBenchmarkResultResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.bench.IReportBenchmarkResultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ReportBenchmarkResultResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ReportBenchmarkResultResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.bench.ReportBenchmarkResultResponse;

                    /**
                     * Decodes a ReportBenchmarkResultResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ReportBenchmarkResultResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.bench.ReportBenchmarkResultResponse;

                    /**
                     * Verifies a ReportBenchmarkResultResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ReportBenchmarkResultResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ReportBenchmarkResultResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.bench.ReportBenchmarkResultResponse;

                    /**
                     * Creates a plain object from a ReportBenchmarkResultResponse message. Also converts values to other types if specified.
                     * @param message ReportBenchmarkResultResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.bench.ReportBenchmarkResultResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ReportBenchmarkResultResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace common. */
            namespace common {

                /** Properties of a GetCurrentSessionResponse. */
                interface IGetCurrentSessionResponse {

                    /** GetCurrentSessionResponse team */
                    team?: (xsuportal.proto.resources.ITeam|null);

                    /** GetCurrentSessionResponse contestant */
                    contestant?: (xsuportal.proto.resources.IContestant|null);
                }

                /** Represents a GetCurrentSessionResponse. */
                class GetCurrentSessionResponse implements IGetCurrentSessionResponse {

                    /**
                     * Constructs a new GetCurrentSessionResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.common.IGetCurrentSessionResponse);

                    /** GetCurrentSessionResponse team. */
                    public team?: (xsuportal.proto.resources.ITeam|null);

                    /** GetCurrentSessionResponse contestant. */
                    public contestant?: (xsuportal.proto.resources.IContestant|null);

                    /**
                     * Creates a new GetCurrentSessionResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetCurrentSessionResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.common.IGetCurrentSessionResponse): xsuportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Encodes the specified GetCurrentSessionResponse message. Does not implicitly {@link xsuportal.proto.services.common.GetCurrentSessionResponse.verify|verify} messages.
                     * @param message GetCurrentSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.common.IGetCurrentSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetCurrentSessionResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.common.GetCurrentSessionResponse.verify|verify} messages.
                     * @param message GetCurrentSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.common.IGetCurrentSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetCurrentSessionResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetCurrentSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Decodes a GetCurrentSessionResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetCurrentSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Verifies a GetCurrentSessionResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetCurrentSessionResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetCurrentSessionResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Creates a plain object from a GetCurrentSessionResponse message. Also converts values to other types if specified.
                     * @param message GetCurrentSessionResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.common.GetCurrentSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetCurrentSessionResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace contestant. */
            namespace contestant {

                /** Properties of a ListBenchmarkJobsRequest. */
                interface IListBenchmarkJobsRequest {
                }

                /** Represents a ListBenchmarkJobsRequest. */
                class ListBenchmarkJobsRequest implements IListBenchmarkJobsRequest {

                    /**
                     * Constructs a new ListBenchmarkJobsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListBenchmarkJobsRequest);

                    /**
                     * Creates a new ListBenchmarkJobsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListBenchmarkJobsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListBenchmarkJobsRequest): xsuportal.proto.services.contestant.ListBenchmarkJobsRequest;

                    /**
                     * Encodes the specified ListBenchmarkJobsRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.ListBenchmarkJobsRequest.verify|verify} messages.
                     * @param message ListBenchmarkJobsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListBenchmarkJobsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListBenchmarkJobsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListBenchmarkJobsRequest.verify|verify} messages.
                     * @param message ListBenchmarkJobsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListBenchmarkJobsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListBenchmarkJobsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListBenchmarkJobsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListBenchmarkJobsRequest;

                    /**
                     * Decodes a ListBenchmarkJobsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListBenchmarkJobsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListBenchmarkJobsRequest;

                    /**
                     * Verifies a ListBenchmarkJobsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListBenchmarkJobsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListBenchmarkJobsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListBenchmarkJobsRequest;

                    /**
                     * Creates a plain object from a ListBenchmarkJobsRequest message. Also converts values to other types if specified.
                     * @param message ListBenchmarkJobsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListBenchmarkJobsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListBenchmarkJobsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListBenchmarkJobsResponse. */
                interface IListBenchmarkJobsResponse {

                    /** ListBenchmarkJobsResponse jobs */
                    jobs?: (xsuportal.proto.resources.IBenchmarkJob[]|null);
                }

                /** Represents a ListBenchmarkJobsResponse. */
                class ListBenchmarkJobsResponse implements IListBenchmarkJobsResponse {

                    /**
                     * Constructs a new ListBenchmarkJobsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListBenchmarkJobsResponse);

                    /** ListBenchmarkJobsResponse jobs. */
                    public jobs: xsuportal.proto.resources.IBenchmarkJob[];

                    /**
                     * Creates a new ListBenchmarkJobsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListBenchmarkJobsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListBenchmarkJobsResponse): xsuportal.proto.services.contestant.ListBenchmarkJobsResponse;

                    /**
                     * Encodes the specified ListBenchmarkJobsResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.ListBenchmarkJobsResponse.verify|verify} messages.
                     * @param message ListBenchmarkJobsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListBenchmarkJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListBenchmarkJobsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListBenchmarkJobsResponse.verify|verify} messages.
                     * @param message ListBenchmarkJobsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListBenchmarkJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListBenchmarkJobsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListBenchmarkJobsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListBenchmarkJobsResponse;

                    /**
                     * Decodes a ListBenchmarkJobsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListBenchmarkJobsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListBenchmarkJobsResponse;

                    /**
                     * Verifies a ListBenchmarkJobsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListBenchmarkJobsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListBenchmarkJobsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListBenchmarkJobsResponse;

                    /**
                     * Creates a plain object from a ListBenchmarkJobsResponse message. Also converts values to other types if specified.
                     * @param message ListBenchmarkJobsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListBenchmarkJobsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListBenchmarkJobsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an EnqueueBenchmarkJobRequest. */
                interface IEnqueueBenchmarkJobRequest {

                    /** EnqueueBenchmarkJobRequest targetId */
                    targetId?: (number|Long|null);
                }

                /** Represents an EnqueueBenchmarkJobRequest. */
                class EnqueueBenchmarkJobRequest implements IEnqueueBenchmarkJobRequest {

                    /**
                     * Constructs a new EnqueueBenchmarkJobRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobRequest);

                    /** EnqueueBenchmarkJobRequest targetId. */
                    public targetId: (number|Long);

                    /**
                     * Creates a new EnqueueBenchmarkJobRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EnqueueBenchmarkJobRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobRequest): xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EnqueueBenchmarkJobRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EnqueueBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest;

                    /**
                     * Decodes an EnqueueBenchmarkJobRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EnqueueBenchmarkJobRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest;

                    /**
                     * Verifies an EnqueueBenchmarkJobRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EnqueueBenchmarkJobRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EnqueueBenchmarkJobRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest;

                    /**
                     * Creates a plain object from an EnqueueBenchmarkJobRequest message. Also converts values to other types if specified.
                     * @param message EnqueueBenchmarkJobRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.EnqueueBenchmarkJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EnqueueBenchmarkJobRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an EnqueueBenchmarkJobResponse. */
                interface IEnqueueBenchmarkJobResponse {

                    /** EnqueueBenchmarkJobResponse job */
                    job?: (xsuportal.proto.resources.IBenchmarkJob|null);
                }

                /** Represents an EnqueueBenchmarkJobResponse. */
                class EnqueueBenchmarkJobResponse implements IEnqueueBenchmarkJobResponse {

                    /**
                     * Constructs a new EnqueueBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobResponse);

                    /** EnqueueBenchmarkJobResponse job. */
                    public job?: (xsuportal.proto.resources.IBenchmarkJob|null);

                    /**
                     * Creates a new EnqueueBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EnqueueBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobResponse): xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EnqueueBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse.verify|verify} messages.
                     * @param message EnqueueBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IEnqueueBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EnqueueBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EnqueueBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse;

                    /**
                     * Decodes an EnqueueBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EnqueueBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse;

                    /**
                     * Verifies an EnqueueBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EnqueueBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EnqueueBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse;

                    /**
                     * Creates a plain object from an EnqueueBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message EnqueueBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.EnqueueBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EnqueueBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetBenchmarkJobQuery. */
                interface IGetBenchmarkJobQuery {

                    /** GetBenchmarkJobQuery id */
                    id?: (number|Long|null);
                }

                /** Represents a GetBenchmarkJobQuery. */
                class GetBenchmarkJobQuery implements IGetBenchmarkJobQuery {

                    /**
                     * Constructs a new GetBenchmarkJobQuery.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IGetBenchmarkJobQuery);

                    /** GetBenchmarkJobQuery id. */
                    public id: (number|Long);

                    /**
                     * Creates a new GetBenchmarkJobQuery instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetBenchmarkJobQuery instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IGetBenchmarkJobQuery): xsuportal.proto.services.contestant.GetBenchmarkJobQuery;

                    /**
                     * Encodes the specified GetBenchmarkJobQuery message. Does not implicitly {@link xsuportal.proto.services.contestant.GetBenchmarkJobQuery.verify|verify} messages.
                     * @param message GetBenchmarkJobQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IGetBenchmarkJobQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetBenchmarkJobQuery message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.GetBenchmarkJobQuery.verify|verify} messages.
                     * @param message GetBenchmarkJobQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IGetBenchmarkJobQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetBenchmarkJobQuery message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetBenchmarkJobQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.GetBenchmarkJobQuery;

                    /**
                     * Decodes a GetBenchmarkJobQuery message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetBenchmarkJobQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.GetBenchmarkJobQuery;

                    /**
                     * Verifies a GetBenchmarkJobQuery message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetBenchmarkJobQuery message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetBenchmarkJobQuery
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.GetBenchmarkJobQuery;

                    /**
                     * Creates a plain object from a GetBenchmarkJobQuery message. Also converts values to other types if specified.
                     * @param message GetBenchmarkJobQuery
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.GetBenchmarkJobQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetBenchmarkJobQuery to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetBenchmarkJobResponse. */
                interface IGetBenchmarkJobResponse {

                    /** GetBenchmarkJobResponse job */
                    job?: (xsuportal.proto.resources.IBenchmarkJob|null);
                }

                /** Represents a GetBenchmarkJobResponse. */
                class GetBenchmarkJobResponse implements IGetBenchmarkJobResponse {

                    /**
                     * Constructs a new GetBenchmarkJobResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IGetBenchmarkJobResponse);

                    /** GetBenchmarkJobResponse job. */
                    public job?: (xsuportal.proto.resources.IBenchmarkJob|null);

                    /**
                     * Creates a new GetBenchmarkJobResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetBenchmarkJobResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IGetBenchmarkJobResponse): xsuportal.proto.services.contestant.GetBenchmarkJobResponse;

                    /**
                     * Encodes the specified GetBenchmarkJobResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.GetBenchmarkJobResponse.verify|verify} messages.
                     * @param message GetBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IGetBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetBenchmarkJobResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.GetBenchmarkJobResponse.verify|verify} messages.
                     * @param message GetBenchmarkJobResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IGetBenchmarkJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetBenchmarkJobResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.GetBenchmarkJobResponse;

                    /**
                     * Decodes a GetBenchmarkJobResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetBenchmarkJobResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.GetBenchmarkJobResponse;

                    /**
                     * Verifies a GetBenchmarkJobResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetBenchmarkJobResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetBenchmarkJobResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.GetBenchmarkJobResponse;

                    /**
                     * Creates a plain object from a GetBenchmarkJobResponse message. Also converts values to other types if specified.
                     * @param message GetBenchmarkJobResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.GetBenchmarkJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetBenchmarkJobResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListClarificationsRequest. */
                interface IListClarificationsRequest {
                }

                /** Represents a ListClarificationsRequest. */
                class ListClarificationsRequest implements IListClarificationsRequest {

                    /**
                     * Constructs a new ListClarificationsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListClarificationsRequest);

                    /**
                     * Creates a new ListClarificationsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListClarificationsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListClarificationsRequest): xsuportal.proto.services.contestant.ListClarificationsRequest;

                    /**
                     * Encodes the specified ListClarificationsRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.ListClarificationsRequest.verify|verify} messages.
                     * @param message ListClarificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListClarificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListClarificationsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListClarificationsRequest.verify|verify} messages.
                     * @param message ListClarificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListClarificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListClarificationsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListClarificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListClarificationsRequest;

                    /**
                     * Decodes a ListClarificationsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListClarificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListClarificationsRequest;

                    /**
                     * Verifies a ListClarificationsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListClarificationsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListClarificationsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListClarificationsRequest;

                    /**
                     * Creates a plain object from a ListClarificationsRequest message. Also converts values to other types if specified.
                     * @param message ListClarificationsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListClarificationsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListClarificationsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListClarificationsResponse. */
                interface IListClarificationsResponse {

                    /** ListClarificationsResponse clarifications */
                    clarifications?: (xsuportal.proto.resources.IClarification[]|null);
                }

                /** Represents a ListClarificationsResponse. */
                class ListClarificationsResponse implements IListClarificationsResponse {

                    /**
                     * Constructs a new ListClarificationsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListClarificationsResponse);

                    /** ListClarificationsResponse clarifications. */
                    public clarifications: xsuportal.proto.resources.IClarification[];

                    /**
                     * Creates a new ListClarificationsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListClarificationsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListClarificationsResponse): xsuportal.proto.services.contestant.ListClarificationsResponse;

                    /**
                     * Encodes the specified ListClarificationsResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.ListClarificationsResponse.verify|verify} messages.
                     * @param message ListClarificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListClarificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListClarificationsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListClarificationsResponse.verify|verify} messages.
                     * @param message ListClarificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListClarificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListClarificationsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListClarificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListClarificationsResponse;

                    /**
                     * Decodes a ListClarificationsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListClarificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListClarificationsResponse;

                    /**
                     * Verifies a ListClarificationsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListClarificationsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListClarificationsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListClarificationsResponse;

                    /**
                     * Creates a plain object from a ListClarificationsResponse message. Also converts values to other types if specified.
                     * @param message ListClarificationsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListClarificationsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListClarificationsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a RequestClarificationRequest. */
                interface IRequestClarificationRequest {

                    /** RequestClarificationRequest question */
                    question?: (string|null);
                }

                /** Represents a RequestClarificationRequest. */
                class RequestClarificationRequest implements IRequestClarificationRequest {

                    /**
                     * Constructs a new RequestClarificationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IRequestClarificationRequest);

                    /** RequestClarificationRequest question. */
                    public question: string;

                    /**
                     * Creates a new RequestClarificationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RequestClarificationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IRequestClarificationRequest): xsuportal.proto.services.contestant.RequestClarificationRequest;

                    /**
                     * Encodes the specified RequestClarificationRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.RequestClarificationRequest.verify|verify} messages.
                     * @param message RequestClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IRequestClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RequestClarificationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.RequestClarificationRequest.verify|verify} messages.
                     * @param message RequestClarificationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IRequestClarificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RequestClarificationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RequestClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.RequestClarificationRequest;

                    /**
                     * Decodes a RequestClarificationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RequestClarificationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.RequestClarificationRequest;

                    /**
                     * Verifies a RequestClarificationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RequestClarificationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RequestClarificationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.RequestClarificationRequest;

                    /**
                     * Creates a plain object from a RequestClarificationRequest message. Also converts values to other types if specified.
                     * @param message RequestClarificationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.RequestClarificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RequestClarificationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a RequestClarificationResponse. */
                interface IRequestClarificationResponse {

                    /** RequestClarificationResponse clarification */
                    clarification?: (xsuportal.proto.resources.IClarification|null);
                }

                /** Represents a RequestClarificationResponse. */
                class RequestClarificationResponse implements IRequestClarificationResponse {

                    /**
                     * Constructs a new RequestClarificationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IRequestClarificationResponse);

                    /** RequestClarificationResponse clarification. */
                    public clarification?: (xsuportal.proto.resources.IClarification|null);

                    /**
                     * Creates a new RequestClarificationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RequestClarificationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IRequestClarificationResponse): xsuportal.proto.services.contestant.RequestClarificationResponse;

                    /**
                     * Encodes the specified RequestClarificationResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.RequestClarificationResponse.verify|verify} messages.
                     * @param message RequestClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IRequestClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RequestClarificationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.RequestClarificationResponse.verify|verify} messages.
                     * @param message RequestClarificationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IRequestClarificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RequestClarificationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RequestClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.RequestClarificationResponse;

                    /**
                     * Decodes a RequestClarificationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RequestClarificationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.RequestClarificationResponse;

                    /**
                     * Verifies a RequestClarificationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RequestClarificationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RequestClarificationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.RequestClarificationResponse;

                    /**
                     * Creates a plain object from a RequestClarificationResponse message. Also converts values to other types if specified.
                     * @param message RequestClarificationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.RequestClarificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RequestClarificationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DashboardRequest. */
                interface IDashboardRequest {
                }

                /** Represents a DashboardRequest. */
                class DashboardRequest implements IDashboardRequest {

                    /**
                     * Constructs a new DashboardRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IDashboardRequest);

                    /**
                     * Creates a new DashboardRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IDashboardRequest): xsuportal.proto.services.contestant.DashboardRequest;

                    /**
                     * Encodes the specified DashboardRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.DashboardRequest.verify|verify} messages.
                     * @param message DashboardRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.DashboardRequest;

                    /**
                     * Decodes a DashboardRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.DashboardRequest;

                    /**
                     * Verifies a DashboardRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.DashboardRequest;

                    /**
                     * Creates a plain object from a DashboardRequest message. Also converts values to other types if specified.
                     * @param message DashboardRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.DashboardRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DashboardResponse. */
                interface IDashboardResponse {

                    /** DashboardResponse leaderboard */
                    leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);

                    /** DashboardResponse instances */
                    instances?: (xsuportal.proto.resources.IContestantInstance[]|null);

                    /** DashboardResponse jobs */
                    jobs?: (xsuportal.proto.resources.IBenchmarkJob[]|null);
                }

                /** Represents a DashboardResponse. */
                class DashboardResponse implements IDashboardResponse {

                    /**
                     * Constructs a new DashboardResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IDashboardResponse);

                    /** DashboardResponse leaderboard. */
                    public leaderboard?: (xsuportal.proto.resources.ILeaderboard|null);

                    /** DashboardResponse instances. */
                    public instances: xsuportal.proto.resources.IContestantInstance[];

                    /** DashboardResponse jobs. */
                    public jobs: xsuportal.proto.resources.IBenchmarkJob[];

                    /**
                     * Creates a new DashboardResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DashboardResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IDashboardResponse): xsuportal.proto.services.contestant.DashboardResponse;

                    /**
                     * Encodes the specified DashboardResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DashboardResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.DashboardResponse.verify|verify} messages.
                     * @param message DashboardResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.DashboardResponse;

                    /**
                     * Decodes a DashboardResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DashboardResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.DashboardResponse;

                    /**
                     * Verifies a DashboardResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DashboardResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DashboardResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.DashboardResponse;

                    /**
                     * Creates a plain object from a DashboardResponse message. Also converts values to other types if specified.
                     * @param message DashboardResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.DashboardResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DashboardResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListContestantInstancesRequest. */
                interface IListContestantInstancesRequest {
                }

                /** Represents a ListContestantInstancesRequest. */
                class ListContestantInstancesRequest implements IListContestantInstancesRequest {

                    /**
                     * Constructs a new ListContestantInstancesRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListContestantInstancesRequest);

                    /**
                     * Creates a new ListContestantInstancesRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListContestantInstancesRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListContestantInstancesRequest): xsuportal.proto.services.contestant.ListContestantInstancesRequest;

                    /**
                     * Encodes the specified ListContestantInstancesRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.ListContestantInstancesRequest.verify|verify} messages.
                     * @param message ListContestantInstancesRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListContestantInstancesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListContestantInstancesRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListContestantInstancesRequest.verify|verify} messages.
                     * @param message ListContestantInstancesRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListContestantInstancesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListContestantInstancesRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListContestantInstancesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListContestantInstancesRequest;

                    /**
                     * Decodes a ListContestantInstancesRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListContestantInstancesRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListContestantInstancesRequest;

                    /**
                     * Verifies a ListContestantInstancesRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListContestantInstancesRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListContestantInstancesRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListContestantInstancesRequest;

                    /**
                     * Creates a plain object from a ListContestantInstancesRequest message. Also converts values to other types if specified.
                     * @param message ListContestantInstancesRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListContestantInstancesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListContestantInstancesRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListContestantInstancesResponse. */
                interface IListContestantInstancesResponse {

                    /** ListContestantInstancesResponse contestantInstances */
                    contestantInstances?: (xsuportal.proto.resources.IContestantInstance[]|null);
                }

                /** Represents a ListContestantInstancesResponse. */
                class ListContestantInstancesResponse implements IListContestantInstancesResponse {

                    /**
                     * Constructs a new ListContestantInstancesResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IListContestantInstancesResponse);

                    /** ListContestantInstancesResponse contestantInstances. */
                    public contestantInstances: xsuportal.proto.resources.IContestantInstance[];

                    /**
                     * Creates a new ListContestantInstancesResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListContestantInstancesResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IListContestantInstancesResponse): xsuportal.proto.services.contestant.ListContestantInstancesResponse;

                    /**
                     * Encodes the specified ListContestantInstancesResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.ListContestantInstancesResponse.verify|verify} messages.
                     * @param message ListContestantInstancesResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IListContestantInstancesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListContestantInstancesResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.ListContestantInstancesResponse.verify|verify} messages.
                     * @param message ListContestantInstancesResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IListContestantInstancesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListContestantInstancesResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListContestantInstancesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.ListContestantInstancesResponse;

                    /**
                     * Decodes a ListContestantInstancesResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListContestantInstancesResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.ListContestantInstancesResponse;

                    /**
                     * Verifies a ListContestantInstancesResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ListContestantInstancesResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ListContestantInstancesResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.ListContestantInstancesResponse;

                    /**
                     * Creates a plain object from a ListContestantInstancesResponse message. Also converts values to other types if specified.
                     * @param message ListContestantInstancesResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.ListContestantInstancesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListContestantInstancesResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a LoginRequest. */
                interface ILoginRequest {

                    /** LoginRequest contestantId */
                    contestantId?: (string|null);

                    /** LoginRequest password */
                    password?: (string|null);
                }

                /** Represents a LoginRequest. */
                class LoginRequest implements ILoginRequest {

                    /**
                     * Constructs a new LoginRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ILoginRequest);

                    /** LoginRequest contestantId. */
                    public contestantId: string;

                    /** LoginRequest password. */
                    public password: string;

                    /**
                     * Creates a new LoginRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LoginRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ILoginRequest): xsuportal.proto.services.contestant.LoginRequest;

                    /**
                     * Encodes the specified LoginRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.LoginRequest.verify|verify} messages.
                     * @param message LoginRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.LoginRequest.verify|verify} messages.
                     * @param message LoginRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LoginRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LoginRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.LoginRequest;

                    /**
                     * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LoginRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.LoginRequest;

                    /**
                     * Verifies a LoginRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LoginRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.LoginRequest;

                    /**
                     * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
                     * @param message LoginRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.LoginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LoginRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a LoginResponse. */
                interface ILoginResponse {
                }

                /** Represents a LoginResponse. */
                class LoginResponse implements ILoginResponse {

                    /**
                     * Constructs a new LoginResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ILoginResponse);

                    /**
                     * Creates a new LoginResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LoginResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ILoginResponse): xsuportal.proto.services.contestant.LoginResponse;

                    /**
                     * Encodes the specified LoginResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.LoginResponse.verify|verify} messages.
                     * @param message LoginResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.LoginResponse.verify|verify} messages.
                     * @param message LoginResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LoginResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LoginResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.LoginResponse;

                    /**
                     * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LoginResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.LoginResponse;

                    /**
                     * Verifies a LoginResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LoginResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.LoginResponse;

                    /**
                     * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
                     * @param message LoginResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.LoginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LoginResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a LogoutRequest. */
                interface ILogoutRequest {
                }

                /** Represents a LogoutRequest. */
                class LogoutRequest implements ILogoutRequest {

                    /**
                     * Constructs a new LogoutRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ILogoutRequest);

                    /**
                     * Creates a new LogoutRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LogoutRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ILogoutRequest): xsuportal.proto.services.contestant.LogoutRequest;

                    /**
                     * Encodes the specified LogoutRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.LogoutRequest.verify|verify} messages.
                     * @param message LogoutRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ILogoutRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LogoutRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.LogoutRequest.verify|verify} messages.
                     * @param message LogoutRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ILogoutRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LogoutRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LogoutRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.LogoutRequest;

                    /**
                     * Decodes a LogoutRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LogoutRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.LogoutRequest;

                    /**
                     * Verifies a LogoutRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LogoutRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LogoutRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.LogoutRequest;

                    /**
                     * Creates a plain object from a LogoutRequest message. Also converts values to other types if specified.
                     * @param message LogoutRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.LogoutRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LogoutRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a LogoutResponse. */
                interface ILogoutResponse {
                }

                /** Represents a LogoutResponse. */
                class LogoutResponse implements ILogoutResponse {

                    /**
                     * Constructs a new LogoutResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ILogoutResponse);

                    /**
                     * Creates a new LogoutResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LogoutResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ILogoutResponse): xsuportal.proto.services.contestant.LogoutResponse;

                    /**
                     * Encodes the specified LogoutResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.LogoutResponse.verify|verify} messages.
                     * @param message LogoutResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ILogoutResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LogoutResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.LogoutResponse.verify|verify} messages.
                     * @param message LogoutResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ILogoutResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LogoutResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LogoutResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.LogoutResponse;

                    /**
                     * Decodes a LogoutResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LogoutResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.LogoutResponse;

                    /**
                     * Verifies a LogoutResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LogoutResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LogoutResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.LogoutResponse;

                    /**
                     * Creates a plain object from a LogoutResponse message. Also converts values to other types if specified.
                     * @param message LogoutResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.LogoutResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LogoutResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetNotificationsRequest. */
                interface IGetNotificationsRequest {
                }

                /** Represents a GetNotificationsRequest. */
                class GetNotificationsRequest implements IGetNotificationsRequest {

                    /**
                     * Constructs a new GetNotificationsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IGetNotificationsRequest);

                    /**
                     * Creates a new GetNotificationsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetNotificationsRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IGetNotificationsRequest): xsuportal.proto.services.contestant.GetNotificationsRequest;

                    /**
                     * Encodes the specified GetNotificationsRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.GetNotificationsRequest.verify|verify} messages.
                     * @param message GetNotificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IGetNotificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetNotificationsRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.GetNotificationsRequest.verify|verify} messages.
                     * @param message GetNotificationsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IGetNotificationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetNotificationsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetNotificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.GetNotificationsRequest;

                    /**
                     * Decodes a GetNotificationsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetNotificationsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.GetNotificationsRequest;

                    /**
                     * Verifies a GetNotificationsRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetNotificationsRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetNotificationsRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.GetNotificationsRequest;

                    /**
                     * Creates a plain object from a GetNotificationsRequest message. Also converts values to other types if specified.
                     * @param message GetNotificationsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.GetNotificationsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetNotificationsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetNotificationsResponse. */
                interface IGetNotificationsResponse {

                    /** GetNotificationsResponse lastAnsweredClarificationId */
                    lastAnsweredClarificationId?: (number|Long|null);
                }

                /** Represents a GetNotificationsResponse. */
                class GetNotificationsResponse implements IGetNotificationsResponse {

                    /**
                     * Constructs a new GetNotificationsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.IGetNotificationsResponse);

                    /** GetNotificationsResponse lastAnsweredClarificationId. */
                    public lastAnsweredClarificationId: (number|Long);

                    /**
                     * Creates a new GetNotificationsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetNotificationsResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.IGetNotificationsResponse): xsuportal.proto.services.contestant.GetNotificationsResponse;

                    /**
                     * Encodes the specified GetNotificationsResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.GetNotificationsResponse.verify|verify} messages.
                     * @param message GetNotificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.IGetNotificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetNotificationsResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.GetNotificationsResponse.verify|verify} messages.
                     * @param message GetNotificationsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.IGetNotificationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetNotificationsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetNotificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.GetNotificationsResponse;

                    /**
                     * Decodes a GetNotificationsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetNotificationsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.GetNotificationsResponse;

                    /**
                     * Verifies a GetNotificationsResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetNotificationsResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetNotificationsResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.GetNotificationsResponse;

                    /**
                     * Creates a plain object from a GetNotificationsResponse message. Also converts values to other types if specified.
                     * @param message GetNotificationsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.GetNotificationsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetNotificationsResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a SignupRequest. */
                interface ISignupRequest {

                    /** SignupRequest contestantId */
                    contestantId?: (string|null);

                    /** SignupRequest password */
                    password?: (string|null);
                }

                /** Represents a SignupRequest. */
                class SignupRequest implements ISignupRequest {

                    /**
                     * Constructs a new SignupRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ISignupRequest);

                    /** SignupRequest contestantId. */
                    public contestantId: string;

                    /** SignupRequest password. */
                    public password: string;

                    /**
                     * Creates a new SignupRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SignupRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ISignupRequest): xsuportal.proto.services.contestant.SignupRequest;

                    /**
                     * Encodes the specified SignupRequest message. Does not implicitly {@link xsuportal.proto.services.contestant.SignupRequest.verify|verify} messages.
                     * @param message SignupRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ISignupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SignupRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.SignupRequest.verify|verify} messages.
                     * @param message SignupRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ISignupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SignupRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SignupRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.SignupRequest;

                    /**
                     * Decodes a SignupRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SignupRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.SignupRequest;

                    /**
                     * Verifies a SignupRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SignupRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SignupRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.SignupRequest;

                    /**
                     * Creates a plain object from a SignupRequest message. Also converts values to other types if specified.
                     * @param message SignupRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.SignupRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SignupRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a SignupResponse. */
                interface ISignupResponse {
                }

                /** Represents a SignupResponse. */
                class SignupResponse implements ISignupResponse {

                    /**
                     * Constructs a new SignupResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.contestant.ISignupResponse);

                    /**
                     * Creates a new SignupResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SignupResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.contestant.ISignupResponse): xsuportal.proto.services.contestant.SignupResponse;

                    /**
                     * Encodes the specified SignupResponse message. Does not implicitly {@link xsuportal.proto.services.contestant.SignupResponse.verify|verify} messages.
                     * @param message SignupResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.contestant.ISignupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SignupResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.contestant.SignupResponse.verify|verify} messages.
                     * @param message SignupResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.contestant.ISignupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SignupResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SignupResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.contestant.SignupResponse;

                    /**
                     * Decodes a SignupResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SignupResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.contestant.SignupResponse;

                    /**
                     * Verifies a SignupResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SignupResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SignupResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.contestant.SignupResponse;

                    /**
                     * Creates a plain object from a SignupResponse message. Also converts values to other types if specified.
                     * @param message SignupResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.contestant.SignupResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SignupResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace dcim. */
            namespace dcim {

                /** Represents an InstanceManagementService */
                class InstanceManagementService extends $protobuf.rpc.Service {

                    /**
                     * Constructs a new InstanceManagementService service.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     */
                    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                    /**
                     * Creates new InstanceManagementService service using the specified rpc implementation.
                     * @param rpcImpl RPC implementation
                     * @param [requestDelimited=false] Whether requests are length-delimited
                     * @param [responseDelimited=false] Whether responses are length-delimited
                     * @returns RPC service. Useful where requests and/or responses are streamed.
                     */
                    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): InstanceManagementService;

                    /**
                     * Calls InformInstanceStateUpdate.
                     * @param request InformInstanceStateUpdateRequest message or plain object
                     * @param callback Node-style callback called with the error, if any, and InformInstanceStateUpdateResponse
                     */
                    public informInstanceStateUpdate(request: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest, callback: xsuportal.proto.services.dcim.InstanceManagementService.InformInstanceStateUpdateCallback): void;

                    /**
                     * Calls InformInstanceStateUpdate.
                     * @param request InformInstanceStateUpdateRequest message or plain object
                     * @returns Promise
                     */
                    public informInstanceStateUpdate(request: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest): Promise<xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse>;
                }

                namespace InstanceManagementService {

                    /**
                     * Callback as used by {@link xsuportal.proto.services.dcim.InstanceManagementService#informInstanceStateUpdate}.
                     * @param error Error, if any
                     * @param [response] InformInstanceStateUpdateResponse
                     */
                    type InformInstanceStateUpdateCallback = (error: (Error|null), response?: xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse) => void;
                }

                /** Properties of an InformInstanceStateUpdateRequest. */
                interface IInformInstanceStateUpdateRequest {

                    /** InformInstanceStateUpdateRequest token */
                    token?: (string|null);

                    /** InformInstanceStateUpdateRequest instance */
                    instance?: (xsuportal.proto.resources.IContestantInstance|null);
                }

                /** Represents an InformInstanceStateUpdateRequest. */
                class InformInstanceStateUpdateRequest implements IInformInstanceStateUpdateRequest {

                    /**
                     * Constructs a new InformInstanceStateUpdateRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest);

                    /** InformInstanceStateUpdateRequest token. */
                    public token: string;

                    /** InformInstanceStateUpdateRequest instance. */
                    public instance?: (xsuportal.proto.resources.IContestantInstance|null);

                    /**
                     * Creates a new InformInstanceStateUpdateRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InformInstanceStateUpdateRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest): xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest;

                    /**
                     * Encodes the specified InformInstanceStateUpdateRequest message. Does not implicitly {@link xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest.verify|verify} messages.
                     * @param message InformInstanceStateUpdateRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InformInstanceStateUpdateRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest.verify|verify} messages.
                     * @param message InformInstanceStateUpdateRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.dcim.IInformInstanceStateUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InformInstanceStateUpdateRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InformInstanceStateUpdateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest;

                    /**
                     * Decodes an InformInstanceStateUpdateRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InformInstanceStateUpdateRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest;

                    /**
                     * Verifies an InformInstanceStateUpdateRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InformInstanceStateUpdateRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InformInstanceStateUpdateRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest;

                    /**
                     * Creates a plain object from an InformInstanceStateUpdateRequest message. Also converts values to other types if specified.
                     * @param message InformInstanceStateUpdateRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.dcim.InformInstanceStateUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InformInstanceStateUpdateRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an InformInstanceStateUpdateResponse. */
                interface IInformInstanceStateUpdateResponse {
                }

                /** Represents an InformInstanceStateUpdateResponse. */
                class InformInstanceStateUpdateResponse implements IInformInstanceStateUpdateResponse {

                    /**
                     * Constructs a new InformInstanceStateUpdateResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.dcim.IInformInstanceStateUpdateResponse);

                    /**
                     * Creates a new InformInstanceStateUpdateResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InformInstanceStateUpdateResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.dcim.IInformInstanceStateUpdateResponse): xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse;

                    /**
                     * Encodes the specified InformInstanceStateUpdateResponse message. Does not implicitly {@link xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse.verify|verify} messages.
                     * @param message InformInstanceStateUpdateResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.dcim.IInformInstanceStateUpdateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InformInstanceStateUpdateResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse.verify|verify} messages.
                     * @param message InformInstanceStateUpdateResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.dcim.IInformInstanceStateUpdateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InformInstanceStateUpdateResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InformInstanceStateUpdateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse;

                    /**
                     * Decodes an InformInstanceStateUpdateResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InformInstanceStateUpdateResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse;

                    /**
                     * Verifies an InformInstanceStateUpdateResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InformInstanceStateUpdateResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InformInstanceStateUpdateResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse;

                    /**
                     * Creates a plain object from an InformInstanceStateUpdateResponse message. Also converts values to other types if specified.
                     * @param message InformInstanceStateUpdateResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.dcim.InformInstanceStateUpdateResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InformInstanceStateUpdateResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace registration. */
            namespace registration {

                /** Properties of a CreateTeamRequest. */
                interface ICreateTeamRequest {

                    /** CreateTeamRequest teamName */
                    teamName?: (string|null);

                    /** CreateTeamRequest name */
                    name?: (string|null);

                    /** CreateTeamRequest emailAddress */
                    emailAddress?: (string|null);

                    /** CreateTeamRequest isStudent */
                    isStudent?: (boolean|null);
                }

                /** Represents a CreateTeamRequest. */
                class CreateTeamRequest implements ICreateTeamRequest {

                    /**
                     * Constructs a new CreateTeamRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.ICreateTeamRequest);

                    /** CreateTeamRequest teamName. */
                    public teamName: string;

                    /** CreateTeamRequest name. */
                    public name: string;

                    /** CreateTeamRequest emailAddress. */
                    public emailAddress: string;

                    /** CreateTeamRequest isStudent. */
                    public isStudent: boolean;

                    /**
                     * Creates a new CreateTeamRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CreateTeamRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.ICreateTeamRequest): xsuportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Encodes the specified CreateTeamRequest message. Does not implicitly {@link xsuportal.proto.services.registration.CreateTeamRequest.verify|verify} messages.
                     * @param message CreateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.ICreateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateTeamRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.CreateTeamRequest.verify|verify} messages.
                     * @param message CreateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.ICreateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Decodes a CreateTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Verifies a CreateTeamRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CreateTeamRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CreateTeamRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Creates a plain object from a CreateTeamRequest message. Also converts values to other types if specified.
                     * @param message CreateTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.CreateTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CreateTeamRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a CreateTeamResponse. */
                interface ICreateTeamResponse {

                    /** CreateTeamResponse teamId */
                    teamId?: (number|Long|null);
                }

                /** Represents a CreateTeamResponse. */
                class CreateTeamResponse implements ICreateTeamResponse {

                    /**
                     * Constructs a new CreateTeamResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.ICreateTeamResponse);

                    /** CreateTeamResponse teamId. */
                    public teamId: (number|Long);

                    /**
                     * Creates a new CreateTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CreateTeamResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.ICreateTeamResponse): xsuportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Encodes the specified CreateTeamResponse message. Does not implicitly {@link xsuportal.proto.services.registration.CreateTeamResponse.verify|verify} messages.
                     * @param message CreateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.ICreateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateTeamResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.CreateTeamResponse.verify|verify} messages.
                     * @param message CreateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.ICreateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Decodes a CreateTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Verifies a CreateTeamResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a CreateTeamResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns CreateTeamResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Creates a plain object from a CreateTeamResponse message. Also converts values to other types if specified.
                     * @param message CreateTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.CreateTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this CreateTeamResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a JoinTeamRequest. */
                interface IJoinTeamRequest {

                    /** JoinTeamRequest teamId */
                    teamId?: (number|Long|null);

                    /** JoinTeamRequest inviteToken */
                    inviteToken?: (string|null);

                    /** JoinTeamRequest name */
                    name?: (string|null);

                    /** JoinTeamRequest isStudent */
                    isStudent?: (boolean|null);
                }

                /** Represents a JoinTeamRequest. */
                class JoinTeamRequest implements IJoinTeamRequest {

                    /**
                     * Constructs a new JoinTeamRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IJoinTeamRequest);

                    /** JoinTeamRequest teamId. */
                    public teamId: (number|Long);

                    /** JoinTeamRequest inviteToken. */
                    public inviteToken: string;

                    /** JoinTeamRequest name. */
                    public name: string;

                    /** JoinTeamRequest isStudent. */
                    public isStudent: boolean;

                    /**
                     * Creates a new JoinTeamRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JoinTeamRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IJoinTeamRequest): xsuportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Encodes the specified JoinTeamRequest message. Does not implicitly {@link xsuportal.proto.services.registration.JoinTeamRequest.verify|verify} messages.
                     * @param message JoinTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IJoinTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinTeamRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.JoinTeamRequest.verify|verify} messages.
                     * @param message JoinTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IJoinTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Decodes a JoinTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Verifies a JoinTeamRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a JoinTeamRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns JoinTeamRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Creates a plain object from a JoinTeamRequest message. Also converts values to other types if specified.
                     * @param message JoinTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.JoinTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this JoinTeamRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a JoinTeamResponse. */
                interface IJoinTeamResponse {
                }

                /** Represents a JoinTeamResponse. */
                class JoinTeamResponse implements IJoinTeamResponse {

                    /**
                     * Constructs a new JoinTeamResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IJoinTeamResponse);

                    /**
                     * Creates a new JoinTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JoinTeamResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IJoinTeamResponse): xsuportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Encodes the specified JoinTeamResponse message. Does not implicitly {@link xsuportal.proto.services.registration.JoinTeamResponse.verify|verify} messages.
                     * @param message JoinTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IJoinTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinTeamResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.JoinTeamResponse.verify|verify} messages.
                     * @param message JoinTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IJoinTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Decodes a JoinTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Verifies a JoinTeamResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a JoinTeamResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns JoinTeamResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Creates a plain object from a JoinTeamResponse message. Also converts values to other types if specified.
                     * @param message JoinTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.JoinTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this JoinTeamResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetRegistrationSessionQuery. */
                interface IGetRegistrationSessionQuery {

                    /** GetRegistrationSessionQuery teamId */
                    teamId?: (number|Long|null);

                    /** GetRegistrationSessionQuery inviteToken */
                    inviteToken?: (string|null);
                }

                /** Represents a GetRegistrationSessionQuery. */
                class GetRegistrationSessionQuery implements IGetRegistrationSessionQuery {

                    /**
                     * Constructs a new GetRegistrationSessionQuery.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IGetRegistrationSessionQuery);

                    /** GetRegistrationSessionQuery teamId. */
                    public teamId: (number|Long);

                    /** GetRegistrationSessionQuery inviteToken. */
                    public inviteToken: string;

                    /**
                     * Creates a new GetRegistrationSessionQuery instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetRegistrationSessionQuery instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IGetRegistrationSessionQuery): xsuportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Encodes the specified GetRegistrationSessionQuery message. Does not implicitly {@link xsuportal.proto.services.registration.GetRegistrationSessionQuery.verify|verify} messages.
                     * @param message GetRegistrationSessionQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IGetRegistrationSessionQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetRegistrationSessionQuery message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.GetRegistrationSessionQuery.verify|verify} messages.
                     * @param message GetRegistrationSessionQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IGetRegistrationSessionQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetRegistrationSessionQuery message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetRegistrationSessionQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Decodes a GetRegistrationSessionQuery message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetRegistrationSessionQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Verifies a GetRegistrationSessionQuery message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetRegistrationSessionQuery message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetRegistrationSessionQuery
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Creates a plain object from a GetRegistrationSessionQuery message. Also converts values to other types if specified.
                     * @param message GetRegistrationSessionQuery
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.GetRegistrationSessionQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetRegistrationSessionQuery to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetRegistrationSessionResponse. */
                interface IGetRegistrationSessionResponse {

                    /** GetRegistrationSessionResponse team */
                    team?: (xsuportal.proto.resources.ITeam|null);

                    /** GetRegistrationSessionResponse status */
                    status?: (xsuportal.proto.services.registration.GetRegistrationSessionResponse.Status|null);

                    /** GetRegistrationSessionResponse memberInviteUrl */
                    memberInviteUrl?: (string|null);
                }

                /** Represents a GetRegistrationSessionResponse. */
                class GetRegistrationSessionResponse implements IGetRegistrationSessionResponse {

                    /**
                     * Constructs a new GetRegistrationSessionResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IGetRegistrationSessionResponse);

                    /** GetRegistrationSessionResponse team. */
                    public team?: (xsuportal.proto.resources.ITeam|null);

                    /** GetRegistrationSessionResponse status. */
                    public status: xsuportal.proto.services.registration.GetRegistrationSessionResponse.Status;

                    /** GetRegistrationSessionResponse memberInviteUrl. */
                    public memberInviteUrl: string;

                    /**
                     * Creates a new GetRegistrationSessionResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetRegistrationSessionResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IGetRegistrationSessionResponse): xsuportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Encodes the specified GetRegistrationSessionResponse message. Does not implicitly {@link xsuportal.proto.services.registration.GetRegistrationSessionResponse.verify|verify} messages.
                     * @param message GetRegistrationSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IGetRegistrationSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetRegistrationSessionResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.GetRegistrationSessionResponse.verify|verify} messages.
                     * @param message GetRegistrationSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IGetRegistrationSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetRegistrationSessionResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetRegistrationSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Decodes a GetRegistrationSessionResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetRegistrationSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Verifies a GetRegistrationSessionResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetRegistrationSessionResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetRegistrationSessionResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Creates a plain object from a GetRegistrationSessionResponse message. Also converts values to other types if specified.
                     * @param message GetRegistrationSessionResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.GetRegistrationSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetRegistrationSessionResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace GetRegistrationSessionResponse {

                    /** Status enum. */
                    enum Status {
                        CLOSED = 0,
                        NOT_JOINABLE = 1,
                        NOT_LOGGED_IN = 2,
                        CREATABLE = 3,
                        JOINABLE = 4,
                        JOINED = 5
                    }
                }

                /** Properties of an UpdateRegistrationRequest. */
                interface IUpdateRegistrationRequest {

                    /** UpdateRegistrationRequest teamName */
                    teamName?: (string|null);

                    /** UpdateRegistrationRequest name */
                    name?: (string|null);

                    /** UpdateRegistrationRequest emailAddress */
                    emailAddress?: (string|null);

                    /** UpdateRegistrationRequest isStudent */
                    isStudent?: (boolean|null);
                }

                /** Represents an UpdateRegistrationRequest. */
                class UpdateRegistrationRequest implements IUpdateRegistrationRequest {

                    /**
                     * Constructs a new UpdateRegistrationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IUpdateRegistrationRequest);

                    /** UpdateRegistrationRequest teamName. */
                    public teamName: string;

                    /** UpdateRegistrationRequest name. */
                    public name: string;

                    /** UpdateRegistrationRequest emailAddress. */
                    public emailAddress: string;

                    /** UpdateRegistrationRequest isStudent. */
                    public isStudent: boolean;

                    /**
                     * Creates a new UpdateRegistrationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpdateRegistrationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IUpdateRegistrationRequest): xsuportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Encodes the specified UpdateRegistrationRequest message. Does not implicitly {@link xsuportal.proto.services.registration.UpdateRegistrationRequest.verify|verify} messages.
                     * @param message UpdateRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IUpdateRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateRegistrationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.UpdateRegistrationRequest.verify|verify} messages.
                     * @param message UpdateRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IUpdateRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateRegistrationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Decodes an UpdateRegistrationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Verifies an UpdateRegistrationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an UpdateRegistrationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UpdateRegistrationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Creates a plain object from an UpdateRegistrationRequest message. Also converts values to other types if specified.
                     * @param message UpdateRegistrationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.UpdateRegistrationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UpdateRegistrationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an UpdateRegistrationResponse. */
                interface IUpdateRegistrationResponse {
                }

                /** Represents an UpdateRegistrationResponse. */
                class UpdateRegistrationResponse implements IUpdateRegistrationResponse {

                    /**
                     * Constructs a new UpdateRegistrationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IUpdateRegistrationResponse);

                    /**
                     * Creates a new UpdateRegistrationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpdateRegistrationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IUpdateRegistrationResponse): xsuportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Encodes the specified UpdateRegistrationResponse message. Does not implicitly {@link xsuportal.proto.services.registration.UpdateRegistrationResponse.verify|verify} messages.
                     * @param message UpdateRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IUpdateRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateRegistrationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.UpdateRegistrationResponse.verify|verify} messages.
                     * @param message UpdateRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IUpdateRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateRegistrationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Decodes an UpdateRegistrationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Verifies an UpdateRegistrationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an UpdateRegistrationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns UpdateRegistrationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Creates a plain object from an UpdateRegistrationResponse message. Also converts values to other types if specified.
                     * @param message UpdateRegistrationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.UpdateRegistrationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this UpdateRegistrationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DeleteRegistrationRequest. */
                interface IDeleteRegistrationRequest {
                }

                /** Represents a DeleteRegistrationRequest. */
                class DeleteRegistrationRequest implements IDeleteRegistrationRequest {

                    /**
                     * Constructs a new DeleteRegistrationRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IDeleteRegistrationRequest);

                    /**
                     * Creates a new DeleteRegistrationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeleteRegistrationRequest instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IDeleteRegistrationRequest): xsuportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Encodes the specified DeleteRegistrationRequest message. Does not implicitly {@link xsuportal.proto.services.registration.DeleteRegistrationRequest.verify|verify} messages.
                     * @param message DeleteRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IDeleteRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeleteRegistrationRequest message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.DeleteRegistrationRequest.verify|verify} messages.
                     * @param message DeleteRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IDeleteRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeleteRegistrationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeleteRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Decodes a DeleteRegistrationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeleteRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Verifies a DeleteRegistrationRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeleteRegistrationRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeleteRegistrationRequest
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Creates a plain object from a DeleteRegistrationRequest message. Also converts values to other types if specified.
                     * @param message DeleteRegistrationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.DeleteRegistrationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeleteRegistrationRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DeleteRegistrationResponse. */
                interface IDeleteRegistrationResponse {
                }

                /** Represents a DeleteRegistrationResponse. */
                class DeleteRegistrationResponse implements IDeleteRegistrationResponse {

                    /**
                     * Constructs a new DeleteRegistrationResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: xsuportal.proto.services.registration.IDeleteRegistrationResponse);

                    /**
                     * Creates a new DeleteRegistrationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeleteRegistrationResponse instance
                     */
                    public static create(properties?: xsuportal.proto.services.registration.IDeleteRegistrationResponse): xsuportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Encodes the specified DeleteRegistrationResponse message. Does not implicitly {@link xsuportal.proto.services.registration.DeleteRegistrationResponse.verify|verify} messages.
                     * @param message DeleteRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: xsuportal.proto.services.registration.IDeleteRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeleteRegistrationResponse message, length delimited. Does not implicitly {@link xsuportal.proto.services.registration.DeleteRegistrationResponse.verify|verify} messages.
                     * @param message DeleteRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: xsuportal.proto.services.registration.IDeleteRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeleteRegistrationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeleteRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): xsuportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Decodes a DeleteRegistrationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeleteRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): xsuportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Verifies a DeleteRegistrationResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeleteRegistrationResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeleteRegistrationResponse
                     */
                    public static fromObject(object: { [k: string]: any }): xsuportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Creates a plain object from a DeleteRegistrationResponse message. Also converts values to other types if specified.
                     * @param message DeleteRegistrationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: xsuportal.proto.services.registration.DeleteRegistrationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeleteRegistrationResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }
        }
    }
}
