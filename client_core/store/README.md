<h1>State managers</h1>


<h3>Hook Store</h3>

<ul>
    Store creator accepts three arguments:
    <li>initialState - object</li>
    <li>actions - object</li>
    <li>with reset - boolean</li>
</ul>

example:

```js
import React, { useLayoutEffect } from 'react'
import createHookStore from 'siegel-store/hook_store'


// create store
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


// you can work with the store directly
const storeUpdate = store.actions.update;
storeUpdate(Date.now())


//or to use inside some component subscribing this store to it.
const Component = () => {
    // subscribe on store changes
    const [ state, actions ] = useStore()
    
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

Also your state is populates with `__updated` property which increments every time state has changed.<br />
The counter resets to zero when no subscibed components left.<br />
It can help you to avoid unnecessary rerenders in combinations with such hooks as useMemo or useDidUpdate.

```js
import React, { useMemo } from 'react'
import createHookStore from 'siegel-store/hook_store'
import useDidUpdate from 'siegel-store/fetch_module'

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
import { setup } from 'siegel-services/request'
import fetchModule from 'siegel-store/hook_store/fetch_module'

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
import fetchModule from 'siegel-store/hook_store/fetch_module'

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


<br /><br />
<h4>redux</h4>
docs will be soon...