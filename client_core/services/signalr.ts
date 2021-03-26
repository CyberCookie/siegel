//@ts-nocheck

import { HubConnectionBuilder, HubConnectionState, HttpTransportType, JsonHubProtocol } from '@microsoft/signalr/dist/browser/signalr'


type SignalROptions = {
    url: string,
    serverTimeout?: number
    reconnectInterval?: number
    endpoint?: string
    transport?: any
    protocol?: any
    skipNegotiation?: boolean
    token?(): string
    handlers?: {
        onopen?(): void
        onclose?(): void
        onreconnect?(): void
        onerror?(err: any): void
    }
}

let defaults = {
    handlers: {},
    skipNegotiation: true
}
const setDefaults = (params: Partial<SignalROptions>) => {
    defaults = {
        ...defaults,
        ...params
    }
}

const isBusyStates = new Set([ HubConnectionState.Connecting, HubConnectionState.Reconnecting, HubConnectionState.Disconnecting ])


const createSignalRConnection = (options: SignalROptions) => {
    const connectionParams = Object.assign(options, defaults)
    const { url, reconnectInterval, endpoint, transport, protocol, serverTimeout,
        skipNegotiation, handlers, token } = connectionParams;
    

    const nativeSocket = new HubConnectionBuilder()
        .withUrl((url || window.location.origin) + endpoint, { 
            skipNegotiation,
            accessTokenFactory: token,
            transport: HttpTransportType[transport || 'WebSockets']
        })
        .withHubProtocol(protocol || (new JsonHubProtocol()))
        .build()

    reconnectInterval && (nativeSocket.reconnectPolicy = {
        nextRetryDelayInMilliseconds: () => reconnectInterval
    })
    serverTimeout && (nativeSocket.serverTimeoutInMilliseconds = serverTimeout)

    handlers.onreconnect && nativeSocket.onreconnected(handlers.onreconnect)
    handlers.onclose && nativeSocket.onclose(handlers.onclose)


    return {
        nativeSocket,
        on: nativeSocket.on.bind(nativeSocket),
        invoke(...args: any[]) {
            this.isAlive() && nativeSocket.invoke.apply(nativeSocket, args)
        },

        isAlive: () => nativeSocket.state === HubConnectionState.Connected,
        async runSocket(cb: () => void) {
            if (this.isAlive()) {
                cb?.call(this)
            } else if (isBusyStates.has(nativeSocket.state)) {
                setTimeout(() => { this.runSocket(cb) }, 800)
            } else {
                try {
                    await nativeSocket.start()
                    
                    cb?.call(this)
                    handlers.onopen?.call(this)
                } catch(err) {
                    handlers.onerror
                        ?   handlers.onerror.call(this, err)
                        :   console.error(err)
                }
            }
        },
        stopSocket() {
            this.isAlive() && nativeSocket.stop()
        }
    }
}


export { setDefaults }
export default createSignalRConnection