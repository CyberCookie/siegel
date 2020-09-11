import request from 'siegel-services/request'
import createHookStore, { Actions } from 'siegel-store/hook_store'


type State = {
    someData: {
        received?: string
    }
}


const initState: State = {
    someData: {}
}

const actions: Actions<State> = {
    makeSomeFetch({ state, setState }, userData: any) {
        request({
            url: '/api/test',
            body: userData
        }).then(data => {
            state.someData = data;
            setState(state)
        })
    }
}

const { useStore, store } = createHookStore(initState, actions)


export { initState, store }
export default useStore