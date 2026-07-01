import { createHookStore } from '../hook_store'

import type { State, Actions, AnyError, StoreInitialized } from './types'


const getInitState = () => ({
    requests: {},
    errRes: {},
    lastError: {}
} as State)


function decrementRequests({ requests }: State, ID: string) {
    requests[ID]! > 1
        ?   requests[ID]!--
        :   (delete requests[ID])
}

const actions: Actions = {
    addToReqQueue({ state, setState }, ID) {
        state.requests[ID]
            ?   state.requests[ID]!++
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
            ?   state.errRes[ID]!.push(res)
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
        return errorsById?.at(-1)?.message || ''
    }
}


const { useStore, store, reset } = createHookStore(getInitState, actions)


export { useStore, store, reset }
export type { State, AnyError, Actions, StoreInitialized }