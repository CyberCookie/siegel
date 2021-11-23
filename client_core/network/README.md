<h1>Network</h1>


<h2>Request</h2>
<h3>FetchAPI wrapper to make requests with.</h3>
<br />


```js
import setupRequest, { HEADERS, CONTENT_TYPE } from 'siegel-network/request'

const request = setupRequest(config: ReqSetup)

request<Res, ReqBody>(options: ReqParams)
    .then(({ res, err }) => {
        if (res) ...
    })

```

<br />
<h3>ReqParams</h3>
<h4>Concrete request parameters object</h4><br />

- `url`: <b>string</b><br />
    Request URL. Can include url params: <i>someurl/:param1/:param2</i><br/>

- `params`: <b>Record< string, string ></b><br />
    URL params that will be included in URL.<br/>

- `query`: <b>string | Record< string, string ></b></br>
    URL query params.<br />

- `method`: <b>string</b> Default is <b>GET</b><br />
    Request method.<br />

- `body`: <b>Any valid request body</b><br />
    Request payload.<br />

- `headers`: <b>Record< string, string ></b><br />
    Request headers.<br />

- `parseMethod`: <b>string</b><br />
    Method to be executed on response to retrieve actual data.<br />
    By default request service sets this prop regarding to response content type.<br />

- `credentials`: <b>string</b><br />
    Request credentials.<br />

- `json`: <b>boolean</b> Default is <b>false</b><br />
    Applies json content type to headers and parses response as json.<br />

- `preventSame`: <b>boolean</b> Default is <b>true</b><br />
    Prevents request if the same request is already processing.<br />
    Same request is a request with the same <b>url</b> <b>method</b> and <b>stringified body.</b><br />

- `signal`: <b>Request signal</b><br />
    Terminates request and prevents browser from response handling.<br />

- `isFullRes`: <b>boolean</b> Default is <b>false</b> <br />
    Returns full response with headers, status code etc...<br />

- `beforeRequest`: <b>(reqData: Parameters< typeof fetch >) => void</b><br />
    Triggers right before fetch call.<br />
    <b>reqData</b> argument has url and options props, compatible with browser fetch.<br />
    <b>reqData</b> argument is mutable.<br />


<br />
<h3>ReqSetup</h3>
<h4>Every request parameters object</h4><br />

- `beforeParse`: <b>(reqParams: ReqParams) => void | Promise< ReqParams ></b><br />
    Triggers before request options are parsed into compatible fetch api options.<br />
    <b>reqParams</b> argument is mutalbe.<br />

- `beforeRequest`: <b>ReqParams . beforeRequest</b><br />

- `afterRequest`: <b>(reqData, parsedRes) => void</b><br />
    This hook is calling after successful request was made.<br />

- `errorHandler`: <b>(error) => void </b><br />
    Triggers after unsuccessful request.<br />
    <b>error</b> argument contains information about error and <b>reqData</b>.<br />

- `json`: <b>ReqParams . json</b> <br />


<br />
<h3>HEADERS</h3>
<h4>Request headers constants used in <b>request</b> service</h4><br />


<br />
<h3>CONTENT_TYPE</h3>
<h4>Content-type header values used in <b>request</b> service</h4><br />



<br /><br /><br />
<h2>Socket</h2>
<h3>Simple WebSocket wrapper to establish socket connections with a server</h3>
<br />


```js
import createSocket from 'siegel-network/socket'

const socket = createSocket({
    url: window.location.hostname
    port: 9000
}: CreateSocketParams)


socket
    .on('messageType', data => {
        //...process message
    })
    .on('anotherMessageType', data => {
        //...process message
    })

socket.send('messageType', payload)

```

<br />
<h3>CreateSocketParams</h3>
<h4>Socket connection parameters and events. All the params are optional</h4><br />

- `url`: <b>string</b> Default is <b>window.location.hostname</b><br />
    Socket connection URL.<br/>

- `port`: <b>number</b><br />
    Socket connection port.<br/>

- `path`: <b>string</b></br>
    Socket connection URL path.<br />

- `wss`: <b>boolean</b> Default is <b>false</b><br />
    Enable secure socket protocol.<br />

- `messageTypeKey`: <b>string</b> Default is <b>type</b><br />
    To make it possible to subscribe on different messages, we need to know<br />
    a message field that holds message type string. 

- `payloadKey`: <b>string</b> Default is <b>data</b><br />
    Message field to place payload in.<br />

- `reconnectInterval`: <b>number</b><br />
    Socket will try to reconnect every <b>reconnectInterval</b> ms., when socket connection error occures.<br />

- `serverTimeout`: <b>number</b><br />
    Closes socket connection if no messages has been received from a server<br />
    during <b>serverTimeout</b> ms.<br />
    Triggers <b>onerror</b> event with no arguments passed to. <br /> 

- `ping`: <b>object</b><br />
    Ping message to be sent on a server every <b>interval</b> ms with <b>payload</b> data.
    -   `interval`: <b>number</b><br />
        Ping message interval in ms.<br />
    -   `payload`: <b>string | Blob | ArrayBufferLike | ArrayBufferView</b><br />
        Ping message payload of any type. <br /><br />

- `parseIncommingMsg`: <b>(e: MessageEvent) => any</b><br />
    Socket incomming message parse function where you can apply your custom algorithm.<br />
    Default message parser is JSON.parse()<br />
    Parsed message must contain <b>messageTypeKey</b> and <b>payloadKey</b> fields to maket it<br />
    possible to trigger message subscribe handlers.<br /> 

- `serializeOutcommingMsg`: <b><br />
    (serializeParams: {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageTypeKey: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageType: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payloadKey: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payload: any<br />
    }) => string | Blob | ArrayBufferLike | ArrayBufferView</b><br />
    Constructs a message to be sent on a server.<br />
    By default serialization is made by <b>JSON.stringify</b> using<br/>
    <b>messageTypeKey</b> and <b>payloadKey</b> fields to store messageType and payload accordingly.<br />

- `events`: <b>object</b><br />
    Different events that are fired during a socket connection lifecycle you may listen to.<br />
    - `onopen`: <b>(e: Event) => void</b><br />
        Triggered after connection has been established.<br />

    - `onreconnect`: <b>(e: Event) => void</b><br />
        Triggers after successful reconnection.<br />

    - `onmessage`: <b>(e: MessageEvent, parsedMessage: any) => void</b><br />
        Triggers when message is received.<br />
        
    - `onclose`: <b>(e: CloseEvent) => void</b><br />
        Triggers once socket connection has been clossed.<br />

    - `onerror`: <b>(e?: Event) => void</b><br />
        Triggres once an error is occured in a socket connection<br />
        Undefined parameter means that connection was closed when <b>serverTimeout</b> has been elapsed.