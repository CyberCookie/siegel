import { HubConnectionBuilder, HubConnectionState, HttpTransportType, JsonHubProtocol } from '@microsoft/signalr/dist/browser/signalr'


const defaults = {}
const setDefaults = params => defaults = params;

const createSignalRConnection = options => {
    let connectionParams = Object.assign({}, defaults, options)
    let { url, reconnectInterval, endpoint, transport, protocol, serverTimeout, skipNegotiation = true, handlers = {} } = connectionParams;
    

    let nativeSocket = new HubConnectionBuilder()
        .withUrl((url || window.location.origin) + endpoint, { 
            skipNegotiation,
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
        invoke(...args) {
            this.isAlive() && nativeSocket.invoke.apply(nativeSocket, args)
        },

        isAlive: () => nativeSocket.state === HubConnectionState.Connected,
        async runSocket(cb) {
            if (this.isAlive()) {
                cb && cb.call(this)
            } else if (nativeSocket.state === HubConnectionState.Connecting || nativeSocket.state === HubConnectionState.Reconnecting) {
                setTimeout(() => this.runSocket(cb), 800)
            } else {
                try {
                    await nativeSocket.start()
                    
                    cb && cb.call(this)
                    handlers.onopen && handlers.onopen(this)
                } catch(err) {
                    handlers.onerror
                        ?   handlers.onerror(this, err)
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