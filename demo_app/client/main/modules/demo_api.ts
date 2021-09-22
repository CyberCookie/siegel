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

const urls = {
    demo: '/api/send_data',
    proxy: '/api/proxy_get/:id'
}
const actions: Actions = {
    makeSomeFetch({ state, setState }, dataToSend) {
        request({
            url: urls.demo,
            body: { dataToSend }
        }).then(({ res }) => {
            if (res) {
                const { dataToSend } = res
                window.dispatchEvent(new CustomEvent(breadcrumbID, {
                    detail: {
                        [dynamicCrumbsMap.demo_api]: dataToSend
                    }
                }))

                state.received = dataToSend
                setState(state)
            }
        })
    },

    proxyGet({ state, setState }, id) {
        request({
            url: urls.proxy,
            params: { id }
        }).then(reqResult => {
            state.proxyRes = reqResult
            setState(state)
        })
    },

    updateCounter({ state, setState }) {
        state.counter++
        setState(state)
    }
}



const { useStore, store } = createHookStore(initState, actions)


export { store, urls }
export default useStore