import createHookStore from './index'
import type { HookStore } from './index'


type State = {
    requests: Indexable<number>
    errRes: Indexable
    lastError: Indexable
}

type Actions = {
    addToReqQueue(store: StoreInitialized, url: string): void
    removeFromReqQueue(store: StoreInitialized, url: string): void
    addToErrRes(store: StoreInitialized, res: any, url: string): void
    clearErrRes(store: StoreInitialized, url: string): void
    getLastErrorMsgByURL(store: StoreInitialized, url: string): string
}

type StoreInitialized = HookStore<State, Actions>


const initState: State = {
    requests: {},
    errRes: {},

    lastError: {}
}


function decrementRequests({ requests }: State, url: string) {
    requests[url] > 1
        ?   requests[url]--
        :   (delete requests[url])
}

const actions: Actions = {
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

        state.lastError = res;

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

    getLastErrorMsgByURL(store, url) {
        const errorsById = store.state.errRes[url]
        
        return errorsById && errorsById.length
            ?   errorsById[errorsById.length - 1].message
            :   ''
    }
}


const { useStore, store, resetStore } = createHookStore(initState, actions)


export { store, resetStore }
export default useStore