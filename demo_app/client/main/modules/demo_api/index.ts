import createStore from 'siegel-store/index'
import breadcrumbID from 'siegel-ui/Breadcrumbs/id'

import request from 'app/network'
import { dynamicCrumbsMap } from 'app/Router'

import type { State, Actions, EchoReqBody } from './types'


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
            url: urls.echo,
            headers: {
                a: 'asd'
            }
        }).then(({ res }) => {
            if (res) {
                const { dataToSend } = res
                dispatchEvent(
                    new CustomEvent(breadcrumbID, {
                        detail: {
                            [dynamicCrumbsMap.demo_api]: dataToSend
                        }
                    })
                )

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



const { useStore, store } = createStore(initState, actions)


export default useStore
export { store, urls }
export * as DemoApiTypes from './types'