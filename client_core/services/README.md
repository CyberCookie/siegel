<h1>Services</h1>


<h3>Request</h3>
Wrapper around FetchAPI with more convinient interface to make your request easier.<br />

```js
import request from 'siegel-services/request'

request({
    /*
        request URL.
        Can include url params: someurl.com/:param1/:param2
    */
    url: 'someurl.com', 

    /*
        request method.
        GET is by default.
        If body is using then POST is default
    */
    method: 'PUT',

    /* Request body */
    body: {
        some: 'data'
    },

    /* URL params that will be included in URL */
    params: {
        param1: 'paramValue1',
        param2: 'paramValue2'
    },

    /*
        Query params.
        Can also be a string 
    */
    query: {
        param1: 42,
        param2: 'some param'
    },

    /* Request headers */
    headers: {
        auth: 'token',
        contentType: 'application/json'
    },

    /* fetch credentials setup */
    credentials: 'same-origin',

    /*
        Method to be executed on response to retrieve actual data.
        By default request service sets this prop regarding to response content type.
    */
    parseMethod: 'json'
})
```


<br />
<h4>Request service can also be configured with beforeRequest, afterRequest and errorHandler hooks:</h4>
<br />

```js
import { setup } from 'siegel-services/request'

setup({
    beforeRequest(request) {
        request.url = 'api/' + request.url;

        //return a promise to make the inerceptor asynchronous
        return (new Promise(resolve => {
            setTimeout(() => { resolve(request) }, 1000)
        })).catch(console.error)
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

Sending JSON body
```js
import request, { HEADER_CONTENT_TYPE } from 'siegel-services/request'

request({
    url: 'some.url',
    headers: {
        [ HEADER_CONTENT_TYPE ]: 'application/json'
    },
    body: JSON.stringify({ some_data: 42 })
})
```


<br /><br />
<h4>signalr</h4>
docs will be soon