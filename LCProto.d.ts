/// <reference path="protobufjs.d.ts"/>
/** Namespace LCProto. */
declare namespace LCProto {

    /** Properties of a User. */
    interface IUser {

        /** User name */
        name?: (string|null);

        /** User avatar */
        avatar?: (string|null);

        /** User isAI */
        isAI?: (boolean|null);
    }

    /** Represents a User. */
    class User implements IUser {

        /**
         * Constructs a new User.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IUser);

        /** User name. */
        public name: string;

        /** User avatar. */
        public avatar: string;

        /** User isAI. */
        public isAI: boolean;

        /**
         * Creates a new User instance using the specified properties.
         * @param [properties] Properties to set
         * @returns User instance
         */
        public static create(properties?: LCProto.IUser): LCProto.User;

        /**
         * Encodes the specified User message. Does not implicitly {@link LCProto.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified User message, length delimited. Does not implicitly {@link LCProto.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a User message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.User;

        /**
         * Decodes a User message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.User;

        /**
         * Verifies a User message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a User message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns User
         */
        public static fromObject(object: { [k: string]: any }): LCProto.User;

        /**
         * Creates a plain object from a User message. Also converts values to other types if specified.
         * @param message User
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this User to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Action. */
    interface IAction {

        /** Action ID */
        ID?: (LCProto.ActionID|null);

        /** Action index */
        index?: (number|null);

        /** Action data */
        data?: (Uint8Array|null);
    }

    /** Represents an Action. */
    class Action implements IAction {

        /**
         * Constructs a new Action.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IAction);

        /** Action ID. */
        public ID: LCProto.ActionID;

        /** Action index. */
        public index: number;

        /** Action data. */
        public data: Uint8Array;

        /**
         * Creates a new Action instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Action instance
         */
        public static create(properties?: LCProto.IAction): LCProto.Action;

        /**
         * Encodes the specified Action message. Does not implicitly {@link LCProto.Action.verify|verify} messages.
         * @param message Action message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Action message, length delimited. Does not implicitly {@link LCProto.Action.verify|verify} messages.
         * @param message Action message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Action message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Action
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.Action;

        /**
         * Decodes an Action message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Action
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.Action;

        /**
         * Verifies an Action message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Action message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Action
         */
        public static fromObject(object: { [k: string]: any }): LCProto.Action;

        /**
         * Creates a plain object from an Action message. Also converts values to other types if specified.
         * @param message Action
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.Action, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Action to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** ActionID enum. */
    enum ActionID {
        ActionIDNone = 0,
        ActionIDPing = 1,
        ActionIDPong = 2,
        ActionIDCheck = 3,
        ActionIDRecovery = 4,
        ActionIDError = 5,
        ActionIDReady = 101,
        ActionIDResult = 102,
        ActionIDExit = 103,
        ActionIDFinish = 104,
        ActionIDCreate = 201,
        ActionIDStart = 202,
        ActionIDCountDown = 203,
        ActionIDEnd = 204,
        ActionIDScore = 301,
        ActionIDTool = 302
    }

    /** Properties of a DataCheck. */
    interface IDataCheck {

        /** DataCheck recvIndex */
        recvIndex?: (number|null);

        /** DataCheck sendIndex */
        sendIndex?: (number|null);
    }

    /** Represents a DataCheck. */
    class DataCheck implements IDataCheck {

        /**
         * Constructs a new DataCheck.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataCheck);

        /** DataCheck recvIndex. */
        public recvIndex: number;

        /** DataCheck sendIndex. */
        public sendIndex: number;

        /**
         * Creates a new DataCheck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataCheck instance
         */
        public static create(properties?: LCProto.IDataCheck): LCProto.DataCheck;

        /**
         * Encodes the specified DataCheck message. Does not implicitly {@link LCProto.DataCheck.verify|verify} messages.
         * @param message DataCheck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataCheck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataCheck message, length delimited. Does not implicitly {@link LCProto.DataCheck.verify|verify} messages.
         * @param message DataCheck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataCheck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataCheck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataCheck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataCheck;

        /**
         * Decodes a DataCheck message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataCheck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataCheck;

        /**
         * Verifies a DataCheck message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataCheck message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataCheck
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataCheck;

        /**
         * Creates a plain object from a DataCheck message. Also converts values to other types if specified.
         * @param message DataCheck
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataCheck, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataCheck to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataRecovery. */
    interface IDataRecovery {

        /** DataRecovery actions */
        actions?: (LCProto.IAction[]|null);
    }

    /** Represents a DataRecovery. */
    class DataRecovery implements IDataRecovery {

