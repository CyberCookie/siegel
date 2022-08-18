import { useState, useLayoutEffect } from 'react'

import type {
    SetState, HookSetState,
    HookStore, InnerStore, StateWithUpdater,
    ActionsUnbinded, ActionsBinded, ActionBinded
} from './types'


const setState: SetState<Indexable> = function(this: HookStore<any, any>, newState) {
    newState.__updated++
    this.state = { ...newState }
    const listenersCount = this.listeners.length

    for (let i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function useCustom(this: InnerStore<any, any>) {
    const newListener = useState()[1]

    useLayoutEffect(() => {
        this.listeners.push(newListener)

        return () => {
            this.listeners = this.listeners.filter((l: HookSetState<any>) => l !== newListener)
            this.listeners.length || (this.state.__updated = 0)
        }
    }, [])

    return [ this.state, this.actions ]
}

function bindActions
(store: HookStore<any, any>, actions: ActionsUnbinded<any>) {
    for (const ACTION_ID in actions) {
        actions[ACTION_ID] = actions[ACTION_ID].bind(actions, store)
    }

    return actions as ActionsBinded<typeof actions>
}

const getInitialState = <S extends Indexable>(defaultStateResolve: () => S) => {
    type State = StateWithUpdater<S>

    const state = defaultStateResolve()
    ;(state as State).__updated = 0

    return state as State
}


function createStore
<S extends Indexable, A extends ActionsUnbinded<S>>
(initialStateResolver: () => S, actions: A) {
    type State = StateWithUpdater<S>

    type StoreUninitialized = InnerStore<State, A>
    type Store = Required<StoreUninitialized>


    const store: StoreUninitialized = {
        listeners: [],
        state: getInitialState(initialStateResolver)
    }
    store.setState = setState.bind(store)
    store.actions = (bindActions(store as Store, actions) as ActionsBinded<A>)


    return {
        store: (store as Store),
        useStore: (useCustom.bind(store) as () => [ State, Store['actions'] ]),
        reset() {
            store.setState!(
                getInitialState( initialStateResolver )
            )
        }
    }
}


export default createStore
export type { HookStore, ActionBinded }