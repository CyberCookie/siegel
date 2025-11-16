import intervalWorker, {
    MessageIncome as WorkerMessageIncome,
    MessageOutcome as WorkerMessageOutcome
} from '../../intervals__worker'
import getUniqId from '../../../common/get_uniq_id'

import type { CreateSocketParams, Handler, SocketState, SocketInit } from './types'


const worker = intervalWorker()

const SOCKET_CONNECTION_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
} as const

const connectionsInProgress = new Set<string>()

const messageParseDefault = ({ data }: MessageEvent) => JSON.parse(data)

const messageSerializeDefault: NonNullable<CreateSocketParams['serializeOutcommingMsg']> =
({ messageTypeKey, messageType, payloadKey, payload }) => (
    JSON.stringify({
        [messageTypeKey]: messageType,
        [payloadKey]: payload
    })
)

const init: SocketInit = args => {
    const { connectURL } = args
    if (connectionsInProgress.has(connectURL)) return null
    else connectionsInProgress.add(connectURL)

    const {
        events, messageTypeKey, payloadKey, state, serverTimeout, ping,
        parseIncommingMsg, onError, onClose, onReconnect,
        intervalWorkerData: { worker, pingMessageId }
    } = args
    const { messageHandlers, pendingDataToSend, reconnecting } = state

    let keepAliveTimeoutId: number

    function setServerTimeout() {
        if (serverTimeout) {
            clearTimeout(keepAliveTimeoutId)
            keepAliveTimeoutId = (setTimeout as Window['setTimeout'])(() => {
                socket.close()
                onError()
            }, serverTimeout)
        }
    }


    const socket = new WebSocket(connectURL)

    socket.onopen = e => {
        connectionsInProgress.delete(connectURL)
        reconnecting && onReconnect(e)

        setServerTimeout()
        ping && worker.postMessage({
            id: pingMessageId,
            ms: ping!.interval
        } as WorkerMessageIncome)

        if (pendingDataToSend.length) {
            pendingDataToSend.forEach(data => {
                socket.send(data)
            })

            pendingDataToSend.length = 0
        }

        events?.onopen?.(e)
    }
    socket.onmessage = e => {
        setServerTimeout()

        const dataParsed = parseIncommingMsg(e)

        const type = dataParsed[messageTypeKey]
        const payload = dataParsed[payloadKey]

        messageHandlers[type]?.forEach(cb => {
            cb(payload)
        })

        events?.onmessage?.(e, dataParsed)
    }
    socket.onclose = e => {
        clearTimeout(keepAliveTimeoutId)
        onClose()

        events?.onclose?.(e)
    }
    socket.onerror = e => {
        clearTimeout(keepAliveTimeoutId)
        connectionsInProgress.delete(connectURL)
        onError(e)
    }


    return socket
}

function createSocket(params: CreateSocketParams) {
    const {
        path, port, wss, events, reconnectInterval, serverTimeout, ping,
        parseIncommingMsg = messageParseDefault,
        serializeOutcommingMsg = messageSerializeDefault,
        url = location.hostname,
        messageTypeKey = 'type',
        payloadKey = 'data'
    } = params

    const state: SocketState = {
        messageHandlers: {},
        pendingDataToSend: [],
        reconnecting: false
    }
    const { messageHandlers, pendingDataToSend } = state

    let connectURL = `${wss ? 'wss' : 'ws'}://${url}`
    port && (connectURL += `:${port}`)
    path && (connectURL += `/${path}`)


    const messageIdPrefix = `${connectURL}_${getUniqId()}`
    const workerPingMessageId = `socket_ping_${messageIdPrefix}`
    const workerReconnectMessageId = `socket_reconnect_${messageIdPrefix}`

    worker.addEventListener('message', workerIntervalHandle)

    function workerIntervalHandle({ data }: WorkerMessageOutcome) {
        if (data == workerPingMessageId) {
            socket.send(ping!.payload)

        } else if (data == workerReconnectMessageId) {
            socket = init(initParams) || socket
        }
    }


    const initParams: Parameters<SocketInit>[0] = {
        connectURL, events, messageTypeKey, payloadKey, state, serverTimeout,
        ping, parseIncommingMsg,
        intervalWorkerData: {
            worker,
            pingMessageId: workerPingMessageId
        },
        onError(e) {
            if (reconnectInterval) {
                state.reconnecting = true

                worker.postMessage({
                    id: workerReconnectMessageId,
                    ms: reconnectInterval
                } as WorkerMessageIncome)
                worker.postMessage({ id: workerPingMessageId } as WorkerMessageIncome)
            }

            events?.onerror?.(e)
        },
        onClose() {
            worker.postMessage({ id: workerPingMessageId } as WorkerMessageIncome)
        },
        onReconnect(e) {
            state.reconnecting = false
            worker.postMessage({ id: workerReconnectMessageId } as WorkerMessageIncome)

            events?.onreconnect?.(e)
        }
    }
    let socket = init(initParams)!



    return {
        on<_Payload>(messageType: string, cb: Handler<_Payload>) {
            const messageTypeHandlers = messageHandlers[messageType]

            messageTypeHandlers
                ?   messageTypeHandlers.has(cb) || messageTypeHandlers.add(cb)
                :   (messageHandlers[messageType] = new Set([ cb ]))

            return this
        },

        off(messageType: string, cb: Handler) {
            messageHandlers[messageType]?.delete(cb)
            return this
        },
        allOff(messageType: string) {
            delete messageHandlers[messageType]
            return this
        },


        send(messageType: string, payload: any) {
            const { readyState } = socket
            if (
                    readyState != SOCKET_CONNECTION_STATE.CLOSING
                &&  readyState != SOCKET_CONNECTION_STATE.CLOSED
            ) {

                const dataToSend = serializeOutcommingMsg({
                    messageTypeKey, messageType, payloadKey, payload
                })
                readyState == SOCKET_CONNECTION_STATE.OPEN
                    ?   socket.send(dataToSend)
                    :   pendingDataToSend.push(dataToSend)
            }

            return this
        },

        close() {
            const { readyState } = socket
            if (
                    readyState == SOCKET_CONNECTION_STATE.CONNECTING
                ||  readyState == SOCKET_CONNECTION_STATE.OPEN

            ) socket.close()

            return this
        },


        getUnderlyingSocket: () => socket
    }
}


export default createSocket
export { SOCKET_CONNECTION_STATE }
export type { CreateSocketParams }