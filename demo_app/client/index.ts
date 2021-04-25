//TODO: router demo page

import { render } from 'react-dom'
import { setup as requestServiceSetup, RequestParams } from 'siegel-services/request'

import Router from 'app/Router'

import './styles'


const rootComponent = document.getElementById('root')
if (rootComponent) {
    window.navigator.serviceWorker?.register('/sw.js')
        .catch(console.error)


    const extraHeades = {
        'Content-Type': 'application/json'
    }
    requestServiceSetup({
        beforeRequest(fetchParams: RequestParams) {
            fetchParams.headers
                ?   Object.assign(fetchParams.headers, extraHeades)
                :   (fetchParams.headers = extraHeades)
        }
    })


    render(Router, rootComponent)
}