        /**
         * Constructs a new DataRecovery.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataRecovery);

        /** DataRecovery actions. */
        public actions: LCProto.IAction[];

        /**
         * Creates a new DataRecovery instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataRecovery instance
         */
        public static create(properties?: LCProto.IDataRecovery): LCProto.DataRecovery;

        /**
         * Encodes the specified DataRecovery message. Does not implicitly {@link LCProto.DataRecovery.verify|verify} messages.
         * @param message DataRecovery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataRecovery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataRecovery message, length delimited. Does not implicitly {@link LCProto.DataRecovery.verify|verify} messages.
         * @param message DataRecovery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataRecovery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataRecovery message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataRecovery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataRecovery;

        /**
         * Decodes a DataRecovery message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataRecovery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataRecovery;

        /**
         * Verifies a DataRecovery message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataRecovery message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataRecovery
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataRecovery;

        /**
         * Creates a plain object from a DataRecovery message. Also converts values to other types if specified.
         * @param message DataRecovery
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataRecovery, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataRecovery to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataCreate. */
    interface IDataCreate {

        /** DataCreate you */
        you?: (LCProto.IUser|null);

        /** DataCreate opponent */
        opponent?: (LCProto.IUser|null);

        /** DataCreate seed */
        seed?: (number|null);

        /** DataCreate id */
        id?: (number|null);
    }

    /** Represents a DataCreate. */
    class DataCreate implements IDataCreate {

        /**
         * Constructs a new DataCreate.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataCreate);

        /** DataCreate you. */
        public you?: (LCProto.IUser|null);

        /** DataCreate opponent. */
        public opponent?: (LCProto.IUser|null);

        /** DataCreate seed. */
        public seed: number;

        /** DataCreate id. */
        public id: number;

        /**
         * Creates a new DataCreate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataCreate instance
         */
        public static create(properties?: LCProto.IDataCreate): LCProto.DataCreate;

        /**
         * Encodes the specified DataCreate message. Does not implicitly {@link LCProto.DataCreate.verify|verify} messages.
         * @param message DataCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataCreate message, length delimited. Does not implicitly {@link LCProto.DataCreate.verify|verify} messages.
         * @param message DataCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataCreate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataCreate;

        /**
         * Decodes a DataCreate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataCreate;

        /**
         * Verifies a DataCreate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataCreate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataCreate
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataCreate;

        /**
         * Creates a plain object from a DataCreate message. Also converts values to other types if specified.
         * @param message DataCreate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataCreate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataCreate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataCountDown. */
    interface IDataCountDown {

        /** DataCountDown value */
        value?: (number|null);
    }

    /** Represents a DataCountDown. */
    class DataCountDown implements IDataCountDown {

        /**
         * Constructs a new DataCountDown.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataCountDown);

        /** DataCountDown value. */
        public value: number;

        /**
         * Creates a new DataCountDown instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataCountDown instance
         */
        public static create(properties?: LCProto.IDataCountDown): LCProto.DataCountDown;

        /**
         * Encodes the specified DataCountDown message. Does not implicitly {@link LCProto.DataCountDown.verify|verify} messages.
         * @param message DataCountDown message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataCountDown, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataCountDown message, length delimited. Does not implicitly {@link LCProto.DataCountDown.verify|verify} messages.
         * @param message DataCountDown message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataCountDown, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataCountDown message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataCountDown
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataCountDown;

        /**
         * Decodes a DataCountDown message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataCountDown
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataCountDown;

        /**
         * Verifies a DataCountDown message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataCountDown message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataCountDown
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataCountDown;

        /**
         * Creates a plain object from a DataCountDown message. Also converts values to other types if specified.
         * @param message DataCountDown
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataCountDown, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataCountDown to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataResult. */
    interface IDataResult {

        /** DataResult result */
        result?: (number|null);

        /** DataResult nonstr */
        nonstr?: (string|null);

        /** DataResult sign */
        sign?: (string|null);

        /** DataResult resultrawdata */
        resultrawdata?: (string|null);

        /** DataResult timestamp */
        timestamp?: (string|null);

        /** DataResult yourScore */
        yourScore?: (number|null);

        /** DataResult opponentScore */
        opponentScore?: (number|null);
    }

    /** Represents a DataResult. */
    class DataResult implements IDataResult {

        /**
         * Constructs a new DataResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataResult);

        /** DataResult result. */
        public result: number;

        /** DataResult nonstr. */
        public nonstr: string;

        /** DataResult sign. */
        public sign: string;

