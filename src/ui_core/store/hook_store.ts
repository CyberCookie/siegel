//TODO: setState without "..."
import { useState, useLayoutEffect } from 'react'

import deepClone from '../utils/deep/clone'


type UseHookStore<T extends Indexable, A extends ActionsUnbinded<T>> = () => [ T, A ]

type SetState<State extends Indexable> = (newState: State) => void

type HookSetState<State extends Indexable> = React.Dispatch<React.SetStateAction<State>>




type InnerStore<State extends Indexable, A extends ActionsUnbinded<State>> = {
    state: State
    listeners: HookSetState<State>[]
    setState?: SetState<State>
    actions?: _BindedActions<State, A>//ActionsUnbinded<State>
}

type ActionsUnbinded<State extends Indexable> = {
    [actions: string]: (store: Required<InnerStore<State, ActionsUnbinded<State>>>, ...args: any[]) => void//Action<State>
}

type _BindedActions<S, A extends ActionsUnbinded<S>> = {
    [action: string]: (
        // #TS_sucks
        p1?: Parameters<A[keyof A]>[1],
        p2?: Parameters<A[keyof A]>[2],
        p3?: Parameters<A[keyof A]>[3],
        p4?: Parameters<A[keyof A]>[4],
        p5?: Parameters<A[keyof A]>[5]
    ) => void
}

const setState: SetState<any> = function(this: Required<InnerStore<any, any>>, newState) {
    this.state = { ...newState }
    const listenersCount = this.listeners.length;

    for (let i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function bindActions
<State extends Indexable, A extends ActionsUnbinded<State>>
(store: Required<InnerStore<State, A>>, actions: A) {
    const bindedActions: _BindedActions<State, A> = {}

    for (const ACTION_ID in actions) {
        bindedActions[ACTION_ID] = actions[ACTION_ID].bind(bindedActions, store)
    }

    return bindedActions
}

function useCustom(this: InnerStore<any, any>) {
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
<S extends Indexable, A extends ActionsUnbinded<S>>
(initialState: S, actions: A, reset?: boolean) {
    type Store = InnerStore<S, A>
    type StoreInitialized = Required<Store>

    const store: Store = {
        state: initialState,
        listeners: [],
        setState: undefined,
        actions: undefined
    }
    store.setState = setState.bind(store)
    store.actions = bindActions((store as StoreInitialized), actions)

    
    let resetStore;
    if (reset) {
        const clonnedState = deepClone(initialState)
        resetStore = () => { store.setState!(clonnedState) }
    }


    return {
        resetStore,
        store: (store as StoreInitialized), 
        useStore: (useCustom.bind(store) as UseHookStore<S, StoreInitialized['actions']>)
    }
}


export { ActionsUnbinded }
export default createHookStore