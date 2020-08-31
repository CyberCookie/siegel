# ui_core
Client side related code is located here. It's probably the main essence part.

#### Services
##### request
Wrapper around FetchAPI with more convinient interface to make your request easier.
Request serice accepts the next request options:
```js
import request from 'essence-services/request'

request({
    url: 'someurl.com',
    method: 'PUT', // GET by default. Or POST if you pass body data.
    body: {
        some: 'data'
    },
    query: {
        param1: 42,
        param2: 'some param'
    },
    headers: {
        auth: 'token',
        contentType: 'application/json'
    },
    credentials: 'same-origin',
    parseMethod: 'json' // method to be executed on response to retrieve actual data. By default request service sets this prop regarding to response content type
})
```
Request service can also be configured with beforeRequest, afterRequest and errorHandler hooks
```js
import { setup } from 'essence-services/request'

setup({
    beforeRequest(request) {
        request.url = 'api/' + request.url;
    },
    afterRequest(request, parsedResponse) {
        /* do some logic */
    },
    errorHandler(error) {
        let { req, res, status, message } = error;
        console.error(`${status}. ${message}`)
    }
})
```

#### signalr