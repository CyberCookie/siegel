import { HubConnectionBuilder, HttpTransportType, JsonHubProtocol } from '@aspnet/signalr/dist/browser/signalr';


const ALL_CONNECTIONS_PARAMS = {};
const DEFAULT_CONNECTION_NAME = '__default';
const CONNECTIONS = {};

const SET_ALL_CONNECTIONS_PARAMS = params => ALL_CONNECTIONS_PARAMS = params

const getSocket = socketKey => CONNECTIONS[socketKey || DEFAULT_CONNECTION_NAME]


const createSignalRConnection = (options, cb) => {
    let connectionParams = Object.assign({}, ALL_CONNECTIONS_PARAMS, options);
    let { connectionKey, url, endpoint, transport, protocol, serverTimeout, handlers = {} } = connectionParams;
        
    let socketConnection = new HubConnectionBuilder()
        .withUrl((url || window.location.origin) + endpoint, { 
            transport: HttpTransportType[transport || 'WebSockets']
        })
        .withHubProtocol(protocol || (new JsonHubProtocol()))
        .build();

    const successRunHandler = () => {
        handlers.onopen && handlers.onopen.call(socketConnection)
    };

    const errorRunHandler = err => {
        handlers.onerror && handlers.onerror.call(socketConnection, err)
    };

    serverTimeout && (socketConnection.serverTimeoutInMilliseconds = serverTimeout)
    handlers.onclose && socketConnection.onclose(handlers.onclose)

    socketConnection.runSocket = function() {
        if (this.connection.connectionState > 1) {
            this.start()
                .then(successRunHandler)
                .catch(errorRunHandler)
        } 
    }

    socketConnection.stopSocket = function() {
        this.connection.connectionState < 2 && this.stop()
    }

    socketConnection.isAlive = () => this.connection.connectionState === 1;

    CONNECTIONS[connectionKey || DEFAULT_CONNECTION_NAME] = socketConnection
    cb && cb(socketConnection)
}


export default createSignalRConnection
export { SET_ALL_CONNECTIONS_PARAMS, getSocket }