import { useState, useLayoutEffect } from 'react'

import type {
    SetState, StoreShouldUpdate,
    HookStore, InnerStore, StateWithUpdater, StoreListenerWithPrevState,
    ActionsUnbinded, ActionsBinded, ActionBinded
} from './types'


const setState: SetState<Obj> = function(this: HookStore<{}, any>, newState) {
    const prevUpdated = this.state.__updated || 0
    const prevState = this.state

    newState.__updated ||= prevUpdated
    newState.__updated!++
    this.state = { ...newState as StateWithUpdater<{}> }

    prevState.__updated = prevUpdated


    for (let i = 0, l = this.listeners.length; i < l; i++) {
        const listener = this.listeners[i]
        ;(listener as StoreListenerWithPrevState).withShouldUpdateCb
            ?   listener(this.state, prevState)
            :   (listener as Exclude<typeof listener, StoreListenerWithPrevState>)(this.state)
    }
}


function useCustom(this: InnerStore<any, any>, shouldUpdate?: any) {
    type NewListener = React.Dispatch<React.SetStateAction<any>> | StoreListenerWithPrevState


    let newListener: NewListener = useState()[1]
    if (shouldUpdate) {
        const storeAction = newListener

        newListener = (((newState, prevState) => {
            shouldUpdate(prevState, newState) && storeAction(newState)
        }) as StoreListenerWithPrevState)
        ;(newListener as StoreListenerWithPrevState).withShouldUpdateCb = true
    }

    useLayoutEffect(() => {
        this.listeners.push(newListener)

        return () => {
            this.listeners = this.listeners.filter(listener => listener !== newListener)
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


const getInitialState = <S extends Obj>(defaultStateResolve: () => S) => {
    type State = StateWithUpdater<S>

    const state = defaultStateResolve()
    ;(state as State).__updated = 0

    return state as State
}


function createStore
<S extends Obj, A extends ActionsUnbinded<S>>
(initialStateResolver: () => S, actions: A) {
    type State = StateWithUpdater<S>

    type StoreUninitialized = InnerStore<State, A>
    type Store = Required<StoreUninitialized>

    type UseStore = (shouldUpdate?: StoreShouldUpdate<State>) => [ State, Store['actions'] ]


    const store: StoreUninitialized = {
        listeners: [],
        state: getInitialState(initialStateResolver)
    }
    store.setState = setState.bind(store)
    store.actions = (bindActions(store as Store, actions) as ActionsBinded<A>)


    return {
        /** Store */
        store: (store as Store),

        /** Hook which subscribes component to the store */
        useStore: (useCustom.bind(store) as UseStore),

        /** Resets store state to its default state */
        reset() {
            store.setState!(
                getInitialState( initialStateResolver )
            )
        }
    }
}


export default createStore
export type { HookStore, ActionBinded }