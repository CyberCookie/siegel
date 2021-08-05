import { render } from 'react-dom'
import { setup as requestServiceSetup, HEADER_CONTENT_TYPE } from 'siegel-services/request'

import Router from 'app/Router'

import './styles'


const JSON_CONTENT_TYPE = 'application/json'
const extraHeades = {
    [ HEADER_CONTENT_TYPE ]: JSON_CONTENT_TYPE
}

const rootComponent = document.getElementById('root')
if (rootComponent) {
    window.navigator.serviceWorker?.register('/sw.js')
        .catch(console.error)

    requestServiceSetup({
        beforeRequest(fetchParams) {
            if (!fetchParams.headers?.[HEADER_CONTENT_TYPE]) {
                fetchParams.headers = Object.assign({}, fetchParams.headers, extraHeades)
            }

            if (fetchParams.headers[HEADER_CONTENT_TYPE] == JSON_CONTENT_TYPE) {
                fetchParams.body = JSON.stringify(fetchParams.body)
            }
        }
    })

    render(Router, rootComponent)
}

module.hot?.accept()