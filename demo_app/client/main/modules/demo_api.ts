import request from 'siegel-services/request'
import createHookStore, { InnerStore } from 'siegel-store/hook_store'


type State = {
    received: string,

    counter: number,
    _lastUpdate: number
}

type StoreInitialized = Required<InnerStore<State>>
type Actions = {
    makeSomeFetch(store: StoreInitialized, userData: string): void
    updateCounter(store: StoreInitialized): void
}


const initState: State = {
    received: '',
    counter: 0,

    _lastUpdate: 0
}

const actions: Actions = {
    makeSomeFetch({ state, setState }, dataToSend) {
        request({
            url: '/api/send_data',
            body: { dataToSend }
        }).then(data => {
            state.received = data.dataToSend;
            state._lastUpdate = Date.now()
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