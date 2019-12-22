import { useState, useLayoutEffect } from 'react'

type Actions = {
    [action: string]: Function
}

type HookSetState = React.Dispatch<React.SetStateAction<any>>

interface StoreBase {
    state: Indexable,
    listeners: HookSetState[]
}

interface StoreSetState extends StoreBase {
    setState: Function
}

interface StoreActions extends StoreBase {
    actions: Actions
}

type Store = StoreActions & StoreSetState


function setState(this: Store, newState: Indexable) {
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
            const removeListener = (listener: HookSetState) => listener !== newListener
            this.listeners = this.listeners.filter(removeListener)
        }
    }, [])

    return [ this.state, this.actions ]
}

function bindActions(store: StoreSetState, actions: Actions) {
    const { state, setState } = store;
    const result: Indexable = {}

    for (let ACTION_ID in actions) {
        result[ACTION_ID] = actions[ACTION_ID].bind(null, state, setState)
    }

    return result
}


const createHookStore = (initialState: Indexable, actions: Actions) => {
    const store: StoreBase = { state: initialState, listeners: [] };

    (store as StoreSetState).setState = setState.bind(store as Store);
    (store as StoreActions).actions = bindActions(store as Store, actions)

    return {
        useStore: useCustom.bind(store as Store),
        store
    }
}


export default createHookStore