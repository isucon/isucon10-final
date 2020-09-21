/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.seconds = reader.int64();
                        break;
                    case 2:
                        message.nanos = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

$root.xsuportal = (function() {

    /**
     * Namespace xsuportal.
     * @exports xsuportal
     * @namespace
     */
    var xsuportal = {};

    xsuportal.proto = (function() {

        /**
         * Namespace proto.
         * @memberof xsuportal
         * @namespace
         */
        var proto = {};

        proto.resources = (function() {

            /**
             * Namespace resources.
             * @memberof xsuportal.proto
             * @namespace
             */
            var resources = {};

            resources.Notification = (function() {

                /**
                 * Properties of a Notification.
                 * @memberof xsuportal.proto.resources
                 * @interface INotification
                 * @property {number|Long|null} [id] Notification id
                 * @property {google.protobuf.ITimestamp|null} [createdAt] Notification createdAt
                 * @property {xsuportal.proto.resources.Notification.IBenchmarkJobMessage|null} [contentBenchmarkJob] Notification contentBenchmarkJob
                 * @property {xsuportal.proto.resources.Notification.IClarificationMessage|null} [contentClarification] Notification contentClarification
                 * @property {xsuportal.proto.resources.Notification.ITestMessage|null} [contentTest] Notification contentTest
                 */

                /**
                 * Constructs a new Notification.
                 * @memberof xsuportal.proto.resources
                 * @classdesc Represents a Notification.
                 * @implements INotification
                 * @constructor
                 * @param {xsuportal.proto.resources.INotification=} [properties] Properties to set
                 */
                function Notification(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Notification id.
                 * @member {number|Long} id
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Notification.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * Notification createdAt.
                 * @member {google.protobuf.ITimestamp|null|undefined} createdAt
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Notification.prototype.createdAt = null;

                /**
                 * Notification contentBenchmarkJob.
                 * @member {xsuportal.proto.resources.Notification.IBenchmarkJobMessage|null|undefined} contentBenchmarkJob
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Notification.prototype.contentBenchmarkJob = null;

                /**
                 * Notification contentClarification.
                 * @member {xsuportal.proto.resources.Notification.IClarificationMessage|null|undefined} contentClarification
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Notification.prototype.contentClarification = null;

                /**
                 * Notification contentTest.
                 * @member {xsuportal.proto.resources.Notification.ITestMessage|null|undefined} contentTest
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Notification.prototype.contentTest = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * Notification content.
                 * @member {"contentBenchmarkJob"|"contentClarification"|"contentTest"|undefined} content
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 */
                Object.defineProperty(Notification.prototype, "content", {
                    get: $util.oneOfGetter($oneOfFields = ["contentBenchmarkJob", "contentClarification", "contentTest"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Notification instance using the specified properties.
                 * @function create
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {xsuportal.proto.resources.INotification=} [properties] Properties to set
                 * @returns {xsuportal.proto.resources.Notification} Notification instance
                 */
                Notification.create = function create(properties) {
                    return new Notification(properties);
                };

                /**
                 * Encodes the specified Notification message. Does not implicitly {@link xsuportal.proto.resources.Notification.verify|verify} messages.
                 * @function encode
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {xsuportal.proto.resources.INotification} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Notification.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.id);
                    if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                        $root.google.protobuf.Timestamp.encode(message.createdAt, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.contentBenchmarkJob != null && Object.hasOwnProperty.call(message, "contentBenchmarkJob"))
                        $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage.encode(message.contentBenchmarkJob, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.contentClarification != null && Object.hasOwnProperty.call(message, "contentClarification"))
                        $root.xsuportal.proto.resources.Notification.ClarificationMessage.encode(message.contentClarification, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.contentTest != null && Object.hasOwnProperty.call(message, "contentTest"))
                        $root.xsuportal.proto.resources.Notification.TestMessage.encode(message.contentTest, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Notification message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {xsuportal.proto.resources.INotification} message Notification message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Notification.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Notification message from the specified reader or buffer.
                 * @function decode
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {xsuportal.proto.resources.Notification} Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Notification.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.xsuportal.proto.resources.Notification();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.int64();
                            break;
                        case 2:
                            message.createdAt = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                            break;
                        case 3:
                            message.contentBenchmarkJob = $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage.decode(reader, reader.uint32());
                            break;
                        case 4:
                            message.contentClarification = $root.xsuportal.proto.resources.Notification.ClarificationMessage.decode(reader, reader.uint32());
                            break;
                        case 5:
                            message.contentTest = $root.xsuportal.proto.resources.Notification.TestMessage.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Notification message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {xsuportal.proto.resources.Notification} Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Notification.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Notification message.
                 * @function verify
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Notification.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                            return "id: integer|Long expected";
                    if (message.createdAt != null && message.hasOwnProperty("createdAt")) {
                        var error = $root.google.protobuf.Timestamp.verify(message.createdAt);
                        if (error)
                            return "createdAt." + error;
                    }
                    if (message.contentBenchmarkJob != null && message.hasOwnProperty("contentBenchmarkJob")) {
                        properties.content = 1;
                        {
                            var error = $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage.verify(message.contentBenchmarkJob);
                            if (error)
                                return "contentBenchmarkJob." + error;
                        }
                    }
                    if (message.contentClarification != null && message.hasOwnProperty("contentClarification")) {
                        if (properties.content === 1)
                            return "content: multiple values";
                        properties.content = 1;
                        {
                            var error = $root.xsuportal.proto.resources.Notification.ClarificationMessage.verify(message.contentClarification);
                            if (error)
                                return "contentClarification." + error;
                        }
                    }
                    if (message.contentTest != null && message.hasOwnProperty("contentTest")) {
                        if (properties.content === 1)
                            return "content: multiple values";
                        properties.content = 1;
                        {
                            var error = $root.xsuportal.proto.resources.Notification.TestMessage.verify(message.contentTest);
                            if (error)
                                return "contentTest." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {xsuportal.proto.resources.Notification} Notification
                 */
                Notification.fromObject = function fromObject(object) {
                    if (object instanceof $root.xsuportal.proto.resources.Notification)
                        return object;
                    var message = new $root.xsuportal.proto.resources.Notification();
                    if (object.id != null)
                        if ($util.Long)
                            (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                        else if (typeof object.id === "string")
                            message.id = parseInt(object.id, 10);
                        else if (typeof object.id === "number")
                            message.id = object.id;
                        else if (typeof object.id === "object")
                            message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                    if (object.createdAt != null) {
                        if (typeof object.createdAt !== "object")
                            throw TypeError(".xsuportal.proto.resources.Notification.createdAt: object expected");
                        message.createdAt = $root.google.protobuf.Timestamp.fromObject(object.createdAt);
                    }
                    if (object.contentBenchmarkJob != null) {
                        if (typeof object.contentBenchmarkJob !== "object")
                            throw TypeError(".xsuportal.proto.resources.Notification.contentBenchmarkJob: object expected");
                        message.contentBenchmarkJob = $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage.fromObject(object.contentBenchmarkJob);
                    }
                    if (object.contentClarification != null) {
                        if (typeof object.contentClarification !== "object")
                            throw TypeError(".xsuportal.proto.resources.Notification.contentClarification: object expected");
                        message.contentClarification = $root.xsuportal.proto.resources.Notification.ClarificationMessage.fromObject(object.contentClarification);
                    }
                    if (object.contentTest != null) {
                        if (typeof object.contentTest !== "object")
                            throw TypeError(".xsuportal.proto.resources.Notification.contentTest: object expected");
                        message.contentTest = $root.xsuportal.proto.resources.Notification.TestMessage.fromObject(object.contentTest);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Notification message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof xsuportal.proto.resources.Notification
                 * @static
                 * @param {xsuportal.proto.resources.Notification} message Notification
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Notification.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.id = options.longs === String ? "0" : 0;
                        object.createdAt = null;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (typeof message.id === "number")
                            object.id = options.longs === String ? String(message.id) : message.id;
                        else
                            object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        object.createdAt = $root.google.protobuf.Timestamp.toObject(message.createdAt, options);
                    if (message.contentBenchmarkJob != null && message.hasOwnProperty("contentBenchmarkJob")) {
                        object.contentBenchmarkJob = $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage.toObject(message.contentBenchmarkJob, options);
                        if (options.oneofs)
                            object.content = "contentBenchmarkJob";
                    }
                    if (message.contentClarification != null && message.hasOwnProperty("contentClarification")) {
                        object.contentClarification = $root.xsuportal.proto.resources.Notification.ClarificationMessage.toObject(message.contentClarification, options);
                        if (options.oneofs)
                            object.content = "contentClarification";
                    }
                    if (message.contentTest != null && message.hasOwnProperty("contentTest")) {
                        object.contentTest = $root.xsuportal.proto.resources.Notification.TestMessage.toObject(message.contentTest, options);
                        if (options.oneofs)
                            object.content = "contentTest";
                    }
                    return object;
                };

                /**
                 * Converts this Notification to JSON.
                 * @function toJSON
                 * @memberof xsuportal.proto.resources.Notification
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Notification.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                Notification.BenchmarkJobMessage = (function() {

                    /**
                     * Properties of a BenchmarkJobMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @interface IBenchmarkJobMessage
                     * @property {number|Long|null} [benchmarkJobId] BenchmarkJobMessage benchmarkJobId
                     */

                    /**
                     * Constructs a new BenchmarkJobMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @classdesc Represents a BenchmarkJobMessage.
                     * @implements IBenchmarkJobMessage
                     * @constructor
                     * @param {xsuportal.proto.resources.Notification.IBenchmarkJobMessage=} [properties] Properties to set
                     */
                    function BenchmarkJobMessage(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * BenchmarkJobMessage benchmarkJobId.
                     * @member {number|Long} benchmarkJobId
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @instance
                     */
                    BenchmarkJobMessage.prototype.benchmarkJobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new BenchmarkJobMessage instance using the specified properties.
                     * @function create
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IBenchmarkJobMessage=} [properties] Properties to set
                     * @returns {xsuportal.proto.resources.Notification.BenchmarkJobMessage} BenchmarkJobMessage instance
                     */
                    BenchmarkJobMessage.create = function create(properties) {
                        return new BenchmarkJobMessage(properties);
                    };

                    /**
                     * Encodes the specified BenchmarkJobMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.BenchmarkJobMessage.verify|verify} messages.
                     * @function encode
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IBenchmarkJobMessage} message BenchmarkJobMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BenchmarkJobMessage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.benchmarkJobId != null && Object.hasOwnProperty.call(message, "benchmarkJobId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.benchmarkJobId);
                        return writer;
                    };

                    /**
                     * Encodes the specified BenchmarkJobMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.BenchmarkJobMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IBenchmarkJobMessage} message BenchmarkJobMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BenchmarkJobMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a BenchmarkJobMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {xsuportal.proto.resources.Notification.BenchmarkJobMessage} BenchmarkJobMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BenchmarkJobMessage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.benchmarkJobId = reader.int64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a BenchmarkJobMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {xsuportal.proto.resources.Notification.BenchmarkJobMessage} BenchmarkJobMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BenchmarkJobMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a BenchmarkJobMessage message.
                     * @function verify
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    BenchmarkJobMessage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.benchmarkJobId != null && message.hasOwnProperty("benchmarkJobId"))
                            if (!$util.isInteger(message.benchmarkJobId) && !(message.benchmarkJobId && $util.isInteger(message.benchmarkJobId.low) && $util.isInteger(message.benchmarkJobId.high)))
                                return "benchmarkJobId: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a BenchmarkJobMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {xsuportal.proto.resources.Notification.BenchmarkJobMessage} BenchmarkJobMessage
                     */
                    BenchmarkJobMessage.fromObject = function fromObject(object) {
                        if (object instanceof $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage)
                            return object;
                        var message = new $root.xsuportal.proto.resources.Notification.BenchmarkJobMessage();
                        if (object.benchmarkJobId != null)
                            if ($util.Long)
                                (message.benchmarkJobId = $util.Long.fromValue(object.benchmarkJobId)).unsigned = false;
                            else if (typeof object.benchmarkJobId === "string")
                                message.benchmarkJobId = parseInt(object.benchmarkJobId, 10);
                            else if (typeof object.benchmarkJobId === "number")
                                message.benchmarkJobId = object.benchmarkJobId;
                            else if (typeof object.benchmarkJobId === "object")
                                message.benchmarkJobId = new $util.LongBits(object.benchmarkJobId.low >>> 0, object.benchmarkJobId.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a BenchmarkJobMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.BenchmarkJobMessage} message BenchmarkJobMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    BenchmarkJobMessage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.benchmarkJobId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.benchmarkJobId = options.longs === String ? "0" : 0;
                        if (message.benchmarkJobId != null && message.hasOwnProperty("benchmarkJobId"))
                            if (typeof message.benchmarkJobId === "number")
                                object.benchmarkJobId = options.longs === String ? String(message.benchmarkJobId) : message.benchmarkJobId;
                            else
                                object.benchmarkJobId = options.longs === String ? $util.Long.prototype.toString.call(message.benchmarkJobId) : options.longs === Number ? new $util.LongBits(message.benchmarkJobId.low >>> 0, message.benchmarkJobId.high >>> 0).toNumber() : message.benchmarkJobId;
                        return object;
                    };

                    /**
                     * Converts this BenchmarkJobMessage to JSON.
                     * @function toJSON
                     * @memberof xsuportal.proto.resources.Notification.BenchmarkJobMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    BenchmarkJobMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return BenchmarkJobMessage;
                })();

                Notification.ClarificationMessage = (function() {

                    /**
                     * Properties of a ClarificationMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @interface IClarificationMessage
                     * @property {number|Long|null} [clarificationId] ClarificationMessage clarificationId
                     * @property {boolean|null} [owned] ClarificationMessage owned
                     * @property {boolean|null} [updated] ClarificationMessage updated
                     */

                    /**
                     * Constructs a new ClarificationMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @classdesc Represents a ClarificationMessage.
                     * @implements IClarificationMessage
                     * @constructor
                     * @param {xsuportal.proto.resources.Notification.IClarificationMessage=} [properties] Properties to set
                     */
                    function ClarificationMessage(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ClarificationMessage clarificationId.
                     * @member {number|Long} clarificationId
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @instance
                     */
                    ClarificationMessage.prototype.clarificationId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * ClarificationMessage owned.
                     * @member {boolean} owned
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @instance
                     */
                    ClarificationMessage.prototype.owned = false;

                    /**
                     * ClarificationMessage updated.
                     * @member {boolean} updated
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @instance
                     */
                    ClarificationMessage.prototype.updated = false;

                    /**
                     * Creates a new ClarificationMessage instance using the specified properties.
                     * @function create
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IClarificationMessage=} [properties] Properties to set
                     * @returns {xsuportal.proto.resources.Notification.ClarificationMessage} ClarificationMessage instance
                     */
                    ClarificationMessage.create = function create(properties) {
                        return new ClarificationMessage(properties);
                    };

                    /**
                     * Encodes the specified ClarificationMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.ClarificationMessage.verify|verify} messages.
                     * @function encode
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IClarificationMessage} message ClarificationMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClarificationMessage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.clarificationId != null && Object.hasOwnProperty.call(message, "clarificationId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.clarificationId);
                        if (message.owned != null && Object.hasOwnProperty.call(message, "owned"))
                            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.owned);
                        if (message.updated != null && Object.hasOwnProperty.call(message, "updated"))
                            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.updated);
                        return writer;
                    };

                    /**
                     * Encodes the specified ClarificationMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.ClarificationMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.IClarificationMessage} message ClarificationMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ClarificationMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ClarificationMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {xsuportal.proto.resources.Notification.ClarificationMessage} ClarificationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClarificationMessage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.xsuportal.proto.resources.Notification.ClarificationMessage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.clarificationId = reader.int64();
                                break;
                            case 2:
                                message.owned = reader.bool();
                                break;
                            case 3:
                                message.updated = reader.bool();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ClarificationMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {xsuportal.proto.resources.Notification.ClarificationMessage} ClarificationMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ClarificationMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ClarificationMessage message.
                     * @function verify
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ClarificationMessage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.clarificationId != null && message.hasOwnProperty("clarificationId"))
                            if (!$util.isInteger(message.clarificationId) && !(message.clarificationId && $util.isInteger(message.clarificationId.low) && $util.isInteger(message.clarificationId.high)))
                                return "clarificationId: integer|Long expected";
                        if (message.owned != null && message.hasOwnProperty("owned"))
                            if (typeof message.owned !== "boolean")
                                return "owned: boolean expected";
                        if (message.updated != null && message.hasOwnProperty("updated"))
                            if (typeof message.updated !== "boolean")
                                return "updated: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a ClarificationMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {xsuportal.proto.resources.Notification.ClarificationMessage} ClarificationMessage
                     */
                    ClarificationMessage.fromObject = function fromObject(object) {
                        if (object instanceof $root.xsuportal.proto.resources.Notification.ClarificationMessage)
                            return object;
                        var message = new $root.xsuportal.proto.resources.Notification.ClarificationMessage();
                        if (object.clarificationId != null)
                            if ($util.Long)
                                (message.clarificationId = $util.Long.fromValue(object.clarificationId)).unsigned = false;
                            else if (typeof object.clarificationId === "string")
                                message.clarificationId = parseInt(object.clarificationId, 10);
                            else if (typeof object.clarificationId === "number")
                                message.clarificationId = object.clarificationId;
                            else if (typeof object.clarificationId === "object")
                                message.clarificationId = new $util.LongBits(object.clarificationId.low >>> 0, object.clarificationId.high >>> 0).toNumber();
                        if (object.owned != null)
                            message.owned = Boolean(object.owned);
                        if (object.updated != null)
                            message.updated = Boolean(object.updated);
                        return message;
                    };

                    /**
                     * Creates a plain object from a ClarificationMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.ClarificationMessage} message ClarificationMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ClarificationMessage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.clarificationId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.clarificationId = options.longs === String ? "0" : 0;
                            object.owned = false;
                            object.updated = false;
                        }
                        if (message.clarificationId != null && message.hasOwnProperty("clarificationId"))
                            if (typeof message.clarificationId === "number")
                                object.clarificationId = options.longs === String ? String(message.clarificationId) : message.clarificationId;
                            else
                                object.clarificationId = options.longs === String ? $util.Long.prototype.toString.call(message.clarificationId) : options.longs === Number ? new $util.LongBits(message.clarificationId.low >>> 0, message.clarificationId.high >>> 0).toNumber() : message.clarificationId;
                        if (message.owned != null && message.hasOwnProperty("owned"))
                            object.owned = message.owned;
                        if (message.updated != null && message.hasOwnProperty("updated"))
                            object.updated = message.updated;
                        return object;
                    };

                    /**
                     * Converts this ClarificationMessage to JSON.
                     * @function toJSON
                     * @memberof xsuportal.proto.resources.Notification.ClarificationMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ClarificationMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ClarificationMessage;
                })();

                Notification.TestMessage = (function() {

                    /**
                     * Properties of a TestMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @interface ITestMessage
                     * @property {number|Long|null} [something] TestMessage something
                     */

                    /**
                     * Constructs a new TestMessage.
                     * @memberof xsuportal.proto.resources.Notification
                     * @classdesc Represents a TestMessage.
                     * @implements ITestMessage
                     * @constructor
                     * @param {xsuportal.proto.resources.Notification.ITestMessage=} [properties] Properties to set
                     */
                    function TestMessage(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * TestMessage something.
                     * @member {number|Long} something
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @instance
                     */
                    TestMessage.prototype.something = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new TestMessage instance using the specified properties.
                     * @function create
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.ITestMessage=} [properties] Properties to set
                     * @returns {xsuportal.proto.resources.Notification.TestMessage} TestMessage instance
                     */
                    TestMessage.create = function create(properties) {
                        return new TestMessage(properties);
                    };

                    /**
                     * Encodes the specified TestMessage message. Does not implicitly {@link xsuportal.proto.resources.Notification.TestMessage.verify|verify} messages.
                     * @function encode
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.ITestMessage} message TestMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestMessage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.something != null && Object.hasOwnProperty.call(message, "something"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.something);
                        return writer;
                    };

                    /**
                     * Encodes the specified TestMessage message, length delimited. Does not implicitly {@link xsuportal.proto.resources.Notification.TestMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.ITestMessage} message TestMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a TestMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {xsuportal.proto.resources.Notification.TestMessage} TestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestMessage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.xsuportal.proto.resources.Notification.TestMessage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.something = reader.int64();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a TestMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {xsuportal.proto.resources.Notification.TestMessage} TestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TestMessage message.
                     * @function verify
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TestMessage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.something != null && message.hasOwnProperty("something"))
                            if (!$util.isInteger(message.something) && !(message.something && $util.isInteger(message.something.low) && $util.isInteger(message.something.high)))
                                return "something: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a TestMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {xsuportal.proto.resources.Notification.TestMessage} TestMessage
                     */
                    TestMessage.fromObject = function fromObject(object) {
                        if (object instanceof $root.xsuportal.proto.resources.Notification.TestMessage)
                            return object;
                        var message = new $root.xsuportal.proto.resources.Notification.TestMessage();
                        if (object.something != null)
                            if ($util.Long)
                                (message.something = $util.Long.fromValue(object.something)).unsigned = false;
                            else if (typeof object.something === "string")
                                message.something = parseInt(object.something, 10);
                            else if (typeof object.something === "number")
                                message.something = object.something;
                            else if (typeof object.something === "object")
                                message.something = new $util.LongBits(object.something.low >>> 0, object.something.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a TestMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @static
                     * @param {xsuportal.proto.resources.Notification.TestMessage} message TestMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TestMessage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.something = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.something = options.longs === String ? "0" : 0;
                        if (message.something != null && message.hasOwnProperty("something"))
                            if (typeof message.something === "number")
                                object.something = options.longs === String ? String(message.something) : message.something;
                            else
                                object.something = options.longs === String ? $util.Long.prototype.toString.call(message.something) : options.longs === Number ? new $util.LongBits(message.something.low >>> 0, message.something.high >>> 0).toNumber() : message.something;
                        return object;
                    };

                    /**
                     * Converts this TestMessage to JSON.
                     * @function toJSON
                     * @memberof xsuportal.proto.resources.Notification.TestMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TestMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return TestMessage;
                })();

                return Notification;
            })();

            return resources;
        })();

        return proto;
    })();

    return xsuportal;
})();

module.exports = $root;
