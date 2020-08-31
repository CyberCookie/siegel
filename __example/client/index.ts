import { render } from 'react-dom'

import createRouter from 'essence-router'
import { setup as requestServiceSetup, RequestFnParams } from 'essence-services/request'

import routes from 'app/routes'
import Layout from 'app/Layout'

import './styles'


const rootComponent = document.getElementById('application-root')
if (rootComponent) {
    const SW = window.navigator.serviceWorker;
    SW && SW.register('/sw.js').catch(console.error)


    const extraHeades = {
        'Content-Type': 'application/json'
    }
    requestServiceSetup({
        beforeRequest(fetchParams: RequestFnParams) {
            fetchParams.headers
                ?   Object.assign(fetchParams.headers, extraHeades)
                :   (fetchParams.headers = extraHeades)
        }
    })

    
    render(
        createRouter({ routes, Layout }),
        rootComponent
    )


    Object.defineProperty(Event.prototype, '__stop', {
        value() {
            this.stopPropagation()
            this.preventDefault()
        }
    })

    // if (module.hot) {
    //     module.hot.addStatusHandler((status: string) => {
    //         status == 'idle' && console.clear()
    //     })
    // }
}