//TODO: setState without "..."
import { useState, useLayoutEffect } from 'react'

import deepClone from '../../utils/deep/clone'


type SetState<State = Indexable> = (newState: State) => void

type HookSetState<State = Indexable> = React.Dispatch<React.SetStateAction<State>>

type InnerStore<State = Indexable, A = ActionsUnbinded> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: ActionsBinded<A>
}

type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never

type ActionsUnbinded<State = Indexable> = {
    [actions: string]: (store: Required<InnerStore<State>>, ...args: any[]) => void
}

type ActionsBinded<A extends Indexable> = {
    [action in keyof A]: (...args: Tail<Parameters<A[action]>>) => void
}


const setState: SetState = function(this: Required<InnerStore>, newState) {
    this.state = { ...newState }
    const listenersCount = this.listeners.length;

    for (let i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function bindActions<State extends Indexable, A extends Indexable>
(store: InnerStore<State, A>, actions: A & ActionsBinded<A>): ActionsBinded<A> {
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
            this.listeners = this.listeners.filter((l: HookSetState) => l !== newListener)
        }
    }, [])

    return [ this.state, this.actions ]
}

function createHookStore
<S extends Indexable, A extends Indexable>
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
    store.actions = bindActions(store, actions)

    
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


export { InnerStore }
export default createHookStore