        /** DataResult resultrawdata. */
        public resultrawdata: string;

        /** DataResult timestamp. */
        public timestamp: string;

        /** DataResult yourScore. */
        public yourScore: number;

        /** DataResult opponentScore. */
        public opponentScore: number;

        /**
         * Creates a new DataResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataResult instance
         */
        public static create(properties?: LCProto.IDataResult): LCProto.DataResult;

        /**
         * Encodes the specified DataResult message. Does not implicitly {@link LCProto.DataResult.verify|verify} messages.
         * @param message DataResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataResult message, length delimited. Does not implicitly {@link LCProto.DataResult.verify|verify} messages.
         * @param message DataResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataResult;

        /**
         * Decodes a DataResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataResult;

        /**
         * Verifies a DataResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataResult
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataResult;

        /**
         * Creates a plain object from a DataResult message. Also converts values to other types if specified.
         * @param message DataResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataExit. */
    interface IDataExit {

        /** DataExit id */
        id?: (number|null);
    }

    /** Represents a DataExit. */
    class DataExit implements IDataExit {

        /**
         * Constructs a new DataExit.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataExit);

        /** DataExit id. */
        public id: number;

        /**
         * Creates a new DataExit instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataExit instance
         */
        public static create(properties?: LCProto.IDataExit): LCProto.DataExit;

        /**
         * Encodes the specified DataExit message. Does not implicitly {@link LCProto.DataExit.verify|verify} messages.
         * @param message DataExit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataExit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataExit message, length delimited. Does not implicitly {@link LCProto.DataExit.verify|verify} messages.
         * @param message DataExit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataExit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataExit message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataExit;

        /**
         * Decodes a DataExit message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataExit;

        /**
         * Verifies a DataExit message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataExit message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataExit
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataExit;

        /**
         * Creates a plain object from a DataExit message. Also converts values to other types if specified.
         * @param message DataExit
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataExit, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataExit to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataScore. */
    interface IDataScore {

        /** DataScore value */
        value?: (number|null);

        /** DataScore isAI */
        isAI?: (boolean|null);
    }

    /** Represents a DataScore. */
    class DataScore implements IDataScore {

        /**
         * Constructs a new DataScore.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataScore);

        /** DataScore value. */
        public value: number;

        /** DataScore isAI. */
        public isAI: boolean;

        /**
         * Creates a new DataScore instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataScore instance
         */
        public static create(properties?: LCProto.IDataScore): LCProto.DataScore;

        /**
         * Encodes the specified DataScore message. Does not implicitly {@link LCProto.DataScore.verify|verify} messages.
         * @param message DataScore message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataScore, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataScore message, length delimited. Does not implicitly {@link LCProto.DataScore.verify|verify} messages.
         * @param message DataScore message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataScore, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataScore message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataScore;

        /**
         * Decodes a DataScore message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataScore
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataScore;

        /**
         * Verifies a DataScore message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataScore message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataScore
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataScore;

        /**
         * Creates a plain object from a DataScore message. Also converts values to other types if specified.
         * @param message DataScore
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataScore, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataScore to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataTool. */
    interface IDataTool {

        /** DataTool value */
        value?: (number|null);

        /** DataTool isAI */
        isAI?: (boolean|null);
    }

    /** Represents a DataTool. */
    class DataTool implements IDataTool {

        /**
         * Constructs a new DataTool.
         * @param [properties] Properties to set
         */
        constructor(properties?: LCProto.IDataTool);

        /** DataTool value. */
        public value: number;

        /** DataTool isAI. */
        public isAI: boolean;

        /**
         * Creates a new DataTool instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataTool instance
         */
        public static create(properties?: LCProto.IDataTool): LCProto.DataTool;

        /**
         * Encodes the specified DataTool message. Does not implicitly {@link LCProto.DataTool.verify|verify} messages.
         * @param message DataTool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: LCProto.IDataTool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataTool message, length delimited. Does not implicitly {@link LCProto.DataTool.verify|verify} messages.
         * @param message DataTool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: LCProto.IDataTool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataTool message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataTool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LCProto.DataTool;

        /**
         * Decodes a DataTool message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataTool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LCProto.DataTool;

        /**
         * Verifies a DataTool message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataTool message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataTool
         */
        public static fromObject(object: { [k: string]: any }): LCProto.DataTool;

        /**
         * Creates a plain object from a DataTool message. Also converts values to other types if specified.
         * @param message DataTool
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: LCProto.DataTool, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataTool to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
