# Hook Store


Store creator receives **3** parameters:

- `initialState` - **Object**. Store state

- `actions` - **Object**. Store actions, where _key_ is action name and _value_ is action **Function**

- `withReset` - **Boolean**. Whether to create state reset function that will be returned along with **store** and **useStore** hook


```js
import React, { useLayoutEffect } from 'react'
import createStore from 'siegel-store'


// create a store
const initState = {
    someKey: 0
}
const actions = {
    update(store, data) {
        const { state, setState } = store;
        state.someKey = data;
        setState(state) // {...} object is destructuring under the hood
    }
}
const { store, useStore, reset } = createStore(initState, actions)


// you can work with the store directly
const storeUpdate = store.actions.update;
storeUpdate(Date.now())


//or by subscribing to the store in some component.
const Component = () => {
    // subscribe to the store changes
    const [ state, actions ] = useStore()
    
    // reset store to inital state anytime if needed
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

<br />

Also your state is populates with `__updated` property which increments every time state has changed<br />
The counter resets to zero when no subscibed components left<br />
It can help you to avoid unnecessary rerenders in combinations with such hooks as useMemo or useDidUpdate.

```js
import React, { useMemo } from 'react'
import createStore from 'siegel-store'
import useDidUpdate from 'siegel-hooks/did_update'

import someHookStore from './module_a'
import anotherHookStore from './module_b'


const Component = () => {
    const [ someState ] = someHookStore()
    const [ anotherState ] = anotherHookStore()

    useDidUpdate(() => {
        console.log('Some state has updated!')
    }, [ someState.__updated ])


    return useMemo(
        () => <div>Awesome</div>,
        [ anotherState.__updated ]
    )
}


```

<br /><br />
Hook store provides ready to use `fetch module` which is usefull for requests tracking in order to spin some loader, for example.


```js
import { setup } from 'siegel-network/request'
import fetchModule from 'siegel-store/fetch_module'

const { addToReqQueue, removeFromReqQueue, addToErrRes } = fetchModule.store.actions;

setup({
    beforeRequest(req) {
        addToReqQueue(req.initialURL) // add request url to request queue
    },
    afterRequest(req) {
        /*
            success.
            First parameter: url to remove from request queue
            Second parameter: indicates whether to cleanup errors, matched with this url, Default: false
        */
        removeFromReqQueue(req.initialURL, true)
    },
    errorHandler(err) {
        addToErrRes(err.res, err.req.initialURL) // error: add error to err response queue
    }
})

```

```js
import React from 'react'
import fetchModule from 'siegel-store/fetch_module'

const trackURL = '/some_url/path'

const Component = () => {
    const [{ requests, lastError }, { getLastErrorMsgByURL }] = fetchModule()

    return (
        <div>
            { requests[trackURL]
                ?   `request [${trackURL}] is in progress`
                :   'no active requests'
            }

            <div>Error: { getLastErrorMsgByURL(trackURL).message }</div>
        </div>
    )
}
```