# Hook Store


Store creator receives **2** parameters:

- `getInitialState` - **Function**. Returns initial state

- `actions` - **Object**. Store actions, where _key_ is action name and _value_ is action **Function**


```ts
import React, { useLayoutEffect } from 'react'
import createStore from 'siegel/lib/client_core/store'


const getInitialState = () => ({
    someKey: 0,
    anotherKey: 'str'
})

const actions = {
    storeUpdateSomeKey(store, data) {
        const { state, setState } = store
        state.someKey = data
        setState(state) // {...} object is destructuring under the hood
    },
    storeUpdateAnotherKey(store, data) {
        const { state, setState } = store
        state.anotherKey = data
        setState(state)
    }
}

const { store, useStore, reset } = createStore(getInitialState, actions)


// you can work with the store directly
const { storeUpdate } = store.actions
storeUpdate(Date.now())


//or by subscribing to the store in some component
const Component = () => {
    // subscribe to the store changes
    const [
        { someKey },
        { storeUpdateSomeKey, storeUpdateAnotherKey }
    ] = useStore(
        // Optional shouldUpdate callback to prevent unnecessary renders
        (prevState, nextState => prevState.someKey != nextSate.someKey)
    )
    
    // reset store to inital state anytime you need
    useLayoutEffect(() => {
        return () => { reset() }
    }, [])
    
    
    return (
        <div>
            <div onMouseDown={() => { storeUpdateSomeKey(Date.now()) }}>
                { someKey }
            </div>

            <div onMouseDown={() => { storeUpdateAnotherKey(`${Date.now()}`) }} />
        </div>
    )
}
```

<br />

Also your state is populates with `__updated` property which increments every time state has changed<br />
The counter resets to zero when no subscribed components left<br />
It can help you to avoid unnecessary renders in combinations with such hooks as useMemo or useDidUpdate

```ts
import React, { useMemo } from 'react'
import createStore from 'siegel/lib/client_core/store'
import useDidUpdate from 'siegel/lib/client_core/hooks/did_update'

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