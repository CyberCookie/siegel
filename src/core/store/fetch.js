import hookStore from './_hook_store'


const initState = {
    requests: new Set(),
    errResponses: new Set()
}


const actions = {
    addToQue: (state, setState, id) => {
        state.requests.add(id)
        setState(state)
    },
    
    response: (state, setState, id, res) => {
        state.requests.delete(id)
        state.errResponses.add({
            message: res.message || '',
            code: res.code || 200
        })

        setState(state)
    },

    clear: (state, setState) => {
        state.requests.clear()
        state.errResponses.clear()

        setState(state)
    }
}


const { store, setState } = hookStore(initState, actions)


export { setState }
export default store