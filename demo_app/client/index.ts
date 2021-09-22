import { render } from 'react-dom'
import { setup as requestServiceSetup, HEADER_CONTENT_TYPE } from 'siegel-services/request'
import { store as fetchModuleStore } from 'siegel-store/hook_store/fetch_module'

import Router from 'app/Router'

import './styles'


const rootComponent = document.getElementById('root')
if (rootComponent) {
    window.navigator.serviceWorker?.register('/sw.js')
        .catch(console.error)


    const { addToReqQueue, addToErrRes, removeFromReqQueue } = fetchModuleStore.actions

    const JSON_CONTENT_TYPE = 'application/json'
    const extraHeades = {
        [ HEADER_CONTENT_TYPE ]: JSON_CONTENT_TYPE
    }
    requestServiceSetup({
        beforeRequest(fetchParams) {
            addToReqQueue(fetchParams.url)

            if (!fetchParams.headers?.[HEADER_CONTENT_TYPE]) {
                fetchParams.headers = Object.assign({}, fetchParams.headers, extraHeades)
            }

            if (fetchParams.headers[HEADER_CONTENT_TYPE] == JSON_CONTENT_TYPE) {
                fetchParams.body = JSON.stringify(fetchParams.body)
            }
        },
        afterRequest({ initialURL }) {
            removeFromReqQueue(initialURL, true)
        },
        errorHandler(err) {
            addToErrRes(err, err.req.initialURL)
        }
    })

    render(Router, rootComponent)
}

module.hot?.accept()