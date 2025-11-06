import { useState, useLayoutEffect } from 'react'

import type {
    StoreShouldUpdate, StateWithUpdater, StoreListenerWithPrevState,
    ActionsUnbinded, ActionsBinded, HookStore
} from './types'


function bindActions(store: HookStore<any, any>, actions: ActionsUnbinded<any>) {
    Object.keys(actions)
        .forEach(actionKey => {
            actions[actionKey] = actions[actionKey].bind(actions, store)
        })

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

    type Store = HookStore<S, A>
    type State = Store['state']
    type StoreListener = Store['listeners'][number]
    type _StoreListenerWithPrevState = StoreListenerWithPrevState<State>


    const store: MakePartialFields<Store, 'actions'> = {
        listeners: [],
        state: getInitialState(initialStateResolver),
        setState(newState) {
            const prevUpdated = store.state.__updated || 0
            const prevState = store.state
            prevState.__updated = prevUpdated

            newState.__updated ||= prevUpdated
            newState.__updated++

            store.state = { ...newState as Required<State> }


            for (let i = 0, l = store.listeners.length; i < l; i++) {
                const listener = store.listeners[i]
                ;(listener as _StoreListenerWithPrevState).withShouldUpdateCb
                    ?   listener(store.state, prevState)
                    :   (listener as React.Dispatch<React.SetStateAction<State>>)(store.state)
            }
        }
    }
    store.actions = bindActions(store as Store, actions) as ActionsBinded<A>


    return {
        /** Store */
        store: (store as Store),

        /** Hook that subscribes component to the store */
        useStore(shouldUpdate?: StoreShouldUpdate<State>) {
            let newListener: StoreListener = useState(store.state)[1]
            if (shouldUpdate) {
                const storeAction = newListener

                newListener = ((newState, prevState) => {
                    shouldUpdate(prevState, newState) && storeAction(newState)
                }) as _StoreListenerWithPrevState
                ;(newListener as _StoreListenerWithPrevState).withShouldUpdateCb = true
            }

            useLayoutEffect(() => {
                store.listeners.push(newListener)

                return () => {
                    store.listeners = store.listeners.filter(listener => listener !== newListener)
                    // this.listeners.length || (this.state.__updated = 0)
                }
            }, [])


            return [ store.state, store.actions! ] as const
        },

        /** Resets store to its default state */
        reset() {
            store.setState(
                getInitialState(initialStateResolver)
            )
        }
    }
}


export default createStore
export type { HookStore, ActionsBinded, StateWithUpdater }