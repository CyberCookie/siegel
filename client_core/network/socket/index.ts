import type { CreateSocketParams, Handler, SocketState, SocketInit } from './types'


const STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
}

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
        parseIncommingMsg, onError, onReconnect
    } = args
    const { messageHandlers, pendingDataToSend, reconnectIntervalID } = state

    let keepAliveTimeoutId: number
    let pingIntervalId: number
    function clearAsyncTasks() {
        clearTimeout(keepAliveTimeoutId)
        clearInterval(pingIntervalId)
    }

    function setServerTimeout() {
        if (serverTimeout) {
            clearTimeout(keepAliveTimeoutId)
            keepAliveTimeoutId = (setTimeout as Window['setTimeout'])(() => {
                socket.close()
                onError()
            }, serverTimeout)
        }
    }

    function setPing() {
        const { interval, payload } = ping!
        pingIntervalId = (setInterval as Window['setInterval'])(() => {
            socket.send(payload)
        }, interval)
    }



    const socket = new WebSocket(connectURL)

    socket.onopen = e => {
        connectionsInProgress.delete(connectURL)
        reconnectIntervalID && onReconnect(e)

        setServerTimeout()
        ping && setPing()

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
        clearAsyncTasks()
        events?.onclose?.(e)
    }
    socket.onerror = e => {
        connectionsInProgress.delete(connectURL)
        clearAsyncTasks()
        onError(e)
    }


    return socket
}

function createSocket(params: CreateSocketParams) {
    const {
        path, port, wss, events, reconnectInterval, serverTimeout, ping,
        parseIncommingMsg = messageParseDefault,
        serializeOutcommingMsg = messageSerializeDefault,
        url = window.location.hostname,
        messageTypeKey = 'type',
        payloadKey = 'data'
    } = params

    const state: SocketState = {
        messageHandlers: {},
        pendingDataToSend: [],
        reconnectIntervalID: 0
    }
    const { messageHandlers, pendingDataToSend } = state


    let connectURL = `${wss ? 'wss' : 'ws'}://${url}`
    port && (connectURL += `:${port}`)
    path && (connectURL += `/${path}`)

    const initParams: Parameters<SocketInit>[0] = {
        connectURL, events, messageTypeKey, payloadKey, state, serverTimeout, ping,
        parseIncommingMsg,
        onError(e) {
            if (reconnectInterval) {
                state.reconnectIntervalID = (setInterval as Window['setInterval'])(() => {
                    socket = init(initParams) || socket
                }, reconnectInterval)
            }

            events?.onerror?.(e)
        },
        onReconnect(e) {
            clearInterval(state.reconnectIntervalID)
            state.reconnectIntervalID = 0

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
            if (readyState != STATE.CLOSING && readyState != STATE.CLOSED) {

                const dataToSend = serializeOutcommingMsg({ messageTypeKey, messageType, payloadKey, payload })
                readyState == STATE.OPEN
                    ?   socket.send(dataToSend)
                    :   pendingDataToSend.push(dataToSend)
            }

            return this
        },

        close() {
            const { readyState } = socket
            if (readyState == STATE.CONNECTING || readyState == STATE.OPEN) {
                socket.close()
            }

            return this
        },

        getUnderlyingSocket: () => socket
    }
}


export default createSocket
export { STATE }
export type { CreateSocketParams }