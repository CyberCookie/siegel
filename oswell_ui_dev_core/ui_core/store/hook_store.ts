import { useState, useLayoutEffect } from 'react'


type Actions = {
    [action: string]: Function
}

type SetState = {
    (this: StoreBase, newState: Indexable): void
}

type HookSetState = React.Dispatch<React.SetStateAction<any>>

type StoreBase = {
    state: Indexable,
    listeners: HookSetState[],
    actions?: Actions,
}

type Store = {
    setState: SetState
} & StoreBase



const setState: SetState = function(this, newState) {
    this.state = { ...newState }
    let listenersCount = this.listeners.length

    for (var i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function useCustom(this: Store) {
    const newListener = useState()[1]
    
    useLayoutEffect(() => {
        this.listeners.push(newListener)
        
        return () => {
            this.listeners = this.listeners.filter((l: HookSetState) => l !== newListener)
        }
    }, [])

    return [ this.state, this.actions ]
}

function bindActions(store: Store, actions: Actions) {
    const result: Indexable = {}
    for (let ACTION_ID in actions) {
        result[ACTION_ID] = actions[ACTION_ID].bind(null, store)
    }

    return result
}


const createHookStore = (initialState: Indexable, actions: Actions) => {
    const store: StoreBase = { state: initialState, listeners: [] };
    (store as Store).setState = setState.bind(store);

    actions && (store.actions = bindActions(<Store>store, actions))

    
    return {
        useStore: useCustom.bind(<Store>store),
        store
    }
}


export default createHookStore