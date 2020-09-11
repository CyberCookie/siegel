//TODO: setState without "..."

import { useState, useLayoutEffect } from 'react'

import deepClone from '../utils/deep/clone'


type UseHookStore<T, A extends Actions<T>> = () => [
    T,
    A
]

type InnerStore<State extends Indexable> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: Actions<State>
}

type HookSetState<State extends Indexable> = React.Dispatch<React.SetStateAction<State>>

type SetState<State extends Indexable> = {
    (newState: State): void
}

type Actions<State extends Indexable> = {
    [actions: string]: (store: Required<InnerStore<State>>, ...args: any[]) => void
}


const setState: SetState<any> = function(this: Required<InnerStore<any>>, newState) {
    this.state = { ...newState }
    const listenersCount = this.listeners.length;

    for (let i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function bindActions
<State extends Indexable>
(store: Required<InnerStore<State>>, actions: Actions<State>) {

    for (const ACTION_ID in actions) {
        actions[ACTION_ID] = actions[ACTION_ID].bind(actions, store)
    }

    return actions
}

function useCustom(this: InnerStore<any>) {
    const newListener = useState()[1]
    
    useLayoutEffect(() => {
        this.listeners.push(newListener)
        
        return () => {
            this.listeners = this.listeners.filter((l: HookSetState<typeof this.state>) => l !== newListener)
        }
    }, [])

    return [ this.state, this.actions ]
}


function createHookStore
<S extends Indexable, A extends Actions<S>>
(initialState: S, actions: A, reset?: boolean) {
    type Store = InnerStore<S>

    const store: Store = {
        state: initialState,
        listeners: [],
        setState: undefined,
        actions: undefined
    }
    store.setState = setState.bind(store)
    store.actions = bindActions((store as Required<Store>), actions)

    
    let resetStore;
    if (reset) {
        const clonnedState = deepClone(initialState)
        resetStore = () => { store.setState!(clonnedState) }
    }


    return {
        resetStore,
        store: (store as Required<Store>), 
        useStore: (useCustom.bind(store) as UseHookStore<S, A>)
    }
}


export { Actions }
export default createHookStore