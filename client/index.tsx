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

    requestServiceSetup({
        beforeRequest: fetchParams => {
            fetchParams.options.headers = {
                ...fetchParams.options.headers,
                'Content-Type': 'application/json'
            }
            
            return fetchParams
        }
    })

    
    render(
        createRouter({
            routes, Layout,
            isLazy: true
        }),
        rootComponent
    )


    if (module.hot) {
        module.hot.addStatusHandler((status: string) => {
            status == 'idle' && console.clear()
        })
    }
}