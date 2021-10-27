type Params = {
    url?: string
    path?: string
    messageTypeKey?: string
    payloadKey?: string
}

type Handler<_Payload = any> = (payload: _Payload) => void

type SocketState = {
    handlers: {
        [key in string]: Set<Handler>
    }
}


function createSocket(params: any) {
    const {
        path,
        url = window.location.hostname,
        messageTypeKey = 'type', payloadKey = 'data'
    } = params

    let connectURL = `ws://${url}`
    path && (connectURL += `/${path}`)

    const state: SocketState = {
        handlers: {}
    }
    const { handlers } = state

    const socket = new WebSocket(connectURL)



    socket.addEventListener('message', ({ data }) => {
        const dataParsed = JSON.parse(data)

        const type = dataParsed[messageTypeKey]
        const payload = dataParsed[payloadKey]

        handlers[type]?.forEach(cb => {
            cb(payload)
        })
    })


    return {
        on<_Payload>(messageType: string, cb: Handler<_Payload>) {
            const messageTypeHandlers = handlers[messageType]

            messageTypeHandlers
                ?   messageTypeHandlers.has(cb) || messageTypeHandlers.add(cb)
                :   (handlers[messageType] = new Set([ cb ]))

            return this
        },

        off(messageType: string, cb: Handler) {
            handlers[messageType]?.delete(cb)

            return this
        },

        send(messageType: string, payload: any) {
            socket.send(
                JSON.stringify({
                    [messageTypeKey]: messageType,
                    [payloadKey]: payload
                })
            )

            return this
        },

        nativeSocket: socket
    }
}


export default createSocket
export type { Params }