# Network


## Request

### FetchAPI wrapper to make requests with.

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

### setupReqest

**Function** to setupp **request** API to use in further requests<br />
Receives **1** argument - **Object** wit the next fields:

- `beforeParse` - **Function**. Triggered before request **Object** is beeing parsed<br />
    Has **1** argument:
    - **reqParams** - **ReqParams**. Concrete request's request params. (Read below)

- `beforeRequest` - **Function**. Triggered right before **Fetch API** call<br />
    Has **1** argument:
    - **reqData** - **Mutable Object**. Holds request data further passed to **Fetch API**<br />
        **Object** has the next fields:
        - `initialURL` - **String**. URL passed to request to make a request
        - `url` - **String**. URL to be passed to **Fetch API**
        - `options` - **Object**. Options to be passed to **Fetch API** **Object** can possibly have the next fields:
            - `body` - **Request** body
            - `method` - **Request** method
            - `credentials` - **Request** credentials
            - `headers` - **Request** headers
            - `signal` - **Request** signal

- `afterRequest` - **Function**. Triggered after successful request was made<br />
    Has **2** arguments:
    - **reqData** - **ReqParams**. Data used to make a request
    - **parsedRes** - **Any | Object**. Response data<br />
        Can be **Object** if **ReqParams.isFullRes** was set to **true**. **Object** has the next fields:
        - `status` - **Number**. Response status code
        - `statusText` - **String**. Response status text
        - `headers` - **ReqParams.headers**. Headers that was used in this request
        - `data` - **Any**. Response data

- `errorHandler` - **Function**. Triggered if request was failure<br />
    Has **1** argument:
    - **error** - **Object** with the next fields:
        - `status` - Same as **status** in **afterRequest** callback
        - `message` - Same as **statusText** in **afterRequest** callback
        - `res` - Same as **parsedRes** in **afterRequest** callback
        - `req` - Same as **reqData** in **afterRequest** callback

- `json` - **Boolean**. Default is **false**<br />
    Applies json content type to headers and parses response as json


<br /><br />

### HEADERS

Request headers constants used in **request**.

<br />

### CONTENT_TYPE

Content-type header values used in **request**.

<br />

### ReqParams

**Object** to hold concrete request parameters:

<br />

- `url` - **String**<br />
    Request URL. Can include url params: _someurl/:param1/:param2_

- `params` - **Object** where _key_ is parameter ID and _value_ is parameter value<br />
    URL params that was included to URL

- `query` - **String | Object**<br />
    If object provided then _key_ is query ID and _value_ is query value<br />
    URL query params

- `method` - **String** Default is **'GET'**<br />
    Request method

- `body` - **Any valid request body**<br />
    Request payload

- `headers` - **Object** where _key_ is header ID and _value_ is header value<br />
    Request headers

- `parseMethod` - **String**<br />
    Method to be executed on response to retrieve actual data<br />
    By default **request** sets this prop regarding to response content type

- `credentials` - **String**<br />
    Request credentials

- `json` - Same as **beforeRequest** in **setupRequest Object**

- `preventSame` - **Boolean**. Default is **true**<br />
    Prevents request if the same request is already processing<br />
    Same request is a request with the same **url** **method** and **stringified body**

- `signal` - **(new AbortController()).signal**<br />
    Terminates request and prevents browser from response handling

- `isFullRes` - **Boolean** Default is **false**<br />
    Returns full response with headers, status code etc.

- `beforeRequest` - Same as **beforeRequest** in **setupRequest Object**



<br /><br /><br />

## Socket

### Simple WebSocket wrapper to establish socket connections with a server

<br />

```js
import createSocket from 'siegel-network/socket'

const socket = createSocket({
    url: location.hostname
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

### CreateSocketParams

#### Socket connection parameters and events. All the params are optional

<br />

- `url` - **String** Default is **location.hostname**<br />
    Socket connection URL<br/>

- `port` - **Number**<br />
    Socket connection port<br />

- `path` - **String**<br />
    Socket connection URL path<br />

- `wss` - **Boolean** Default is **false**<br />
    Enable secure socket protocol<br />

- `messageTypeKey` - **String** Default is **'type'**<br />
    To make it possible to subscribe on different messages, we need to know<br />
    a message field that holds message type string

- `payloadKey` - **String** Default is **'data'**<br />
    Message field to place payload in<br />

- `reconnectInterval` - **Number**<br />
    Socket reconnect interval in ms. , if socket connection error occurs<br />

- `serverTimeout` - **Number**<br />
    Closes socket connection if no messages has been received from a server<br />
    during `serverTimeout` ms<br />
    Triggers **onerror** event with no arguments passed to<br /> 

- `ping` - **Object**<br />
    Ping message to be sent on a server every **interval** ms with **payload** data<br />
    **Object** has the next fields:
    - `interval` - **Number**<br />
            Ping message interval in ms<br />
    - `payload` - **String | Blob | ArrayBufferLike | ArrayBufferView**<br />
            Ping message payload of any type<br />

- `parseIncommingMsg` - **(e: MessageEvent) => any**<br />
    Socket incomming message parse function where you can apply your custom algorithm<br />
    Default message parser is **JSON.parse()**<br />
    Parsed message must contain **messageTypeKey** and **payloadKey** fields to maket it<br />
    possible to trigger message subscribe handlers<br /> 

- `serializeOutcommingMsg` - **<br />
    (serializeParams: {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageTypeKey: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messageType: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payloadKey: string<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payload: any<br />
    }) => string | Blob | ArrayBufferLike | ArrayBufferView**<br />
    Constructs a message to be sent on a server<br />
    By default serialization is made by **JSON.stringify()** using<br/>
    **messageTypeKey** and **payloadKey** fields to store messageType and payload accordingly<br />

- `events` - **Object**<br />
    Different events that are fired during a socket connection lifecycle you may listen to<br />
    - `onopen` - **(e: Event) => void**<br />
        Triggered after connection has been established<br />

    - `onreconnect` - **Function** That is triggered after successful reconnection<br />
        Has **1** argument:
        - **event** - **Event**<br /><br />

    - `onmessage` - **(e: MessageEvent, parsedMessage: any) => void**<br />
        Triggers when message is received<br />
        
    - `onclose` - **(e: CloseEvent) => void**<br />
        Triggers once socket connection has been clossed<br />

    - `onerror` - **(e?: Event) => void**<br />
        Triggres once an error is occured in a socket connection<br />
        **undefined** parameter means that connection was closed when **serverTimeout** has been elapsed