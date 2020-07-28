import createHookStore from './hook_store'


const initState = {
    requests: {},
    errRes: {},
    sucRes: {}
}


function decrementRequests(state, url) {
    state.requests[url] > 1
        ?   state.requests[url]--
        :   (delete state.requests[url])
}

const actions = {
    addToReqQueue({ state, setState }, url) {
        state.requests[url]
            ?   state.requests[url]++
            :   (state.requests[url] = 1)

        setState(state)
    },
    
    removeFromReqQueue({ state, setState }, url) {
        if (state.requests[url]) {
            decrementRequests(state, url)
            setState(state)
        }
    },

    addToErrRes({ state, setState }, res, url) {
        res.date = Date.now()
        decrementRequests(state, url)

        state.errRes[url]
            ?   state.errRes[url].push(res)
            :   state.errRes[url] = [ res ]

        setState(state)
    },

    clearErrRes({ state, setState }, url) {
        if (url) {
            Array.isArray(url)
                ?   url.forEach(_url => { delete state.errRes[_url] })
                :   (delete state.errRes[url])

        } else state.errRes = {}

        setState(state)
    },

    getLastErrorMsg(store, url) {
        const errorsById = store.state.errRes[url]
        
        return errorsById && errorsById.length
            ?   errorsById[errorsById.length - 1].res.message
            :   ''
    }
}


const { useStore, store, resetStore } = createHookStore(initState, actions)


export { store, resetStore }
export default useStore