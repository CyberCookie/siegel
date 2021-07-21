import request from 'siegel-services/request'
import createHookStore, { HookStore } from 'siegel-store/hook_store'
import breadcrumbID from 'siegel-ui/Breadcrumbs/id'

import { dynamicCrumbsMap } from 'app/Router/config'


type State = {
    received: string,
    counter: number,
    proxyRes: Indexable
}

type Actions = {
    makeSomeFetch(store: StoreInitialized, userData: string): void
    updateCounter(store: StoreInitialized): void
    proxyGet(store: StoreInitialized, id: string): void
}

type StoreInitialized = HookStore<State, Actions>


const initState: State = {
    received: '',
    counter: 0,
    proxyRes: {}
}

const actions: Actions = {
    makeSomeFetch({ state, setState }, dataToSend) {
        request({
            url: '/api/send_data',
            body: { dataToSend }
        }).then(({ dataToSend }) => {
            window.dispatchEvent(new CustomEvent(breadcrumbID, {
                detail: {
                    [dynamicCrumbsMap.demo_api]: dataToSend
                }
            }))

            state.received = dataToSend
            setState(state)
        })
    },

    proxyGet({ state, setState }, id) {
        const handleResponse = (res: Indexable) => {
            state.proxyRes = res
            setState(state)
        }

        request({
            url: '/api/proxy_get/:id',
            params: { id }
        })
        .then(handleResponse)
        .catch(handleResponse)
    },

    updateCounter({ state, setState }) {
        state.counter++
        setState(state)
    }
}



const { useStore, store } = createHookStore(initState, actions)


export { store }
export default useStore