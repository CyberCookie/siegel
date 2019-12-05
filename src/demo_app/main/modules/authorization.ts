import request from 'core/services/request'
import createHookStore from 'core/store/hook_store'

interface BindedActions {
    [action: string]: (state: Record<string, any>, setState: React.Dispatch<React.SetStateAction<any>> ) => void
}


const initState = {
    isAuthorized: null
}


const actions: BindedActions = {
    validate: (state, setState) => {
        request({
            url: 'Authentication/validate',
            method: 'POST'
        }).then(() => {
            state.isAuthorized = true;
            setState({ ...state })
        })
        .catch(() => {}) //supress error since catch in app/index.js
        // .catch(() => {
        //     state.isAuthorized = false;
        //     setState(state)
        // })
    },

    login: (state, setState, data) => {
        request({
            url: 'Authentication/signIn',
            method: 'POST',
            body: data,
            credentials: 'include'
        }).then(() => {
            state.isAuthorized = true;
            setState(state)
        })
    },

    logout: (state, setState) => {
        request({
            url: 'Authentication/signOut',
            method: 'POST'
        })
        state.isAuthorized = false;
        setState(state)
    }
}

const { useStore, store } = createHookStore(initState, actions)

export { initState, store }
export default useStore