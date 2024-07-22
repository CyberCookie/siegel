import createStore from 'siegel-store/index'
import {
    componentID as breadcrumbsComponentID,
    DynamicCrumbsCustomEventPayload
} from 'siegel-ui/Breadcrumbs'
import createJsonKeysReplacer from 'siegel-utils/json_keys_replace'

import request from 'app/network'
import { dynamicCrumbsMap } from 'app/Router'

import type { State, Actions, EchoReqBody } from './types'


import protobuf from 'protobufjs'
import prot from '!raw-loader!../../../../dto/test.proto'

const protLoaded = protobuf.parse(prot)
const testMsgProto = protLoaded.root.lookupType('somePackage.SomeMessage')
// console.log('prot: ', prot)
// console.log(protLoaded)
// console.log(testMsgProto)

const apiEchoJsonKeysReplace = createJsonKeysReplacer<keyof EchoReqBody>([
    'dataToSend'
])


const getInitialState = () => ({
    received: '',
    counter: 0,
    proxyRes: {}
} as State)

const urlPrefix = '/api/'
const urls = {
    echo: `${urlPrefix}echo`,
    proxy: `${urlPrefix}proxy_get/:id`,
    proto: `${urlPrefix}protobuf_req`
} as const

const actions: Actions = {
    api_echo({ state, setState }, body) {
        request<EchoReqBody, EchoReqBody>({
            body,
            url: urls.echo,
            jsonStringifyPostprocess: json => apiEchoJsonKeysReplace(json, true),
            jsonParsePreprocess: json => apiEchoJsonKeysReplace(json, false),
            onSuccess(res) {
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
            params: { id },
            onSuccess(res) {
                state.proxyRes = res
                setState(state)
            }
        })
    },

    updateCounter({ state, setState }) {
        state.counter++
        setState(state)
    },

    api_protobufGet({ state, setState }) {
        request({
            url: urls.proto,
            body: testMsgProto.encode({
                testField: 'lel'
            }).finish(),
            json: false,
            parseMethod: 'arrayBuffer',
            onSuccess(res) {
                console.log(testMsgProto.decode(new Uint8Array(res)))
            }
        })
        // .then(res => {
        //     console.log(testMsgProto.decode(res.res))
        // })
    }
}



const { useStore, store, reset } = createStore(getInitialState, actions)


export default useStore
export { store, reset, urls }
export * as DemoApiTypes from './types'