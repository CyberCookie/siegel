type MessageType = string | Blob | ArrayBufferLike | ArrayBufferView

type CreateSocketParams = {
    /** Socket connection URL */
    url?: string

    /** Socket connection port */
    port?: number

    /** Socket connection URL path */
    path?: string

    /** Enable secure socket protocol */
    wss?: boolean

    /** Message field that holds message type string */
    messageTypeKey?: string

    /** Message field to place payload in */
    payloadKey?: string

    /** Socket reconnect interval in ms. , if socket connection error occurs */
    reconnectInterval?: number

    /** Closes socket connection if no messages has been received from a server during provided value ms. */
    serverTimeout?: number

    /** Ping message to be sent on a server */
    ping?: {
        /** Ping message interval in ms */
        interval: number

        /** Ping message payload */
        payload: MessageType
    }

    /** Different events thats are fired during a socket connection lifecycle you may subscribe to */
    events?: {
        /**
         * Triggered after connection has been established
         *
         * @param e Event
         */
        onopen?(e: Event): void

        /**
         * Triggered after successful reconnection
         *
         * @param e Event
         */
        onreconnect?(e: Event): void

        /**
         * Triggers when message is received
         *
         * @param e Message Event
         * @param parsedMessage Parsed message
         */
        onmessage?(e: MessageEvent, parsedMessage: any): void

        /**
         * Triggers once socket connection has been clossed
         *
         * @param e Close event
         */
        onclose?(e: CloseEvent): void

        /**
         * Triggres once an error is occured in a socket connection
         *
         * @param e Event
         */
        onerror?(e?: Event): void
    }

    /**
     * Socket incoming message parse function where you can apply your custom parse algorithm
     *
     * @param e Message event
     */
    parseIncommingMsg?(e: MessageEvent): any

    /**
     * Constructs a message to be sent on a server
     *
     * @param serializeParams Serialize params
     */
    serializeOutcommingMsg?(
        serializeParams: {
            /** Socket params messageTypeKey */
            messageTypeKey: NonNullable<CreateSocketParams['messageTypeKey']>

            /** Socket message type */
            messageType: string

            /** Socket params payloadKey */
            payloadKey: NonNullable<CreateSocketParams['payloadKey']>

            /** Socket message payload */
            payload: any
        }
    ): MessageType
}

type Handler<_Payload = any> = (payload?: _Payload) => void

type SocketState = {
    messageHandlers: {
        [key in string]: Set<Handler>
    }
    pendingDataToSend: any[]
    reconnecting: boolean
}

type SocketInit = (params: {
    connectURL: string
    events: CreateSocketParams['events']
    serverTimeout: CreateSocketParams['serverTimeout']
    ping: CreateSocketParams['ping']
    messageTypeKey: NonNullable<CreateSocketParams['messageTypeKey']>
    payloadKey: NonNullable<CreateSocketParams['payloadKey']>
    state: SocketState
    intervalWorkerData: {
        worker: Worker
        pingMessageId: string
    }
    onError(e?: Event): void
    onClose(): void
    onReconnect(e: Event): void
    parseIncommingMsg: NonNullable<CreateSocketParams['parseIncommingMsg']>
}) => WebSocket | null


export type { CreateSocketParams, Handler, SocketState, SocketInit }