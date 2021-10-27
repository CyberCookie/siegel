import createHookStore, { HookStore } from './index'


type State = {
    requests: Record<string, number>
    errRes: Record<string, any>
    lastError: Record<string, any>
}

type Actions = {
    addToReqQueue(store: StoreInitialized, ID: string): void
    removeFromReqQueue(store: StoreInitialized, ID: string, cleanupErrors?: boolean): void
    addToErrRes(store: StoreInitialized, res: any, ID: string): void
    clearErrRes(store: StoreInitialized, ID: string): void
    getLastErrorMsgByID(store: StoreInitialized, ID: string): string
}

type StoreInitialized = HookStore<State, Actions>


const initState: State = {
    requests: {},
    errRes: {},

    lastError: {}
}


function decrementRequests({ requests }: State, ID: string) {
    requests[ID] > 1
        ?   requests[ID]--
        :   (delete requests[ID])
}

const actions: Actions = {
    addToReqQueue({ state, setState }, ID) {
        state.requests[ID]
            ?   state.requests[ID]++
            :   (state.requests[ID] = 1)

        setState(state)
    },

    removeFromReqQueue({ state, setState }, ID, cleanupErrors = false) {
        if (state.requests[ID]) {
            decrementRequests(state, ID)
            if (cleanupErrors) delete state.errRes[ID]

            setState(state)
        }
    },

    addToErrRes({ state, setState }, res, ID) {
        res.date = Date.now()
        decrementRequests(state, ID)

        state.lastError = res

        state.errRes[ID]
            ?   state.errRes[ID].push(res)
            :   state.errRes[ID] = [ res ]

        setState(state)
    },

    clearErrRes({ state, setState }, ID) {
        if (ID) {
            Array.isArray(ID)
                ?   ID.forEach(_ID => { delete state.errRes[_ID] })
                :   (delete state.errRes[ID])
        } else state.errRes = {}

        setState(state)
    },

    getLastErrorMsgByID(store, ID) {
        const errorsById = store.state.errRes[ID]

        return errorsById && errorsById.length
            ?   errorsById[errorsById.length - 1].message
            :   ''
    }
}


const { useStore, store, resetStore } = createHookStore(initState, actions)


export { store, resetStore }
export default useStore