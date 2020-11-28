import request from 'siegel-services/request'
import createHookStore, { HookStore } from 'siegel-store/hook_store'


type State = {
    received: string,
    counter: number
}

type Actions = {
    makeSomeFetch(store: StoreInitialized, userData: string): void
    updateCounter(store: StoreInitialized): void
}

type StoreInitialized = HookStore<State, Actions>


const initState: State = {
    received: '',
    counter: 0
}

const actions: Actions = {
    makeSomeFetch({ state, setState }, dataToSend) {
        request({
            url: '/api/send_data',
            body: { dataToSend }
        }).then(data => {
            state.received = data.dataToSend;
            setState(state)
        })
    },

    updateCounter({ state, setState }) {
        state.counter++
        setState(state)
    }
}



const { useStore, store } = createHookStore(initState, actions)


export { store }
export default useStore