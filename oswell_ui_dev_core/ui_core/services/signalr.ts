import { HubConnectionBuilder, HttpTransportType, JsonHubProtocol } from '@aspnet/signalr/dist/browser/signalr'


const defaults = {}
const setDefaults = params => defaults = params;


const createSignalRConnection = options => {
    const connectionParams = Object.assign({}, defaults, options);
    const { url, reconnectInterval, endpoint, transport, protocol, serverTimeout, handlers = {} } = connectionParams;
    

    const nativeSocket = new HubConnectionBuilder()
        .withUrl((url || window.location.origin) + endpoint, { 
            transport: HttpTransportType[transport || 'WebSockets']
        })
        .withHubProtocol(protocol || (new JsonHubProtocol()))
        .build();

    serverTimeout && (nativeSocket.serverTimeoutInMilliseconds = serverTimeout)
    

    const socket = {
        nativeSocket,
        isAlive() {
            return nativeSocket.state === 1
        },
        connecting: false,
        async runSocket(cb) {
            if (this.isAlive()) {
                cb && cb.call(this)
            } else if (this.connecting) {
                setTimeout(() => { this.runSocket(cb) }, 800)
            } else {
                this.connecting = true;
                
                try {
                    await nativeSocket.start()
                    
                    cb && cb.call(this)
                    handlers.onopen && handlers.onopen.call(this)
                } catch(err) {
                    handlers.onerror
                        ?   handlers.onerror.call(this, err)
                        :   console.error(err);

                    reconnectInterval && setTimeout(() => { this.runSocket(cb) }, reconnectInterval)
                }

                this.connecting = false
            }
        },
        stopSocket() {
            this.isAlive() && nativeSocket.stop()
        },

        on: nativeSocket.on.bind(nativeSocket),

        invoke(...args) {
            this.isAlive() && nativeSocket.invoke.apply(nativeSocket, args)
        }
    }

    handlers.onclose && nativeSocket.onclose(handlers.onclose.bind(socket))
    

    return socket
}


export { setDefaults }
export default createSignalRConnection