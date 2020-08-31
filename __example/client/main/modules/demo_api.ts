import request from 'essence-services/request'
import createHookStore from 'essence-store/hook_store'


const initState = {
    someData: {}
}


const actions = {
    makeSomeFetch({ state, setState }, userData) {
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