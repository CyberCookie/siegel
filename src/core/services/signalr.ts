import { HubConnectionBuilder, HttpTransportType, JsonHubProtocol } from '@aspnet/signalr/dist/browser/signalr';


const defaults = {};

const setDefaults = params => defaults = params;


const createSignalRConnection = options => {
    let connectionParams = Object.assign({}, defaults, options);
    let { url, reconnectInterval, endpoint, transport, protocol, serverTimeout, handlers = {} } = connectionParams;
    

    let nativeSocket = new HubConnectionBuilder()
        .withUrl((url || window.location.origin) + endpoint, { 
            transport: HttpTransportType[transport || 'WebSockets']
        })
        .withHubProtocol(protocol || (new JsonHubProtocol()))
        .build();

    serverTimeout && (nativeSocket.serverTimeoutInMilliseconds = serverTimeout)
    

    let socket = {
        nativeSocket,
        isAlive() {
            return this.nativeSocket.connectionState === 1
        },
        async runSocket() {
            if (!this.isAlive()) {
                try {
                    await this.nativeSocket.start()
                    handlers.onopen && handlers.onopen.call(this)
                } catch(err) {
                    handlers.onerror
                        ?   handlers.onerror.call(this, err)
                        :   console.error(err)

                    reconnectInterval && setTimeout(() => this.runSocket(), reconnectInterval)
                }
            }
        },
        stopSocket() {
            this.isAlive() && this.nativeSocket.stop()
        },

        on: nativeSocket.on.bind(nativeSocket),
        invoke: nativeSocket.invoke.bind(nativeSocket)
    }

    handlers.onclose && nativeSocket.onclose(handlers.onclose.bind(socket))
    

    return socket
}


export { setDefaults }
export default createSignalRConnection