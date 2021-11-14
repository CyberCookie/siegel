import createHookStore from 'siegel-store/hook_store'
import breadcrumbID from 'siegel-ui/Breadcrumbs/id'

import type { State, Actions, EchoReqBody } from './types'
import request from 'app/network'
import { dynamicCrumbsMap } from 'app/Router'


const initState: State = {
    received: '',
    counter: 0,
    proxyRes: {}
}

const urls = {
    echo: '/api/echo',
    proxy: '/api/proxy_get/:id'
}
const actions: Actions = {
    api_echo({ state, setState }, body) {
        request<EchoReqBody, EchoReqBody>({
            body,
            url: urls.echo
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

    api_proxyGet({ state, setState }, id) {
        request<Indexable>({
            url: urls.proxy,
            params: { id }
        }).then(({ res }) => {
            if (res) {
                state.proxyRes = res
                setState(state)
            }
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
export * as DemoApiTypes from './types'