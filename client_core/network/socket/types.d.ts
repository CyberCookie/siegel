type MessageType = string | Blob | ArrayBufferLike | ArrayBufferView

type CreateSocketParams = {
    url?: string
    port?: number
    path?: string
    wss?: boolean
    messageTypeKey?: string
    payloadKey?: string
    reconnectInterval?: number
    serverTimeout?: number
    ping?: {
        interval: number
        payload: MessageType
    }
    events?: {
        onopen?(e: Event): void
        onreconnect?(e: Event): void
        onmessage?(e: MessageEvent, parsedMessage: any): void
        onclose?(e: CloseEvent): void
        onerror?(e?: Event): void
    }
    parseIncommingMsg?(e: MessageEvent): any
    serializeOutcommingMsg?(
        serializeParams: {
            messageTypeKey: NonNullable<CreateSocketParams['messageTypeKey']>
            messageType: string
            payloadKey: NonNullable<CreateSocketParams['payloadKey']>
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