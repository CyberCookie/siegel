<h1>Services</h1>


<h2>Request</h2>
<h3>FetchAPI wrapper to make request with.</h3>
<br />


```js
import setupRequest, { HEADERS, CONTENT_TYPE } from 'siegel-services/request'

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

- `method`: <b>string</b> Default is GET<br />
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

- `json`: <b>boolean</b> Default is false<br />
    Applies json content type to headers and parses response as json<br />

- `preventSame`: <b>boolean</b> Default is true<br />
    Prevents request if the same request is already processing.<br />
    Same request is a request with the same <b>url</b> <b>method</b> and <b>stringified body</b><br />

- `signal`: <b>Request signal</b><br />
    Terminates request and prevents browser from response handling<br />

- `isFullRes`: <b>boolean</b> Default is false <br />
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
    This hook is calling after successfull request was made.<br />

- `errorHandler`: <b>(error) => void </b><br />
    Triggers after unsuccessfull request.<br />
    <b>error</b> argument contains information about error and <b>reqData</b>.<br />

- `json`: <b>ReqParams . json</b> <br />


<br />
<h3>HEADERS</h3>
<h4>Request headers constants used in <b>request</b> service</h4><br />


<br />
<h3>CONTENT_TYPE</h3>
<h4>Content-type header values used in <b>request</b> service</h4><br />



<br /><br /><br />
<h3>Socket</h3>
<h4>docs will be soon</h4>


<br /><br /><br />
<h3>SignalR</h3>
<h4>docs will be soon</h4>