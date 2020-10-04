//TODO: setState without "..."
import { useState, useLayoutEffect } from 'react'

import deepClone from '../../utils/deep/clone'


type SetState<State extends Indexable = Indexable> = (newState: State) => void

type HookSetState<State extends Indexable = Indexable> = React.Dispatch<React.SetStateAction<State>>

type InnerStore<State extends Indexable = Indexable, A extends ActionsUnbinded<State> = ActionsUnbinded<State>> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: ActionsBinded<A>
}


type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never
type ActionsBinded<A extends ActionsUnbinded<any>> = {
    [action in keyof A]: (...args: Tail<Parameters<A[action]>>) => ReturnType<A[action]>
}
type ActionsUnbinded<State extends Indexable = Indexable> = {
    [actions: string]: (store: Required<InnerStore<State>>, ...args: any[]) => void
}


const setState: SetState = function(this: Required<InnerStore>, newState) {
    this.state = { ...newState }
    const listenersCount = this.listeners.length;

    for (let i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function useCustom(this: InnerStore<any, any>) {
    const newListener = useState()[1]
    
    useLayoutEffect(() => {
        this.listeners.push(newListener)
        
        return () => {
            this.listeners = this.listeners.filter((l: HookSetState) => l !== newListener)
        }
    }, [])
    
    return [ this.state, this.actions ]
}

function bindActions
(store: Required<InnerStore<any, any>>, actions: ActionsUnbinded<any>) {
    for (const ACTION_ID in actions) {
        actions[ACTION_ID] = actions[ACTION_ID].bind(actions, store)
    }

    return actions as ActionsBinded<typeof actions>
}


function createHookStore
<S extends Indexable, A extends ActionsUnbinded<S>>
(initialState: S, actions: A, reset?: boolean) {
    type StoreUnbinded = InnerStore<S, A>
    type StoreInitialized = Required<StoreUnbinded>
    

    const store: StoreUnbinded = {
        state: initialState,
        listeners: [],
        setState: undefined,
        actions: undefined
    }
    store.setState = setState.bind(store)
    store.actions = (bindActions(store as StoreInitialized, actions) as ActionsBinded<typeof actions>)

    
    let resetStore;
    if (reset) {
        const clonnedState = deepClone(initialState)
        resetStore = () => { store.setState!(clonnedState) }
    }


    return {
        resetStore,
        store: (store as StoreInitialized), 
        useStore: (useCustom.bind(store) as () => [ S, StoreInitialized['actions'] ])
    }
}


export default createHookStore
export type { InnerStore, ActionsUnbinded }