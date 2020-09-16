import request from 'siegel-services/request'
import createHookStore, { InnerStore } from 'siegel-store/hook_store'


type State = {
    someData: {
        received?: string,
    },
    _lastUpdate: number
}

type StoreInitialized = Required<InnerStore<State>>
type Actions = {
    makeSomeFetch(store: StoreInitialized, userData: string, x?: number): void
}


const initState: State = {
    someData: {},
    _lastUpdate: 0
}

const actions: Actions = {
    makeSomeFetch({ state, setState }, userData) {
        request({
            url: '/api/test',
            body: userData
        }).then(data => {
            state.someData = data;
            state._lastUpdate = Date.now()
            setState(state)
        })
    }
}



const { useStore, store } = createHookStore(initState, actions)
store.actions.makeSomeFetch('a')


export { initState, store }
export default useStore