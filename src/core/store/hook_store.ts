import { useState, useLayoutEffect } from 'react'

type Actions = {
    [action: string]: Function
}

type HookSetState = React.Dispatch<React.SetStateAction<any>>

interface StoreBase {
    state: object,
    listeners: HookSetState[]
}

interface StoreSetState extends StoreBase {
    setState: Function
}

interface StoreActions extends StoreBase {
    actions: Actions
}

type Store = StoreActions & StoreSetState


// let id = 0;

function setState(this: Store, newState: object) {
    this.state = { ...newState }
    let listenersCount = this.listeners.length

    for (var i = 0; i < listenersCount; i++) {
        this.listeners[i](this.state)
    }
}

function useCustom(this: Store) {
    const newListener = useState()[1]
    
    useLayoutEffect(() => {
        // console.log(_id)
        this.listeners.push(newListener)
        
        return () => {
            // console.log(_id)
            const removeListener = (listener: HookSetState) => listener !== newListener
            this.listeners = this.listeners.filter(removeListener)
        }
    }, [])

    return [ this.state, this.actions ]
}

function bindActions(store: StoreSetState, actions: Actions) {
    const { state, setState } = store;
    const result: IndexingObject = {}

    for (let ACTION_ID in actions) {
        result[ACTION_ID] = actions[ACTION_ID].bind(null, state, setState)
    }

    return result
}


const createHookStore = (initialState: object, actions: Actions) => {
    const store: StoreBase = { state: initialState, listeners: [] };

    (store as StoreSetState).setState = setState.bind(store as Store);
    (store as StoreActions).actions = bindActions(store as Store, actions)

    return {
        useStore: useCustom.bind(store as Store),
        store
    }
}


export default createHookStore