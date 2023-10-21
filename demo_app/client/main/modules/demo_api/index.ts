import createStore from 'siegel-store/index'
import {
    componentID as breadcrumbsComponentID,
    DynamicCrumbsCustomEventPayload
} from 'siegel-ui/Breadcrumbs'

import request from 'app/network'
import { dynamicCrumbsMap } from 'app/Router'

import type { State, Actions, EchoReqBody } from './types'


const getInitialState = () => ({
    received: '',
    counter: 0,
    proxyRes: {}
} as State)

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

                /*
                    Send event to breadcrumb component
                    to update its dynamic crumbs state
                */
                dispatchEvent(
                    new CustomEvent<DynamicCrumbsCustomEventPayload>(breadcrumbsComponentID, {
                        detail: {
                            crumbs: {
                                [dynamicCrumbsMap.demo_api]: dataToSend
                            }
                        }
                    })
                )

                state.received = dataToSend
                setState(state)
            }
        })
    },

    api_proxyGet({ state, setState }, id) {
        request<State['proxyRes']>({
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



const { useStore, store, reset } = createStore(getInitialState, actions)


export default useStore
export { store, reset, urls }
export * as DemoApiTypes from './types'