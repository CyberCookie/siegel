import request from 'siegel-services/request'
import createHookStore, { ActionsUnbinded } from 'siegel-store/hook_store'


type State = {
    someData: {
        received?: string,
    },
    _lastUpdate: number
}


const initState: State = {
    someData: {},
    _lastUpdate: 0
}

const actions: ActionsUnbinded<State> = {
    makeSomeFetch({ state, setState }, userData: any) {
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


export { initState, store }
export default useStore