import request from 'core/services/request'
import createHookStore from 'core/store/hook_store'


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