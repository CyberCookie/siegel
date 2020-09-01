# ui_core
Front-end related part compatible with all modern browsers that includes:
Services to work with api (wrappers around SignalR client and browser's FetchAPI);
Utils and helpers to compute some common operations;
Service worker that provides the best caching strategy; 
React related parts:
    - Widely used UI components that are lightweight, perfomant and - - highly configurable;
    - Hook state manager or redux abstractions for those dinosaurs who still uses it :)
    - React-router-dom wrapper to provide more declarative interface to build routers of any complexity.

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

##### signalr
...

### State managers
##### hook_store
Store creator accepts three arguments:
- initialState - object
- actions - object
- with reset - boolean
example:
```js
// module.js
import createHookStore from 'essence-store/hook_store'

const initState = {
    someKey: 0
}

const actions = {
    update(store, data) {
        const { state, setState } = store;
        state.someKey = data;
        setState(state)
    }
}

const { store, useStore, reset } = createHookStore(initState, actions)

export { store, reset }
export default useStore
```
```js
// some component
import React, { useLayoutEffect } from 'react'
import moduleStore, { store, reset } from './module.js'

// you may use store actions directly in any part of your app
const storeUpdate = store.actions.update;
storeUpdate(Date.now())

const Component = () => {
    // subscribe on store changes
    const [ state, actions ] = moduleStore()
    
    // reset store to inital state anytime
    useLayoutEffect(() => {
        return () => { reset() }
    }, [])
    
    
    return (
        <div onMouseDown={() => { actions.update(Date.now()) }}>
            { state.someKey }
        </div>
    )
}
```

Hook store provides ready to use `fetch module` which is usefull for requests tracking in order to spin some loaders. Docs will be soon...

##### redux
...

### router
...
### utils
...
### components



