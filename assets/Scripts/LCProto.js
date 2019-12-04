/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function ($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

    $root.LCProto = window["LCProto"] = (function () {

        /**
         * Namespace LCProto.
         * @exports LCProto
         * @namespace
         */
        var LCProto = {};

        LCProto.User = (function () {

            /**
             * Properties of a User.
             * @memberof LCProto
             * @interface IUser
             * @property {string|null} [name] User name
             * @property {string|null} [avatar] User avatar
             * @property {boolean|null} [isAI] User isAI
             */

            /**
             * Constructs a new User.
             * @memberof LCProto
             * @classdesc Represents a User.
             * @implements IUser
             * @constructor
             * @param {LCProto.IUser=} [properties] Properties to set
             */
            function User(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * User name.
             * @member {string} name
             * @memberof LCProto.User
             * @instance
             */
            User.prototype.name = "";

            /**
             * User avatar.
             * @member {string} avatar
             * @memberof LCProto.User
             * @instance
             */
            User.prototype.avatar = "";

            /**
             * User isAI.
             * @member {boolean} isAI
             * @memberof LCProto.User
             * @instance
             */
            User.prototype.isAI = false;

            /**
             * Creates a new User instance using the specified properties.
             * @function create
             * @memberof LCProto.User
             * @static
             * @param {LCProto.IUser=} [properties] Properties to set
             * @returns {LCProto.User} User instance
             */
            User.create = function create(properties) {
                return new User(properties);
            };

            /**
             * Encodes the specified User message. Does not implicitly {@link LCProto.User.verify|verify} messages.
             * @function encode
             * @memberof LCProto.User
             * @static
             * @param {LCProto.IUser} message User message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            User.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.avatar);
                if (message.isAI != null && Object.hasOwnProperty.call(message, "isAI"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isAI);
                return writer;
            };

            /**
             * Encodes the specified User message, length delimited. Does not implicitly {@link LCProto.User.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.User
             * @static
             * @param {LCProto.IUser} message User message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            User.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a User message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.User} User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            User.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.User();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.avatar = reader.string();
                            break;
                        case 3:
                            message.isAI = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a User message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.User} User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            User.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a User message.
             * @function verify
             * @memberof LCProto.User
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            User.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    if (!$util.isString(message.avatar))
                        return "avatar: string expected";
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    if (typeof message.isAI !== "boolean")
                        return "isAI: boolean expected";
                return null;
            };

            /**
             * Creates a User message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.User
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.User} User
             */
            User.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.User)
                    return object;
                var message = new $root.LCProto.User();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.avatar != null)
                    message.avatar = String(object.avatar);
                if (object.isAI != null)
                    message.isAI = Boolean(object.isAI);
                return message;
            };

            /**
             * Creates a plain object from a User message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.User
             * @static
             * @param {LCProto.User} message User
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            User.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.avatar = "";
                    object.isAI = false;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    object.avatar = message.avatar;
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    object.isAI = message.isAI;
                return object;
            };

            /**
             * Converts this User to JSON.
             * @function toJSON
             * @memberof LCProto.User
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            User.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return User;
        })();

        LCProto.Action = (function () {

            /**
             * Properties of an Action.
             * @memberof LCProto
             * @interface IAction
             * @property {LCProto.ActionID|null} [ID] Action ID
             * @property {number|null} [index] Action index
             * @property {Uint8Array|null} [data] Action data
             */

            /**
             * Constructs a new Action.
             * @memberof LCProto
             * @classdesc Represents an Action.
             * @implements IAction
             * @constructor
             * @param {LCProto.IAction=} [properties] Properties to set
             */
            function Action(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Action ID.
             * @member {LCProto.ActionID} ID
             * @memberof LCProto.Action
             * @instance
             */
            Action.prototype.ID = 0;

            /**
             * Action index.
             * @member {number} index
             * @memberof LCProto.Action
             * @instance
             */
            Action.prototype.index = 0;

            /**
             * Action data.
             * @member {Uint8Array} data
             * @memberof LCProto.Action
             * @instance
             */
            Action.prototype.data = $util.newBuffer([]);

            /**
             * Creates a new Action instance using the specified properties.
             * @function create
             * @memberof LCProto.Action
             * @static
             * @param {LCProto.IAction=} [properties] Properties to set
             * @returns {LCProto.Action} Action instance
             */
            Action.create = function create(properties) {
                return new Action(properties);
            };

            /**
             * Encodes the specified Action message. Does not implicitly {@link LCProto.Action.verify|verify} messages.
             * @function encode
             * @memberof LCProto.Action
             * @static
             * @param {LCProto.IAction} message Action message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Action.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.ID);
                if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.index);
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
                return writer;
            };

            /**
             * Encodes the specified Action message, length delimited. Does not implicitly {@link LCProto.Action.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.Action
             * @static
             * @param {LCProto.IAction} message Action message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Action.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Action message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.Action
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.Action} Action
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Action.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.Action();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.ID = reader.int32();
                            break;
                        case 2:
                            message.index = reader.int32();
                            break;
                        case 3:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Action message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.Action
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.Action} Action
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Action.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Action message.
             * @function verify
             * @memberof LCProto.Action
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Action.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.ID != null && message.hasOwnProperty("ID"))
                    switch (message.ID) {
                        default:
                            return "ID: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 101:
                        case 102:
                        case 103:
                        case 104:
                        case 201:
                        case 202:
                        case 203:
                        case 204:
                        case 301:
                        case 302:
                            break;
                    }
                if (message.index != null && message.hasOwnProperty("index"))
                    if (!$util.isInteger(message.index))
                        return "index: integer expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                        return "data: buffer expected";
                return null;
            };

            /**
             * Creates an Action message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.Action
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.Action} Action
             */
            Action.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.Action)
                    return object;
                var message = new $root.LCProto.Action();
                switch (object.ID) {
                    case "ActionIDNone":
                    case 0:
                        message.ID = 0;
                        break;
                    case "ActionIDPing":
                    case 1:
                        message.ID = 1;
                        break;
                    case "ActionIDPong":
                    case 2:
                        message.ID = 2;
                        break;
                    case "ActionIDCheck":
                    case 3:
                        message.ID = 3;
                        break;
                    case "ActionIDRecovery":
                    case 4:
                        message.ID = 4;
                        break;
                    case "ActionIDError":
                    case 5:
                        message.ID = 5;
                        break;
                    case "ActionIDReady":
                    case 101:
                        message.ID = 101;
                        break;
                    case "ActionIDResult":
                    case 102:
                        message.ID = 102;
                        break;
                    case "ActionIDExit":
                    case 103:
                        message.ID = 103;
                        break;
                    case "ActionIDFinish":
                    case 104:
                        message.ID = 104;
                        break;
                    case "ActionIDCreate":
                    case 201:
                        message.ID = 201;
                        break;
                    case "ActionIDStart":
                    case 202:
                        message.ID = 202;
                        break;
                    case "ActionIDCountDown":
                    case 203:
                        message.ID = 203;
                        break;
                    case "ActionIDEnd":
                    case 204:
                        message.ID = 204;
                        break;
                    case "ActionIDScore":
                    case 301:
                        message.ID = 301;
                        break;
                    case "ActionIDTool":
                    case 302:
                        message.ID = 302;
                        break;
                }
                if (object.index != null)
                    message.index = object.index | 0;
                if (object.data != null)
                    if (typeof object.data === "string")
                        $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                    else if (object.data.length)
                        message.data = object.data;
                return message;
            };

            /**
             * Creates a plain object from an Action message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.Action
             * @static
             * @param {LCProto.Action} message Action
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Action.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.ID = options.enums === String ? "ActionIDNone" : 0;
                    object.index = 0;
                    if (options.bytes === String)
                        object.data = "";
                    else {
                        object.data = [];
                        if (options.bytes !== Array)
                            object.data = $util.newBuffer(object.data);
                    }
                }
                if (message.ID != null && message.hasOwnProperty("ID"))
                    object.ID = options.enums === String ? $root.LCProto.ActionID[message.ID] : message.ID;
                if (message.index != null && message.hasOwnProperty("index"))
                    object.index = message.index;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                return object;
            };

            /**
             * Converts this Action to JSON.
             * @function toJSON
             * @memberof LCProto.Action
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Action.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Action;
        })();

        /**
         * ActionID enum.
         * @name LCProto.ActionID
         * @enum {string}
         * @property {number} ActionIDNone=0 ActionIDNone value
         * @property {number} ActionIDPing=1 ActionIDPing value
         * @property {number} ActionIDPong=2 ActionIDPong value
         * @property {number} ActionIDCheck=3 ActionIDCheck value
         * @property {number} ActionIDRecovery=4 ActionIDRecovery value
         * @property {number} ActionIDError=5 ActionIDError value
         * @property {number} ActionIDReady=101 ActionIDReady value
         * @property {number} ActionIDResult=102 ActionIDResult value
         * @property {number} ActionIDExit=103 ActionIDExit value
         * @property {number} ActionIDFinish=104 ActionIDFinish value
         * @property {number} ActionIDCreate=201 ActionIDCreate value
         * @property {number} ActionIDStart=202 ActionIDStart value
         * @property {number} ActionIDCountDown=203 ActionIDCountDown value
         * @property {number} ActionIDEnd=204 ActionIDEnd value
         * @property {number} ActionIDScore=301 ActionIDScore value
         * @property {number} ActionIDTool=302 ActionIDTool value
         */
        LCProto.ActionID = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ActionIDNone"] = 0;
            values[valuesById[1] = "ActionIDPing"] = 1;
            values[valuesById[2] = "ActionIDPong"] = 2;
            values[valuesById[3] = "ActionIDCheck"] = 3;
            values[valuesById[4] = "ActionIDRecovery"] = 4;
            values[valuesById[5] = "ActionIDError"] = 5;
            values[valuesById[101] = "ActionIDReady"] = 101;
            values[valuesById[102] = "ActionIDResult"] = 102;
            values[valuesById[103] = "ActionIDExit"] = 103;
            values[valuesById[104] = "ActionIDFinish"] = 104;
            values[valuesById[201] = "ActionIDCreate"] = 201;
            values[valuesById[202] = "ActionIDStart"] = 202;
            values[valuesById[203] = "ActionIDCountDown"] = 203;
            values[valuesById[204] = "ActionIDEnd"] = 204;
            values[valuesById[301] = "ActionIDScore"] = 301;
            values[valuesById[302] = "ActionIDTool"] = 302;
            return values;
        })();

        LCProto.DataCheck = (function () {

            /**
             * Properties of a DataCheck.
             * @memberof LCProto
             * @interface IDataCheck
             * @property {number|null} [recvIndex] DataCheck recvIndex
             * @property {number|null} [sendIndex] DataCheck sendIndex
             */

            /**
             * Constructs a new DataCheck.
             * @memberof LCProto
             * @classdesc Represents a DataCheck.
             * @implements IDataCheck
             * @constructor
             * @param {LCProto.IDataCheck=} [properties] Properties to set
             */
            function DataCheck(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataCheck recvIndex.
             * @member {number} recvIndex
             * @memberof LCProto.DataCheck
             * @instance
             */
            DataCheck.prototype.recvIndex = 0;

            /**
             * DataCheck sendIndex.
             * @member {number} sendIndex
             * @memberof LCProto.DataCheck
             * @instance
             */
            DataCheck.prototype.sendIndex = 0;

            /**
             * Creates a new DataCheck instance using the specified properties.
             * @function create
             * @memberof LCProto.DataCheck
             * @static
             * @param {LCProto.IDataCheck=} [properties] Properties to set
             * @returns {LCProto.DataCheck} DataCheck instance
             */
            DataCheck.create = function create(properties) {
                return new DataCheck(properties);
            };

            /**
             * Encodes the specified DataCheck message. Does not implicitly {@link LCProto.DataCheck.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataCheck
             * @static
             * @param {LCProto.IDataCheck} message DataCheck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCheck.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.recvIndex != null && Object.hasOwnProperty.call(message, "recvIndex"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.recvIndex);
                if (message.sendIndex != null && Object.hasOwnProperty.call(message, "sendIndex"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.sendIndex);
                return writer;
            };

            /**
             * Encodes the specified DataCheck message, length delimited. Does not implicitly {@link LCProto.DataCheck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataCheck
             * @static
             * @param {LCProto.IDataCheck} message DataCheck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCheck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataCheck message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataCheck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataCheck} DataCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCheck.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataCheck();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.recvIndex = reader.int32();
                            break;
                        case 2:
                            message.sendIndex = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataCheck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataCheck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataCheck} DataCheck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCheck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataCheck message.
             * @function verify
             * @memberof LCProto.DataCheck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataCheck.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.recvIndex != null && message.hasOwnProperty("recvIndex"))
                    if (!$util.isInteger(message.recvIndex))
                        return "recvIndex: integer expected";
                if (message.sendIndex != null && message.hasOwnProperty("sendIndex"))
                    if (!$util.isInteger(message.sendIndex))
                        return "sendIndex: integer expected";
                return null;
            };

            /**
             * Creates a DataCheck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataCheck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataCheck} DataCheck
             */
            DataCheck.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataCheck)
                    return object;
                var message = new $root.LCProto.DataCheck();
                if (object.recvIndex != null)
                    message.recvIndex = object.recvIndex | 0;
                if (object.sendIndex != null)
                    message.sendIndex = object.sendIndex | 0;
                return message;
            };

            /**
             * Creates a plain object from a DataCheck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataCheck
             * @static
             * @param {LCProto.DataCheck} message DataCheck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataCheck.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.recvIndex = 0;
                    object.sendIndex = 0;
                }
                if (message.recvIndex != null && message.hasOwnProperty("recvIndex"))
                    object.recvIndex = message.recvIndex;
                if (message.sendIndex != null && message.hasOwnProperty("sendIndex"))
                    object.sendIndex = message.sendIndex;
                return object;
            };

            /**
             * Converts this DataCheck to JSON.
             * @function toJSON
             * @memberof LCProto.DataCheck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataCheck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataCheck;
        })();

        LCProto.DataRecovery = (function () {

            /**
             * Properties of a DataRecovery.
             * @memberof LCProto
             * @interface IDataRecovery
             * @property {Array.<LCProto.IAction>|null} [actions] DataRecovery actions
             */

            /**
             * Constructs a new DataRecovery.
             * @memberof LCProto
             * @classdesc Represents a DataRecovery.
             * @implements IDataRecovery
             * @constructor
             * @param {LCProto.IDataRecovery=} [properties] Properties to set
             */
            function DataRecovery(properties) {
                this.actions = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataRecovery actions.
             * @member {Array.<LCProto.IAction>} actions
             * @memberof LCProto.DataRecovery
             * @instance
             */
            DataRecovery.prototype.actions = $util.emptyArray;

            /**
             * Creates a new DataRecovery instance using the specified properties.
             * @function create
             * @memberof LCProto.DataRecovery
             * @static
             * @param {LCProto.IDataRecovery=} [properties] Properties to set
             * @returns {LCProto.DataRecovery} DataRecovery instance
             */
            DataRecovery.create = function create(properties) {
                return new DataRecovery(properties);
            };

            /**
             * Encodes the specified DataRecovery message. Does not implicitly {@link LCProto.DataRecovery.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataRecovery
             * @static
             * @param {LCProto.IDataRecovery} message DataRecovery message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataRecovery.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.actions != null && message.actions.length)
                    for (var i = 0; i < message.actions.length; ++i)
                        $root.LCProto.Action.encode(message.actions[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DataRecovery message, length delimited. Does not implicitly {@link LCProto.DataRecovery.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataRecovery
             * @static
             * @param {LCProto.IDataRecovery} message DataRecovery message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataRecovery.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataRecovery message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataRecovery
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataRecovery} DataRecovery
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataRecovery.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataRecovery();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 3:
                            if (!(message.actions && message.actions.length))
                                message.actions = [];
                            message.actions.push($root.LCProto.Action.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataRecovery message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataRecovery
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataRecovery} DataRecovery
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataRecovery.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataRecovery message.
             * @function verify
             * @memberof LCProto.DataRecovery
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataRecovery.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.actions != null && message.hasOwnProperty("actions")) {
                    if (!Array.isArray(message.actions))
                        return "actions: array expected";
                    for (var i = 0; i < message.actions.length; ++i) {
                        var error = $root.LCProto.Action.verify(message.actions[i]);
                        if (error)
                            return "actions." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a DataRecovery message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataRecovery
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataRecovery} DataRecovery
             */
            DataRecovery.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataRecovery)
                    return object;
                var message = new $root.LCProto.DataRecovery();
                if (object.actions) {
                    if (!Array.isArray(object.actions))
                        throw TypeError(".LCProto.DataRecovery.actions: array expected");
                    message.actions = [];
                    for (var i = 0; i < object.actions.length; ++i) {
                        if (typeof object.actions[i] !== "object")
                            throw TypeError(".LCProto.DataRecovery.actions: object expected");
                        message.actions[i] = $root.LCProto.Action.fromObject(object.actions[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a DataRecovery message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataRecovery
             * @static
             * @param {LCProto.DataRecovery} message DataRecovery
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataRecovery.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.actions = [];
                if (message.actions && message.actions.length) {
                    object.actions = [];
                    for (var j = 0; j < message.actions.length; ++j)
                        object.actions[j] = $root.LCProto.Action.toObject(message.actions[j], options);
                }
                return object;
            };

            /**
             * Converts this DataRecovery to JSON.
             * @function toJSON
             * @memberof LCProto.DataRecovery
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataRecovery.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataRecovery;
        })();

        LCProto.DataCreate = (function () {

            /**
             * Properties of a DataCreate.
             * @memberof LCProto
             * @interface IDataCreate
             * @property {LCProto.IUser|null} [you] DataCreate you
             * @property {LCProto.IUser|null} [opponent] DataCreate opponent
             * @property {number|null} [seed] DataCreate seed
             * @property {number|null} [id] DataCreate id
             */

            /**
             * Constructs a new DataCreate.
             * @memberof LCProto
             * @classdesc Represents a DataCreate.
             * @implements IDataCreate
             * @constructor
             * @param {LCProto.IDataCreate=} [properties] Properties to set
             */
            function DataCreate(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataCreate you.
             * @member {LCProto.IUser|null|undefined} you
             * @memberof LCProto.DataCreate
             * @instance
             */
            DataCreate.prototype.you = null;

            /**
             * DataCreate opponent.
             * @member {LCProto.IUser|null|undefined} opponent
             * @memberof LCProto.DataCreate
             * @instance
             */
            DataCreate.prototype.opponent = null;

            /**
             * DataCreate seed.
             * @member {number} seed
             * @memberof LCProto.DataCreate
             * @instance
             */
            DataCreate.prototype.seed = 0;

            /**
             * DataCreate id.
             * @member {number} id
             * @memberof LCProto.DataCreate
             * @instance
             */
            DataCreate.prototype.id = 0;

            /**
             * Creates a new DataCreate instance using the specified properties.
             * @function create
             * @memberof LCProto.DataCreate
             * @static
             * @param {LCProto.IDataCreate=} [properties] Properties to set
             * @returns {LCProto.DataCreate} DataCreate instance
             */
            DataCreate.create = function create(properties) {
                return new DataCreate(properties);
            };

            /**
             * Encodes the specified DataCreate message. Does not implicitly {@link LCProto.DataCreate.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataCreate
             * @static
             * @param {LCProto.IDataCreate} message DataCreate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCreate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.you != null && Object.hasOwnProperty.call(message, "you"))
                    $root.LCProto.User.encode(message.you, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.opponent != null && Object.hasOwnProperty.call(message, "opponent"))
                    $root.LCProto.User.encode(message.opponent, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.seed);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.id);
                return writer;
            };

            /**
             * Encodes the specified DataCreate message, length delimited. Does not implicitly {@link LCProto.DataCreate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataCreate
             * @static
             * @param {LCProto.IDataCreate} message DataCreate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCreate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataCreate message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataCreate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataCreate} DataCreate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCreate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataCreate();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.you = $root.LCProto.User.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.opponent = $root.LCProto.User.decode(reader, reader.uint32());
                            break;
                        case 3:
                            message.seed = reader.int32();
                            break;
                        case 4:
                            message.id = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataCreate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataCreate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataCreate} DataCreate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCreate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataCreate message.
             * @function verify
             * @memberof LCProto.DataCreate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataCreate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.you != null && message.hasOwnProperty("you")) {
                    var error = $root.LCProto.User.verify(message.you);
                    if (error)
                        return "you." + error;
                }
                if (message.opponent != null && message.hasOwnProperty("opponent")) {
                    var error = $root.LCProto.User.verify(message.opponent);
                    if (error)
                        return "opponent." + error;
                }
                if (message.seed != null && message.hasOwnProperty("seed"))
                    if (!$util.isInteger(message.seed))
                        return "seed: integer expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a DataCreate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataCreate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataCreate} DataCreate
             */
            DataCreate.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataCreate)
                    return object;
                var message = new $root.LCProto.DataCreate();
                if (object.you != null) {
                    if (typeof object.you !== "object")
                        throw TypeError(".LCProto.DataCreate.you: object expected");
                    message.you = $root.LCProto.User.fromObject(object.you);
                }
                if (object.opponent != null) {
                    if (typeof object.opponent !== "object")
                        throw TypeError(".LCProto.DataCreate.opponent: object expected");
                    message.opponent = $root.LCProto.User.fromObject(object.opponent);
                }
                if (object.seed != null)
                    message.seed = object.seed | 0;
                if (object.id != null)
                    message.id = object.id | 0;
                return message;
            };

            /**
             * Creates a plain object from a DataCreate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataCreate
             * @static
             * @param {LCProto.DataCreate} message DataCreate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataCreate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.you = null;
                    object.opponent = null;
                    object.seed = 0;
                    object.id = 0;
                }
                if (message.you != null && message.hasOwnProperty("you"))
                    object.you = $root.LCProto.User.toObject(message.you, options);
                if (message.opponent != null && message.hasOwnProperty("opponent"))
                    object.opponent = $root.LCProto.User.toObject(message.opponent, options);
                if (message.seed != null && message.hasOwnProperty("seed"))
                    object.seed = message.seed;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this DataCreate to JSON.
             * @function toJSON
             * @memberof LCProto.DataCreate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataCreate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataCreate;
        })();

        LCProto.DataCountDown = (function () {

            /**
             * Properties of a DataCountDown.
             * @memberof LCProto
             * @interface IDataCountDown
             * @property {number|null} [value] DataCountDown value
             */

            /**
             * Constructs a new DataCountDown.
             * @memberof LCProto
             * @classdesc Represents a DataCountDown.
             * @implements IDataCountDown
             * @constructor
             * @param {LCProto.IDataCountDown=} [properties] Properties to set
             */
            function DataCountDown(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataCountDown value.
             * @member {number} value
             * @memberof LCProto.DataCountDown
             * @instance
             */
            DataCountDown.prototype.value = 0;

            /**
             * Creates a new DataCountDown instance using the specified properties.
             * @function create
             * @memberof LCProto.DataCountDown
             * @static
             * @param {LCProto.IDataCountDown=} [properties] Properties to set
             * @returns {LCProto.DataCountDown} DataCountDown instance
             */
            DataCountDown.create = function create(properties) {
                return new DataCountDown(properties);
            };

            /**
             * Encodes the specified DataCountDown message. Does not implicitly {@link LCProto.DataCountDown.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataCountDown
             * @static
             * @param {LCProto.IDataCountDown} message DataCountDown message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCountDown.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                return writer;
            };

            /**
             * Encodes the specified DataCountDown message, length delimited. Does not implicitly {@link LCProto.DataCountDown.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataCountDown
             * @static
             * @param {LCProto.IDataCountDown} message DataCountDown message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataCountDown.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataCountDown message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataCountDown
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataCountDown} DataCountDown
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCountDown.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataCountDown();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataCountDown message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataCountDown
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataCountDown} DataCountDown
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataCountDown.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataCountDown message.
             * @function verify
             * @memberof LCProto.DataCountDown
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataCountDown.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates a DataCountDown message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataCountDown
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataCountDown} DataCountDown
             */
            DataCountDown.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataCountDown)
                    return object;
                var message = new $root.LCProto.DataCountDown();
                if (object.value != null)
                    message.value = object.value | 0;
                return message;
            };

            /**
             * Creates a plain object from a DataCountDown message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataCountDown
             * @static
             * @param {LCProto.DataCountDown} message DataCountDown
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataCountDown.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this DataCountDown to JSON.
             * @function toJSON
             * @memberof LCProto.DataCountDown
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataCountDown.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataCountDown;
        })();

        LCProto.DataResult = (function () {

            /**
             * Properties of a DataResult.
             * @memberof LCProto
             * @interface IDataResult
             * @property {number|null} [result] DataResult result
             * @property {string|null} [nonstr] DataResult nonstr
             * @property {string|null} [sign] DataResult sign
             * @property {string|null} [resultrawdata] DataResult resultrawdata
             * @property {string|null} [timestamp] DataResult timestamp
             * @property {number|null} [yourScore] DataResult yourScore
             * @property {number|null} [opponentScore] DataResult opponentScore
             */

            /**
             * Constructs a new DataResult.
             * @memberof LCProto
             * @classdesc Represents a DataResult.
             * @implements IDataResult
             * @constructor
             * @param {LCProto.IDataResult=} [properties] Properties to set
             */
            function DataResult(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataResult result.
             * @member {number} result
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.result = 0;

            /**
             * DataResult nonstr.
             * @member {string} nonstr
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.nonstr = "";

            /**
             * DataResult sign.
             * @member {string} sign
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.sign = "";

            /**
             * DataResult resultrawdata.
             * @member {string} resultrawdata
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.resultrawdata = "";

            /**
             * DataResult timestamp.
             * @member {string} timestamp
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.timestamp = "";

            /**
             * DataResult yourScore.
             * @member {number} yourScore
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.yourScore = 0;

            /**
             * DataResult opponentScore.
             * @member {number} opponentScore
             * @memberof LCProto.DataResult
             * @instance
             */
            DataResult.prototype.opponentScore = 0;

            /**
             * Creates a new DataResult instance using the specified properties.
             * @function create
             * @memberof LCProto.DataResult
             * @static
             * @param {LCProto.IDataResult=} [properties] Properties to set
             * @returns {LCProto.DataResult} DataResult instance
             */
            DataResult.create = function create(properties) {
                return new DataResult(properties);
            };

            /**
             * Encodes the specified DataResult message. Does not implicitly {@link LCProto.DataResult.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataResult
             * @static
             * @param {LCProto.IDataResult} message DataResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
                if (message.nonstr != null && Object.hasOwnProperty.call(message, "nonstr"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.nonstr);
                if (message.sign != null && Object.hasOwnProperty.call(message, "sign"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.sign);
                if (message.resultrawdata != null && Object.hasOwnProperty.call(message, "resultrawdata"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.resultrawdata);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.timestamp);
                if (message.yourScore != null && Object.hasOwnProperty.call(message, "yourScore"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.yourScore);
                if (message.opponentScore != null && Object.hasOwnProperty.call(message, "opponentScore"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.opponentScore);
                return writer;
            };

            /**
             * Encodes the specified DataResult message, length delimited. Does not implicitly {@link LCProto.DataResult.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataResult
             * @static
             * @param {LCProto.IDataResult} message DataResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataResult message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataResult} DataResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataResult.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataResult();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.result = reader.int32();
                            break;
                        case 2:
                            message.nonstr = reader.string();
                            break;
                        case 3:
                            message.sign = reader.string();
                            break;
                        case 4:
                            message.resultrawdata = reader.string();
                            break;
                        case 5:
                            message.timestamp = reader.string();
                            break;
                        case 6:
                            message.yourScore = reader.int32();
                            break;
                        case 7:
                            message.opponentScore = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataResult message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataResult} DataResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataResult.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataResult message.
             * @function verify
             * @memberof LCProto.DataResult
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.result != null && message.hasOwnProperty("result"))
                    if (!$util.isInteger(message.result))
                        return "result: integer expected";
                if (message.nonstr != null && message.hasOwnProperty("nonstr"))
                    if (!$util.isString(message.nonstr))
                        return "nonstr: string expected";
                if (message.sign != null && message.hasOwnProperty("sign"))
                    if (!$util.isString(message.sign))
                        return "sign: string expected";
                if (message.resultrawdata != null && message.hasOwnProperty("resultrawdata"))
                    if (!$util.isString(message.resultrawdata))
                        return "resultrawdata: string expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isString(message.timestamp))
                        return "timestamp: string expected";
                if (message.yourScore != null && message.hasOwnProperty("yourScore"))
                    if (!$util.isInteger(message.yourScore))
                        return "yourScore: integer expected";
                if (message.opponentScore != null && message.hasOwnProperty("opponentScore"))
                    if (!$util.isInteger(message.opponentScore))
                        return "opponentScore: integer expected";
                return null;
            };

            /**
             * Creates a DataResult message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataResult
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataResult} DataResult
             */
            DataResult.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataResult)
                    return object;
                var message = new $root.LCProto.DataResult();
                if (object.result != null)
                    message.result = object.result | 0;
                if (object.nonstr != null)
                    message.nonstr = String(object.nonstr);
                if (object.sign != null)
                    message.sign = String(object.sign);
                if (object.resultrawdata != null)
                    message.resultrawdata = String(object.resultrawdata);
                if (object.timestamp != null)
                    message.timestamp = String(object.timestamp);
                if (object.yourScore != null)
                    message.yourScore = object.yourScore | 0;
                if (object.opponentScore != null)
                    message.opponentScore = object.opponentScore | 0;
                return message;
            };

            /**
             * Creates a plain object from a DataResult message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataResult
             * @static
             * @param {LCProto.DataResult} message DataResult
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.result = 0;
                    object.nonstr = "";
                    object.sign = "";
                    object.resultrawdata = "";
                    object.timestamp = "";
                    object.yourScore = 0;
                    object.opponentScore = 0;
                }
                if (message.result != null && message.hasOwnProperty("result"))
                    object.result = message.result;
                if (message.nonstr != null && message.hasOwnProperty("nonstr"))
                    object.nonstr = message.nonstr;
                if (message.sign != null && message.hasOwnProperty("sign"))
                    object.sign = message.sign;
                if (message.resultrawdata != null && message.hasOwnProperty("resultrawdata"))
                    object.resultrawdata = message.resultrawdata;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.yourScore != null && message.hasOwnProperty("yourScore"))
                    object.yourScore = message.yourScore;
                if (message.opponentScore != null && message.hasOwnProperty("opponentScore"))
                    object.opponentScore = message.opponentScore;
                return object;
            };

            /**
             * Converts this DataResult to JSON.
             * @function toJSON
             * @memberof LCProto.DataResult
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataResult;
        })();

        LCProto.DataExit = (function () {

            /**
             * Properties of a DataExit.
             * @memberof LCProto
             * @interface IDataExit
             * @property {number|null} [id] DataExit id
             */

            /**
             * Constructs a new DataExit.
             * @memberof LCProto
             * @classdesc Represents a DataExit.
             * @implements IDataExit
             * @constructor
             * @param {LCProto.IDataExit=} [properties] Properties to set
             */
            function DataExit(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataExit id.
             * @member {number} id
             * @memberof LCProto.DataExit
             * @instance
             */
            DataExit.prototype.id = 0;

            /**
             * Creates a new DataExit instance using the specified properties.
             * @function create
             * @memberof LCProto.DataExit
             * @static
             * @param {LCProto.IDataExit=} [properties] Properties to set
             * @returns {LCProto.DataExit} DataExit instance
             */
            DataExit.create = function create(properties) {
                return new DataExit(properties);
            };

            /**
             * Encodes the specified DataExit message. Does not implicitly {@link LCProto.DataExit.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataExit
             * @static
             * @param {LCProto.IDataExit} message DataExit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataExit.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                return writer;
            };

            /**
             * Encodes the specified DataExit message, length delimited. Does not implicitly {@link LCProto.DataExit.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataExit
             * @static
             * @param {LCProto.IDataExit} message DataExit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataExit.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataExit message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataExit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataExit} DataExit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataExit.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataExit();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.id = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataExit message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataExit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataExit} DataExit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataExit.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataExit message.
             * @function verify
             * @memberof LCProto.DataExit
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataExit.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a DataExit message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataExit
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataExit} DataExit
             */
            DataExit.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataExit)
                    return object;
                var message = new $root.LCProto.DataExit();
                if (object.id != null)
                    message.id = object.id | 0;
                return message;
            };

            /**
             * Creates a plain object from a DataExit message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataExit
             * @static
             * @param {LCProto.DataExit} message DataExit
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataExit.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.id = 0;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this DataExit to JSON.
             * @function toJSON
             * @memberof LCProto.DataExit
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataExit.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataExit;
        })();

        LCProto.DataScore = (function () {

            /**
             * Properties of a DataScore.
             * @memberof LCProto
             * @interface IDataScore
             * @property {number|null} [value] DataScore value
             * @property {boolean|null} [isAI] DataScore isAI
             */

            /**
             * Constructs a new DataScore.
             * @memberof LCProto
             * @classdesc Represents a DataScore.
             * @implements IDataScore
             * @constructor
             * @param {LCProto.IDataScore=} [properties] Properties to set
             */
            function DataScore(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataScore value.
             * @member {number} value
             * @memberof LCProto.DataScore
             * @instance
             */
            DataScore.prototype.value = 0;

            /**
             * DataScore isAI.
             * @member {boolean} isAI
             * @memberof LCProto.DataScore
             * @instance
             */
            DataScore.prototype.isAI = false;

            /**
             * Creates a new DataScore instance using the specified properties.
             * @function create
             * @memberof LCProto.DataScore
             * @static
             * @param {LCProto.IDataScore=} [properties] Properties to set
             * @returns {LCProto.DataScore} DataScore instance
             */
            DataScore.create = function create(properties) {
                return new DataScore(properties);
            };

            /**
             * Encodes the specified DataScore message. Does not implicitly {@link LCProto.DataScore.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataScore
             * @static
             * @param {LCProto.IDataScore} message DataScore message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataScore.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                if (message.isAI != null && Object.hasOwnProperty.call(message, "isAI"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isAI);
                return writer;
            };

            /**
             * Encodes the specified DataScore message, length delimited. Does not implicitly {@link LCProto.DataScore.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataScore
             * @static
             * @param {LCProto.IDataScore} message DataScore message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataScore.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataScore message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataScore
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataScore} DataScore
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataScore.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataScore();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int32();
                            break;
                        case 2:
                            message.isAI = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataScore message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataScore
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataScore} DataScore
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataScore.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataScore message.
             * @function verify
             * @memberof LCProto.DataScore
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataScore.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    if (typeof message.isAI !== "boolean")
                        return "isAI: boolean expected";
                return null;
            };

            /**
             * Creates a DataScore message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataScore
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataScore} DataScore
             */
            DataScore.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataScore)
                    return object;
                var message = new $root.LCProto.DataScore();
                if (object.value != null)
                    message.value = object.value | 0;
                if (object.isAI != null)
                    message.isAI = Boolean(object.isAI);
                return message;
            };

            /**
             * Creates a plain object from a DataScore message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataScore
             * @static
             * @param {LCProto.DataScore} message DataScore
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataScore.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.value = 0;
                    object.isAI = false;
                }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    object.isAI = message.isAI;
                return object;
            };

            /**
             * Converts this DataScore to JSON.
             * @function toJSON
             * @memberof LCProto.DataScore
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataScore.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataScore;
        })();

        LCProto.DataTool = (function () {

            /**
             * Properties of a DataTool.
             * @memberof LCProto
             * @interface IDataTool
             * @property {number|null} [value] DataTool value
             * @property {boolean|null} [isAI] DataTool isAI
             */

            /**
             * Constructs a new DataTool.
             * @memberof LCProto
             * @classdesc Represents a DataTool.
             * @implements IDataTool
             * @constructor
             * @param {LCProto.IDataTool=} [properties] Properties to set
             */
            function DataTool(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DataTool value.
             * @member {number} value
             * @memberof LCProto.DataTool
             * @instance
             */
            DataTool.prototype.value = 0;

            /**
             * DataTool isAI.
             * @member {boolean} isAI
             * @memberof LCProto.DataTool
             * @instance
             */
            DataTool.prototype.isAI = false;

            /**
             * Creates a new DataTool instance using the specified properties.
             * @function create
             * @memberof LCProto.DataTool
             * @static
             * @param {LCProto.IDataTool=} [properties] Properties to set
             * @returns {LCProto.DataTool} DataTool instance
             */
            DataTool.create = function create(properties) {
                return new DataTool(properties);
            };

            /**
             * Encodes the specified DataTool message. Does not implicitly {@link LCProto.DataTool.verify|verify} messages.
             * @function encode
             * @memberof LCProto.DataTool
             * @static
             * @param {LCProto.IDataTool} message DataTool message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataTool.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                if (message.isAI != null && Object.hasOwnProperty.call(message, "isAI"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isAI);
                return writer;
            };

            /**
             * Encodes the specified DataTool message, length delimited. Does not implicitly {@link LCProto.DataTool.verify|verify} messages.
             * @function encodeDelimited
             * @memberof LCProto.DataTool
             * @static
             * @param {LCProto.IDataTool} message DataTool message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DataTool.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DataTool message from the specified reader or buffer.
             * @function decode
             * @memberof LCProto.DataTool
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {LCProto.DataTool} DataTool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataTool.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LCProto.DataTool();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int32();
                            break;
                        case 2:
                            message.isAI = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DataTool message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof LCProto.DataTool
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {LCProto.DataTool} DataTool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DataTool.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DataTool message.
             * @function verify
             * @memberof LCProto.DataTool
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DataTool.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    if (typeof message.isAI !== "boolean")
                        return "isAI: boolean expected";
                return null;
            };

            /**
             * Creates a DataTool message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof LCProto.DataTool
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {LCProto.DataTool} DataTool
             */
            DataTool.fromObject = function fromObject(object) {
                if (object instanceof $root.LCProto.DataTool)
                    return object;
                var message = new $root.LCProto.DataTool();
                if (object.value != null)
                    message.value = object.value | 0;
                if (object.isAI != null)
                    message.isAI = Boolean(object.isAI);
                return message;
            };

            /**
             * Creates a plain object from a DataTool message. Also converts values to other types if specified.
             * @function toObject
             * @memberof LCProto.DataTool
             * @static
             * @param {LCProto.DataTool} message DataTool
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DataTool.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.value = 0;
                    object.isAI = false;
                }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                if (message.isAI != null && message.hasOwnProperty("isAI"))
                    object.isAI = message.isAI;
                return object;
            };

            /**
             * Converts this DataTool to JSON.
             * @function toJSON
             * @memberof LCProto.DataTool
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DataTool.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DataTool;
        })();

        return LCProto;
    })();

    return $root;
})(protobuf);
