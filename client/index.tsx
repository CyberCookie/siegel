import { render } from 'react-dom'

import createRouter from 'core/router'
import { setup as requestServiceSetup } from 'core/services/request'

import routes from 'app/routes'
import Layout from 'app/Layout'

import './styles'


const rootComponent = document.getElementById('application-root')
if (rootComponent) {
    if (window.navigator.serviceWorker) {
        window.navigator.serviceWorker.register('/sw.js')
            .catch(console.error)
    }


    const extraHeades = {
        'Content-Type': 'application/json'
    }
    requestServiceSetup({
        beforeRequest(fetchParams) {
            fetchParams.headers
                ?   Object.assign(fetchParams.headers, extraHeades)
                :   (fetchParams.headers = extraHeades)
        }
    })

    
    render(
        createRouter({ routes, Layout }),
        rootComponent
    )


    if (module.hot) {
        module.hot.addStatusHandler((status: string) => {
            status == 'idle' && console.clear()
        })
    }
}