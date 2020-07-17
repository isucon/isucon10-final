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

/** Namespace isuxportal. */
export namespace isuxportal {

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
            debugInfo?: (isuxportal.proto.Error.IDebugInfo|null);
        }

        /** Represents an Error. */
        class Error implements IError {

            /**
             * Constructs a new Error.
             * @param [properties] Properties to set
             */
            constructor(properties?: isuxportal.proto.IError);

            /** Error code. */
            public code: number;

            /** Error name. */
            public name: string;

            /** Error humanMessage. */
            public humanMessage: string;

            /** Error humanDescriptions. */
            public humanDescriptions: string[];

            /** Error debugInfo. */
            public debugInfo?: (isuxportal.proto.Error.IDebugInfo|null);

            /**
             * Creates a new Error instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Error instance
             */
            public static create(properties?: isuxportal.proto.IError): isuxportal.proto.Error;

            /**
             * Encodes the specified Error message. Does not implicitly {@link isuxportal.proto.Error.verify|verify} messages.
             * @param message Error message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: isuxportal.proto.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Error message, length delimited. Does not implicitly {@link isuxportal.proto.Error.verify|verify} messages.
             * @param message Error message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: isuxportal.proto.IError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Error message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.Error;

            /**
             * Decodes an Error message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.Error;

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
            public static fromObject(object: { [k: string]: any }): isuxportal.proto.Error;

            /**
             * Creates a plain object from an Error message. Also converts values to other types if specified.
             * @param message Error
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: isuxportal.proto.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                constructor(properties?: isuxportal.proto.Error.IDebugInfo);

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
                public static create(properties?: isuxportal.proto.Error.IDebugInfo): isuxportal.proto.Error.DebugInfo;

                /**
                 * Encodes the specified DebugInfo message. Does not implicitly {@link isuxportal.proto.Error.DebugInfo.verify|verify} messages.
                 * @param message DebugInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.Error.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DebugInfo message, length delimited. Does not implicitly {@link isuxportal.proto.Error.DebugInfo.verify|verify} messages.
                 * @param message DebugInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.Error.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DebugInfo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DebugInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.Error.DebugInfo;

                /**
                 * Decodes a DebugInfo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DebugInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.Error.DebugInfo;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.Error.DebugInfo;

                /**
                 * Creates a plain object from a DebugInfo message. Also converts values to other types if specified.
                 * @param message DebugInfo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.Error.DebugInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                status?: (isuxportal.proto.resources.BenchmarkJob.Status|null);

                /** BenchmarkJob result */
                result?: (isuxportal.proto.resources.IBenchmarkResult|null);

                /** BenchmarkJob createdAt */
                createdAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob updatedAt */
                updatedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob startedAt */
                startedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob finishedAt */
                finishedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob team */
                team?: (isuxportal.proto.resources.ITeam|null);

                /** BenchmarkJob target */
                target?: (isuxportal.proto.resources.IContestantInstance|null);
            }

            /** Represents a BenchmarkJob. */
            class BenchmarkJob implements IBenchmarkJob {

                /**
                 * Constructs a new BenchmarkJob.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.IBenchmarkJob);

                /** BenchmarkJob id. */
                public id: (number|Long);

                /** BenchmarkJob teamId. */
                public teamId: (number|Long);

                /** BenchmarkJob targetId. */
                public targetId: (number|Long);

                /** BenchmarkJob status. */
                public status: isuxportal.proto.resources.BenchmarkJob.Status;

                /** BenchmarkJob result. */
                public result?: (isuxportal.proto.resources.IBenchmarkResult|null);

                /** BenchmarkJob createdAt. */
                public createdAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob updatedAt. */
                public updatedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob startedAt. */
                public startedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob finishedAt. */
                public finishedAt?: (google.protobuf.ITimestamp|null);

                /** BenchmarkJob team. */
                public team?: (isuxportal.proto.resources.ITeam|null);

                /** BenchmarkJob target. */
                public target?: (isuxportal.proto.resources.IContestantInstance|null);

                /**
                 * Creates a new BenchmarkJob instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BenchmarkJob instance
                 */
                public static create(properties?: isuxportal.proto.resources.IBenchmarkJob): isuxportal.proto.resources.BenchmarkJob;

                /**
                 * Encodes the specified BenchmarkJob message. Does not implicitly {@link isuxportal.proto.resources.BenchmarkJob.verify|verify} messages.
                 * @param message BenchmarkJob message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IBenchmarkJob, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BenchmarkJob message, length delimited. Does not implicitly {@link isuxportal.proto.resources.BenchmarkJob.verify|verify} messages.
                 * @param message BenchmarkJob message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IBenchmarkJob, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BenchmarkJob message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BenchmarkJob
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.BenchmarkJob;

                /**
                 * Decodes a BenchmarkJob message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BenchmarkJob
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.BenchmarkJob;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.BenchmarkJob;

                /**
                 * Creates a plain object from a BenchmarkJob message. Also converts values to other types if specified.
                 * @param message BenchmarkJob
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.BenchmarkJob, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                scoreBreakdown?: (isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown|null);

                /** BenchmarkResult reason */
                reason?: (string|null);

                /** BenchmarkResult stdout */
                stdout?: (string|null);

                /** BenchmarkResult stderr */
                stderr?: (string|null);

                /** BenchmarkResult survey */
                survey?: (isuxportal.proto.resources.BenchmarkResult.ISurvey|null);
            }

            /** Represents a BenchmarkResult. */
            class BenchmarkResult implements IBenchmarkResult {

                /**
                 * Constructs a new BenchmarkResult.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.IBenchmarkResult);

                /** BenchmarkResult finished. */
                public finished: boolean;

                /** BenchmarkResult passed. */
                public passed: boolean;

                /** BenchmarkResult score. */
                public score: (number|Long);

                /** BenchmarkResult scoreBreakdown. */
                public scoreBreakdown?: (isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown|null);

                /** BenchmarkResult reason. */
                public reason: string;

                /** BenchmarkResult stdout. */
                public stdout: string;

                /** BenchmarkResult stderr. */
                public stderr: string;

                /** BenchmarkResult survey. */
                public survey?: (isuxportal.proto.resources.BenchmarkResult.ISurvey|null);

                /**
                 * Creates a new BenchmarkResult instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BenchmarkResult instance
                 */
                public static create(properties?: isuxportal.proto.resources.IBenchmarkResult): isuxportal.proto.resources.BenchmarkResult;

                /**
                 * Encodes the specified BenchmarkResult message. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.verify|verify} messages.
                 * @param message BenchmarkResult message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IBenchmarkResult, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BenchmarkResult message, length delimited. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.verify|verify} messages.
                 * @param message BenchmarkResult message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IBenchmarkResult, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BenchmarkResult message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BenchmarkResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.BenchmarkResult;

                /**
                 * Decodes a BenchmarkResult message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BenchmarkResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.BenchmarkResult;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.BenchmarkResult;

                /**
                 * Creates a plain object from a BenchmarkResult message. Also converts values to other types if specified.
                 * @param message BenchmarkResult
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.BenchmarkResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown);

                    /** ScoreBreakdown base. */
                    public base: (number|Long);

                    /** ScoreBreakdown deduction. */
                    public deduction: (number|Long);

                    /**
                     * Creates a new ScoreBreakdown instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ScoreBreakdown instance
                     */
                    public static create(properties?: isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown): isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Encodes the specified ScoreBreakdown message. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown.verify|verify} messages.
                     * @param message ScoreBreakdown message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ScoreBreakdown message, length delimited. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown.verify|verify} messages.
                     * @param message ScoreBreakdown message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.resources.BenchmarkResult.IScoreBreakdown, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ScoreBreakdown message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ScoreBreakdown
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Decodes a ScoreBreakdown message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ScoreBreakdown
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown;

                    /**
                     * Creates a plain object from a ScoreBreakdown message. Also converts values to other types if specified.
                     * @param message ScoreBreakdown
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.resources.BenchmarkResult.ScoreBreakdown, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.resources.BenchmarkResult.ISurvey);

                    /** Survey language. */
                    public language: string;

                    /**
                     * Creates a new Survey instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Survey instance
                     */
                    public static create(properties?: isuxportal.proto.resources.BenchmarkResult.ISurvey): isuxportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Encodes the specified Survey message. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.Survey.verify|verify} messages.
                     * @param message Survey message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.resources.BenchmarkResult.ISurvey, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Survey message, length delimited. Does not implicitly {@link isuxportal.proto.resources.BenchmarkResult.Survey.verify|verify} messages.
                     * @param message Survey message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.resources.BenchmarkResult.ISurvey, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Survey message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Survey
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Decodes a Survey message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Survey
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.BenchmarkResult.Survey;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.BenchmarkResult.Survey;

                    /**
                     * Creates a plain object from a Survey message. Also converts values to other types if specified.
                     * @param message Survey
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.resources.BenchmarkResult.Survey, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                status?: (isuxportal.proto.resources.ContestantInstance.Status|null);

                /** ContestantInstance team */
                team?: (isuxportal.proto.resources.ITeam|null);
            }

            /** Represents a ContestantInstance. */
            class ContestantInstance implements IContestantInstance {

                /**
                 * Constructs a new ContestantInstance.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.IContestantInstance);

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
                public status: isuxportal.proto.resources.ContestantInstance.Status;

                /** ContestantInstance team. */
                public team?: (isuxportal.proto.resources.ITeam|null);

                /**
                 * Creates a new ContestantInstance instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ContestantInstance instance
                 */
                public static create(properties?: isuxportal.proto.resources.IContestantInstance): isuxportal.proto.resources.ContestantInstance;

                /**
                 * Encodes the specified ContestantInstance message. Does not implicitly {@link isuxportal.proto.resources.ContestantInstance.verify|verify} messages.
                 * @param message ContestantInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IContestantInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ContestantInstance message, length delimited. Does not implicitly {@link isuxportal.proto.resources.ContestantInstance.verify|verify} messages.
                 * @param message ContestantInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IContestantInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ContestantInstance message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ContestantInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.ContestantInstance;

                /**
                 * Decodes a ContestantInstance message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ContestantInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.ContestantInstance;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.ContestantInstance;

                /**
                 * Creates a plain object from a ContestantInstance message. Also converts values to other types if specified.
                 * @param message ContestantInstance
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.ContestantInstance, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                leaderId?: (number|Long|null);

                /** Team memberIds */
                memberIds?: ((number|Long)[]|null);

                /** Team finalParticipation */
                finalParticipation?: (boolean|null);

                /** Team hidden */
                hidden?: (boolean|null);

                /** Team withdrawn */
                withdrawn?: (boolean|null);

                /** Team detail */
                detail?: (isuxportal.proto.resources.Team.ITeamDetail|null);

                /** Team leader */
                leader?: (isuxportal.proto.resources.IContestant|null);

                /** Team members */
                members?: (isuxportal.proto.resources.IContestant[]|null);
            }

            /** Represents a Team. */
            class Team implements ITeam {

                /**
                 * Constructs a new Team.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.ITeam);

                /** Team id. */
                public id: (number|Long);

                /** Team name. */
                public name: string;

                /** Team leaderId. */
                public leaderId: (number|Long);

                /** Team memberIds. */
                public memberIds: (number|Long)[];

                /** Team finalParticipation. */
                public finalParticipation: boolean;

                /** Team hidden. */
                public hidden: boolean;

                /** Team withdrawn. */
                public withdrawn: boolean;

                /** Team detail. */
                public detail?: (isuxportal.proto.resources.Team.ITeamDetail|null);

                /** Team leader. */
                public leader?: (isuxportal.proto.resources.IContestant|null);

                /** Team members. */
                public members: isuxportal.proto.resources.IContestant[];

                /**
                 * Creates a new Team instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Team instance
                 */
                public static create(properties?: isuxportal.proto.resources.ITeam): isuxportal.proto.resources.Team;

                /**
                 * Encodes the specified Team message. Does not implicitly {@link isuxportal.proto.resources.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Team message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Team message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Team;

                /**
                 * Decodes a Team message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Team;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Team;

                /**
                 * Creates a plain object from a Team message. Also converts values to other types if specified.
                 * @param message Team
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.Team, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

                    /** TeamDetail benchmarkTargetId */
                    benchmarkTargetId?: (number|Long|null);

                    /** TeamDetail inviteToken */
                    inviteToken?: (string|null);
                }

                /** Represents a TeamDetail. */
                class TeamDetail implements ITeamDetail {

                    /**
                     * Constructs a new TeamDetail.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.resources.Team.ITeamDetail);

                    /** TeamDetail emailAddress. */
                    public emailAddress: string;

                    /** TeamDetail benchmarkTargetId. */
                    public benchmarkTargetId: (number|Long);

                    /** TeamDetail inviteToken. */
                    public inviteToken: string;

                    /**
                     * Creates a new TeamDetail instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TeamDetail instance
                     */
                    public static create(properties?: isuxportal.proto.resources.Team.ITeamDetail): isuxportal.proto.resources.Team.TeamDetail;

                    /**
                     * Encodes the specified TeamDetail message. Does not implicitly {@link isuxportal.proto.resources.Team.TeamDetail.verify|verify} messages.
                     * @param message TeamDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.resources.Team.ITeamDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TeamDetail message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Team.TeamDetail.verify|verify} messages.
                     * @param message TeamDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.resources.Team.ITeamDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TeamDetail message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TeamDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Team.TeamDetail;

                    /**
                     * Decodes a TeamDetail message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TeamDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Team.TeamDetail;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Team.TeamDetail;

                    /**
                     * Creates a plain object from a TeamDetail message. Also converts values to other types if specified.
                     * @param message TeamDetail
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.resources.Team.TeamDetail, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                id?: (number|Long|null);

                /** Contestant teamId */
                teamId?: (number|Long|null);

                /** Contestant name */
                name?: (string|null);

                /** Contestant contestantDetail */
                contestantDetail?: (isuxportal.proto.resources.Contestant.IContestantDetail|null);
            }

            /** Represents a Contestant. */
            class Contestant implements IContestant {

                /**
                 * Constructs a new Contestant.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.IContestant);

                /** Contestant id. */
                public id: (number|Long);

                /** Contestant teamId. */
                public teamId: (number|Long);

                /** Contestant name. */
                public name: string;

                /** Contestant contestantDetail. */
                public contestantDetail?: (isuxportal.proto.resources.Contestant.IContestantDetail|null);

                /**
                 * Creates a new Contestant instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Contestant instance
                 */
                public static create(properties?: isuxportal.proto.resources.IContestant): isuxportal.proto.resources.Contestant;

                /**
                 * Encodes the specified Contestant message. Does not implicitly {@link isuxportal.proto.resources.Contestant.verify|verify} messages.
                 * @param message Contestant message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IContestant, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Contestant message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Contestant.verify|verify} messages.
                 * @param message Contestant message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IContestant, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Contestant message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Contestant
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Contestant;

                /**
                 * Decodes a Contestant message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Contestant
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Contestant;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Contestant;

                /**
                 * Creates a plain object from a Contestant message. Also converts values to other types if specified.
                 * @param message Contestant
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.Contestant, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Contestant to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Contestant {

                /** Properties of a ContestantDetail. */
                interface IContestantDetail {

                    /** ContestantDetail githubLogin */
                    githubLogin?: (string|null);

                    /** ContestantDetail discordTag */
                    discordTag?: (string|null);

                    /** ContestantDetail isStudent */
                    isStudent?: (boolean|null);

                    /** ContestantDetail avatarUrl */
                    avatarUrl?: (string|null);
                }

                /** Represents a ContestantDetail. */
                class ContestantDetail implements IContestantDetail {

                    /**
                     * Constructs a new ContestantDetail.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.resources.Contestant.IContestantDetail);

                    /** ContestantDetail githubLogin. */
                    public githubLogin: string;

                    /** ContestantDetail discordTag. */
                    public discordTag: string;

                    /** ContestantDetail isStudent. */
                    public isStudent: boolean;

                    /** ContestantDetail avatarUrl. */
                    public avatarUrl: string;

                    /**
                     * Creates a new ContestantDetail instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ContestantDetail instance
                     */
                    public static create(properties?: isuxportal.proto.resources.Contestant.IContestantDetail): isuxportal.proto.resources.Contestant.ContestantDetail;

                    /**
                     * Encodes the specified ContestantDetail message. Does not implicitly {@link isuxportal.proto.resources.Contestant.ContestantDetail.verify|verify} messages.
                     * @param message ContestantDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.resources.Contestant.IContestantDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ContestantDetail message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Contestant.ContestantDetail.verify|verify} messages.
                     * @param message ContestantDetail message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.resources.Contestant.IContestantDetail, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ContestantDetail message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ContestantDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Contestant.ContestantDetail;

                    /**
                     * Decodes a ContestantDetail message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ContestantDetail
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Contestant.ContestantDetail;

                    /**
                     * Verifies a ContestantDetail message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ContestantDetail message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ContestantDetail
                     */
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Contestant.ContestantDetail;

                    /**
                     * Creates a plain object from a ContestantDetail message. Also converts values to other types if specified.
                     * @param message ContestantDetail
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.resources.Contestant.ContestantDetail, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ContestantDetail to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
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

                /** Clarification team */
                team?: (isuxportal.proto.resources.ITeam|null);
            }

            /** Represents a Clarification. */
            class Clarification implements IClarification {

                /**
                 * Constructs a new Clarification.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.resources.IClarification);

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

                /** Clarification team. */
                public team?: (isuxportal.proto.resources.ITeam|null);

                /**
                 * Creates a new Clarification instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Clarification instance
                 */
                public static create(properties?: isuxportal.proto.resources.IClarification): isuxportal.proto.resources.Clarification;

                /**
                 * Encodes the specified Clarification message. Does not implicitly {@link isuxportal.proto.resources.Clarification.verify|verify} messages.
                 * @param message Clarification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IClarification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Clarification message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Clarification.verify|verify} messages.
                 * @param message Clarification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IClarification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Clarification message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Clarification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Clarification;

                /**
                 * Decodes a Clarification message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Clarification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Clarification;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Clarification;

                /**
                 * Creates a plain object from a Clarification message. Also converts values to other types if specified.
                 * @param message Clarification
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.Clarification, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Clarification to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
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
                constructor(properties?: isuxportal.proto.resources.IStaff);

                /** Staff id. */
                public id: (number|Long);

                /** Staff githubLogin. */
                public githubLogin: string;

                /**
                 * Creates a new Staff instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Staff instance
                 */
                public static create(properties?: isuxportal.proto.resources.IStaff): isuxportal.proto.resources.Staff;

                /**
                 * Encodes the specified Staff message. Does not implicitly {@link isuxportal.proto.resources.Staff.verify|verify} messages.
                 * @param message Staff message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.resources.IStaff, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Staff message, length delimited. Does not implicitly {@link isuxportal.proto.resources.Staff.verify|verify} messages.
                 * @param message Staff message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.resources.IStaff, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Staff message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Staff
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.resources.Staff;

                /**
                 * Decodes a Staff message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Staff
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.resources.Staff;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.resources.Staff;

                /**
                 * Creates a plain object from a Staff message. Also converts values to other types if specified.
                 * @param message Staff
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.resources.Staff, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Staff to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Namespace common. */
        namespace common {

            /** Properties of a DashboardRequest. */
            interface IDashboardRequest {
            }

            /** Represents a DashboardRequest. */
            class DashboardRequest implements IDashboardRequest {

                /**
                 * Constructs a new DashboardRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.common.IDashboardRequest);

                /**
                 * Creates a new DashboardRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DashboardRequest instance
                 */
                public static create(properties?: isuxportal.proto.common.IDashboardRequest): isuxportal.proto.common.DashboardRequest;

                /**
                 * Encodes the specified DashboardRequest message. Does not implicitly {@link isuxportal.proto.common.DashboardRequest.verify|verify} messages.
                 * @param message DashboardRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.common.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DashboardRequest message, length delimited. Does not implicitly {@link isuxportal.proto.common.DashboardRequest.verify|verify} messages.
                 * @param message DashboardRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.common.IDashboardRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DashboardRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DashboardRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.common.DashboardRequest;

                /**
                 * Decodes a DashboardRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DashboardRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.common.DashboardRequest;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.common.DashboardRequest;

                /**
                 * Creates a plain object from a DashboardRequest message. Also converts values to other types if specified.
                 * @param message DashboardRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.common.DashboardRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DashboardRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DashboardResponse. */
            interface IDashboardResponse {
            }

            /** Represents a DashboardResponse. */
            class DashboardResponse implements IDashboardResponse {

                /**
                 * Constructs a new DashboardResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: isuxportal.proto.common.IDashboardResponse);

                /**
                 * Creates a new DashboardResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DashboardResponse instance
                 */
                public static create(properties?: isuxportal.proto.common.IDashboardResponse): isuxportal.proto.common.DashboardResponse;

                /**
                 * Encodes the specified DashboardResponse message. Does not implicitly {@link isuxportal.proto.common.DashboardResponse.verify|verify} messages.
                 * @param message DashboardResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: isuxportal.proto.common.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DashboardResponse message, length delimited. Does not implicitly {@link isuxportal.proto.common.DashboardResponse.verify|verify} messages.
                 * @param message DashboardResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: isuxportal.proto.common.IDashboardResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DashboardResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DashboardResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.common.DashboardResponse;

                /**
                 * Decodes a DashboardResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DashboardResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.common.DashboardResponse;

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
                public static fromObject(object: { [k: string]: any }): isuxportal.proto.common.DashboardResponse;

                /**
                 * Creates a plain object from a DashboardResponse message. Also converts values to other types if specified.
                 * @param message DashboardResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: isuxportal.proto.common.DashboardResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DashboardResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Namespace services. */
        namespace services {

            /** Namespace common. */
            namespace common {

                /** Properties of a GetCurrentSessionRequest. */
                interface IGetCurrentSessionRequest {
                }

                /** Represents a GetCurrentSessionRequest. */
                class GetCurrentSessionRequest implements IGetCurrentSessionRequest {

                    /**
                     * Constructs a new GetCurrentSessionRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.services.common.IGetCurrentSessionRequest);

                    /**
                     * Creates a new GetCurrentSessionRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetCurrentSessionRequest instance
                     */
                    public static create(properties?: isuxportal.proto.services.common.IGetCurrentSessionRequest): isuxportal.proto.services.common.GetCurrentSessionRequest;

                    /**
                     * Encodes the specified GetCurrentSessionRequest message. Does not implicitly {@link isuxportal.proto.services.common.GetCurrentSessionRequest.verify|verify} messages.
                     * @param message GetCurrentSessionRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.common.IGetCurrentSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetCurrentSessionRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.common.GetCurrentSessionRequest.verify|verify} messages.
                     * @param message GetCurrentSessionRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.common.IGetCurrentSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetCurrentSessionRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetCurrentSessionRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.common.GetCurrentSessionRequest;

                    /**
                     * Decodes a GetCurrentSessionRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetCurrentSessionRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.common.GetCurrentSessionRequest;

                    /**
                     * Verifies a GetCurrentSessionRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetCurrentSessionRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetCurrentSessionRequest
                     */
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.common.GetCurrentSessionRequest;

                    /**
                     * Creates a plain object from a GetCurrentSessionRequest message. Also converts values to other types if specified.
                     * @param message GetCurrentSessionRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.common.GetCurrentSessionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetCurrentSessionRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetCurrentSessionResponse. */
                interface IGetCurrentSessionResponse {

                    /** GetCurrentSessionResponse team */
                    team?: (isuxportal.proto.resources.ITeam|null);

                    /** GetCurrentSessionResponse contestant */
                    contestant?: (isuxportal.proto.resources.IContestant|null);

                    /** GetCurrentSessionResponse discordServerId */
                    discordServerId?: (string|null);
                }

                /** Represents a GetCurrentSessionResponse. */
                class GetCurrentSessionResponse implements IGetCurrentSessionResponse {

                    /**
                     * Constructs a new GetCurrentSessionResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.services.common.IGetCurrentSessionResponse);

                    /** GetCurrentSessionResponse team. */
                    public team?: (isuxportal.proto.resources.ITeam|null);

                    /** GetCurrentSessionResponse contestant. */
                    public contestant?: (isuxportal.proto.resources.IContestant|null);

                    /** GetCurrentSessionResponse discordServerId. */
                    public discordServerId: string;

                    /**
                     * Creates a new GetCurrentSessionResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetCurrentSessionResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.common.IGetCurrentSessionResponse): isuxportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Encodes the specified GetCurrentSessionResponse message. Does not implicitly {@link isuxportal.proto.services.common.GetCurrentSessionResponse.verify|verify} messages.
                     * @param message GetCurrentSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.common.IGetCurrentSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetCurrentSessionResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.common.GetCurrentSessionResponse.verify|verify} messages.
                     * @param message GetCurrentSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.common.IGetCurrentSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetCurrentSessionResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetCurrentSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Decodes a GetCurrentSessionResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetCurrentSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.common.GetCurrentSessionResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.common.GetCurrentSessionResponse;

                    /**
                     * Creates a plain object from a GetCurrentSessionResponse message. Also converts values to other types if specified.
                     * @param message GetCurrentSessionResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.common.GetCurrentSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetCurrentSessionResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Namespace audience. */
            namespace audience {

                /** Properties of a ListTeamsRequest. */
                interface IListTeamsRequest {
                }

                /** Represents a ListTeamsRequest. */
                class ListTeamsRequest implements IListTeamsRequest {

                    /**
                     * Constructs a new ListTeamsRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.services.audience.IListTeamsRequest);

                    /**
                     * Creates a new ListTeamsRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListTeamsRequest instance
                     */
                    public static create(properties?: isuxportal.proto.services.audience.IListTeamsRequest): isuxportal.proto.services.audience.ListTeamsRequest;

                    /**
                     * Encodes the specified ListTeamsRequest message. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsRequest.verify|verify} messages.
                     * @param message ListTeamsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.audience.IListTeamsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListTeamsRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsRequest.verify|verify} messages.
                     * @param message ListTeamsRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.audience.IListTeamsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListTeamsRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListTeamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.audience.ListTeamsRequest;

                    /**
                     * Decodes a ListTeamsRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListTeamsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.audience.ListTeamsRequest;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.audience.ListTeamsRequest;

                    /**
                     * Creates a plain object from a ListTeamsRequest message. Also converts values to other types if specified.
                     * @param message ListTeamsRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.audience.ListTeamsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ListTeamsRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a ListTeamsResponse. */
                interface IListTeamsResponse {

                    /** ListTeamsResponse teams */
                    teams?: (isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem[]|null);
                }

                /** Represents a ListTeamsResponse. */
                class ListTeamsResponse implements IListTeamsResponse {

                    /**
                     * Constructs a new ListTeamsResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.services.audience.IListTeamsResponse);

                    /** ListTeamsResponse teams. */
                    public teams: isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem[];

                    /**
                     * Creates a new ListTeamsResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ListTeamsResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.audience.IListTeamsResponse): isuxportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Encodes the specified ListTeamsResponse message. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.audience.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ListTeamsResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsResponse.verify|verify} messages.
                     * @param message ListTeamsResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.audience.IListTeamsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Decodes a ListTeamsResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ListTeamsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.audience.ListTeamsResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.audience.ListTeamsResponse;

                    /**
                     * Creates a plain object from a ListTeamsResponse message. Also converts values to other types if specified.
                     * @param message ListTeamsResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.audience.ListTeamsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                        constructor(properties?: isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem);

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
                        public static create(properties?: isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem): isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Encodes the specified TeamListItem message. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified TeamListItem message, length delimited. Does not implicitly {@link isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem.verify|verify} messages.
                         * @param message TeamListItem message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: isuxportal.proto.services.audience.ListTeamsResponse.ITeamListItem, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Decodes a TeamListItem message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns TeamListItem
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem;

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
                        public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem;

                        /**
                         * Creates a plain object from a TeamListItem message. Also converts values to other types if specified.
                         * @param message TeamListItem
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: isuxportal.proto.services.audience.ListTeamsResponse.TeamListItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this TeamListItem to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
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
                    constructor(properties?: isuxportal.proto.services.registration.ICreateTeamRequest);

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
                    public static create(properties?: isuxportal.proto.services.registration.ICreateTeamRequest): isuxportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Encodes the specified CreateTeamRequest message. Does not implicitly {@link isuxportal.proto.services.registration.CreateTeamRequest.verify|verify} messages.
                     * @param message CreateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.ICreateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateTeamRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.CreateTeamRequest.verify|verify} messages.
                     * @param message CreateTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.ICreateTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Decodes a CreateTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.CreateTeamRequest;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.CreateTeamRequest;

                    /**
                     * Creates a plain object from a CreateTeamRequest message. Also converts values to other types if specified.
                     * @param message CreateTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.CreateTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.ICreateTeamResponse);

                    /** CreateTeamResponse teamId. */
                    public teamId: (number|Long);

                    /**
                     * Creates a new CreateTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns CreateTeamResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.ICreateTeamResponse): isuxportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Encodes the specified CreateTeamResponse message. Does not implicitly {@link isuxportal.proto.services.registration.CreateTeamResponse.verify|verify} messages.
                     * @param message CreateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.ICreateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified CreateTeamResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.CreateTeamResponse.verify|verify} messages.
                     * @param message CreateTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.ICreateTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a CreateTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns CreateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Decodes a CreateTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns CreateTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.CreateTeamResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.CreateTeamResponse;

                    /**
                     * Creates a plain object from a CreateTeamResponse message. Also converts values to other types if specified.
                     * @param message CreateTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.CreateTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IJoinTeamRequest);

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
                    public static create(properties?: isuxportal.proto.services.registration.IJoinTeamRequest): isuxportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Encodes the specified JoinTeamRequest message. Does not implicitly {@link isuxportal.proto.services.registration.JoinTeamRequest.verify|verify} messages.
                     * @param message JoinTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IJoinTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinTeamRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.JoinTeamRequest.verify|verify} messages.
                     * @param message JoinTeamRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IJoinTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinTeamRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Decodes a JoinTeamRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinTeamRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.JoinTeamRequest;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.JoinTeamRequest;

                    /**
                     * Creates a plain object from a JoinTeamRequest message. Also converts values to other types if specified.
                     * @param message JoinTeamRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.JoinTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IJoinTeamResponse);

                    /**
                     * Creates a new JoinTeamResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JoinTeamResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IJoinTeamResponse): isuxportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Encodes the specified JoinTeamResponse message. Does not implicitly {@link isuxportal.proto.services.registration.JoinTeamResponse.verify|verify} messages.
                     * @param message JoinTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IJoinTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinTeamResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.JoinTeamResponse.verify|verify} messages.
                     * @param message JoinTeamResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IJoinTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinTeamResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Decodes a JoinTeamResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinTeamResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.JoinTeamResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.JoinTeamResponse;

                    /**
                     * Creates a plain object from a JoinTeamResponse message. Also converts values to other types if specified.
                     * @param message JoinTeamResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.JoinTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IGetRegistrationSessionQuery);

                    /** GetRegistrationSessionQuery teamId. */
                    public teamId: (number|Long);

                    /** GetRegistrationSessionQuery inviteToken. */
                    public inviteToken: string;

                    /**
                     * Creates a new GetRegistrationSessionQuery instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetRegistrationSessionQuery instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IGetRegistrationSessionQuery): isuxportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Encodes the specified GetRegistrationSessionQuery message. Does not implicitly {@link isuxportal.proto.services.registration.GetRegistrationSessionQuery.verify|verify} messages.
                     * @param message GetRegistrationSessionQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IGetRegistrationSessionQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetRegistrationSessionQuery message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.GetRegistrationSessionQuery.verify|verify} messages.
                     * @param message GetRegistrationSessionQuery message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IGetRegistrationSessionQuery, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetRegistrationSessionQuery message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetRegistrationSessionQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Decodes a GetRegistrationSessionQuery message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetRegistrationSessionQuery
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.GetRegistrationSessionQuery;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.GetRegistrationSessionQuery;

                    /**
                     * Creates a plain object from a GetRegistrationSessionQuery message. Also converts values to other types if specified.
                     * @param message GetRegistrationSessionQuery
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.GetRegistrationSessionQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetRegistrationSessionQuery to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a GetRegistrationSessionResponse. */
                interface IGetRegistrationSessionResponse {

                    /** GetRegistrationSessionResponse team */
                    team?: (isuxportal.proto.resources.ITeam|null);

                    /** GetRegistrationSessionResponse status */
                    status?: (isuxportal.proto.services.registration.GetRegistrationSessionResponse.Status|null);

                    /** GetRegistrationSessionResponse githubLogin */
                    githubLogin?: (string|null);

                    /** GetRegistrationSessionResponse githubAvatarUrl */
                    githubAvatarUrl?: (string|null);

                    /** GetRegistrationSessionResponse discordTag */
                    discordTag?: (string|null);

                    /** GetRegistrationSessionResponse discordAvatarUrl */
                    discordAvatarUrl?: (string|null);

                    /** GetRegistrationSessionResponse memberInviteUrl */
                    memberInviteUrl?: (string|null);

                    /** GetRegistrationSessionResponse discordServerId */
                    discordServerId?: (string|null);
                }

                /** Represents a GetRegistrationSessionResponse. */
                class GetRegistrationSessionResponse implements IGetRegistrationSessionResponse {

                    /**
                     * Constructs a new GetRegistrationSessionResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: isuxportal.proto.services.registration.IGetRegistrationSessionResponse);

                    /** GetRegistrationSessionResponse team. */
                    public team?: (isuxportal.proto.resources.ITeam|null);

                    /** GetRegistrationSessionResponse status. */
                    public status: isuxportal.proto.services.registration.GetRegistrationSessionResponse.Status;

                    /** GetRegistrationSessionResponse githubLogin. */
                    public githubLogin: string;

                    /** GetRegistrationSessionResponse githubAvatarUrl. */
                    public githubAvatarUrl: string;

                    /** GetRegistrationSessionResponse discordTag. */
                    public discordTag: string;

                    /** GetRegistrationSessionResponse discordAvatarUrl. */
                    public discordAvatarUrl: string;

                    /** GetRegistrationSessionResponse memberInviteUrl. */
                    public memberInviteUrl: string;

                    /** GetRegistrationSessionResponse discordServerId. */
                    public discordServerId: string;

                    /**
                     * Creates a new GetRegistrationSessionResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetRegistrationSessionResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IGetRegistrationSessionResponse): isuxportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Encodes the specified GetRegistrationSessionResponse message. Does not implicitly {@link isuxportal.proto.services.registration.GetRegistrationSessionResponse.verify|verify} messages.
                     * @param message GetRegistrationSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IGetRegistrationSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetRegistrationSessionResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.GetRegistrationSessionResponse.verify|verify} messages.
                     * @param message GetRegistrationSessionResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IGetRegistrationSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetRegistrationSessionResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetRegistrationSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Decodes a GetRegistrationSessionResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetRegistrationSessionResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.GetRegistrationSessionResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.GetRegistrationSessionResponse;

                    /**
                     * Creates a plain object from a GetRegistrationSessionResponse message. Also converts values to other types if specified.
                     * @param message GetRegistrationSessionResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.GetRegistrationSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IUpdateRegistrationRequest);

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
                    public static create(properties?: isuxportal.proto.services.registration.IUpdateRegistrationRequest): isuxportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Encodes the specified UpdateRegistrationRequest message. Does not implicitly {@link isuxportal.proto.services.registration.UpdateRegistrationRequest.verify|verify} messages.
                     * @param message UpdateRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IUpdateRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateRegistrationRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.UpdateRegistrationRequest.verify|verify} messages.
                     * @param message UpdateRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IUpdateRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateRegistrationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Decodes an UpdateRegistrationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.UpdateRegistrationRequest;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.UpdateRegistrationRequest;

                    /**
                     * Creates a plain object from an UpdateRegistrationRequest message. Also converts values to other types if specified.
                     * @param message UpdateRegistrationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.UpdateRegistrationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IUpdateRegistrationResponse);

                    /**
                     * Creates a new UpdateRegistrationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns UpdateRegistrationResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IUpdateRegistrationResponse): isuxportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Encodes the specified UpdateRegistrationResponse message. Does not implicitly {@link isuxportal.proto.services.registration.UpdateRegistrationResponse.verify|verify} messages.
                     * @param message UpdateRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IUpdateRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified UpdateRegistrationResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.UpdateRegistrationResponse.verify|verify} messages.
                     * @param message UpdateRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IUpdateRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an UpdateRegistrationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns UpdateRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Decodes an UpdateRegistrationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns UpdateRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.UpdateRegistrationResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.UpdateRegistrationResponse;

                    /**
                     * Creates a plain object from an UpdateRegistrationResponse message. Also converts values to other types if specified.
                     * @param message UpdateRegistrationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.UpdateRegistrationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IDeleteRegistrationRequest);

                    /**
                     * Creates a new DeleteRegistrationRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeleteRegistrationRequest instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IDeleteRegistrationRequest): isuxportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Encodes the specified DeleteRegistrationRequest message. Does not implicitly {@link isuxportal.proto.services.registration.DeleteRegistrationRequest.verify|verify} messages.
                     * @param message DeleteRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IDeleteRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeleteRegistrationRequest message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.DeleteRegistrationRequest.verify|verify} messages.
                     * @param message DeleteRegistrationRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IDeleteRegistrationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeleteRegistrationRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeleteRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Decodes a DeleteRegistrationRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeleteRegistrationRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.DeleteRegistrationRequest;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.DeleteRegistrationRequest;

                    /**
                     * Creates a plain object from a DeleteRegistrationRequest message. Also converts values to other types if specified.
                     * @param message DeleteRegistrationRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.DeleteRegistrationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                    constructor(properties?: isuxportal.proto.services.registration.IDeleteRegistrationResponse);

                    /**
                     * Creates a new DeleteRegistrationResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeleteRegistrationResponse instance
                     */
                    public static create(properties?: isuxportal.proto.services.registration.IDeleteRegistrationResponse): isuxportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Encodes the specified DeleteRegistrationResponse message. Does not implicitly {@link isuxportal.proto.services.registration.DeleteRegistrationResponse.verify|verify} messages.
                     * @param message DeleteRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: isuxportal.proto.services.registration.IDeleteRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeleteRegistrationResponse message, length delimited. Does not implicitly {@link isuxportal.proto.services.registration.DeleteRegistrationResponse.verify|verify} messages.
                     * @param message DeleteRegistrationResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: isuxportal.proto.services.registration.IDeleteRegistrationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeleteRegistrationResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeleteRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): isuxportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Decodes a DeleteRegistrationResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeleteRegistrationResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): isuxportal.proto.services.registration.DeleteRegistrationResponse;

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
                    public static fromObject(object: { [k: string]: any }): isuxportal.proto.services.registration.DeleteRegistrationResponse;

                    /**
                     * Creates a plain object from a DeleteRegistrationResponse message. Also converts values to other types if specified.
                     * @param message DeleteRegistrationResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: isuxportal.proto.services.registration.DeleteRegistrationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
