import { render } from 'react-dom'

import createRouter from 'core/router'
// import { setup as requestServiceSetup } from 'core/services/request'

import routes from 'app/routes'
import Layout from 'app/Layout'
// import { store as authorizationStore } from 'app/modules/authorization'

import './styles'


const rootComponent = document.getElementById('application-root')
if (rootComponent) {
    if (window.navigator.serviceWorker) {
        window.navigator.serviceWorker.register('/sw.js')
            .catch(console.error)
    }

    // requestServiceSetup({
    //     beforeRequest: fetchParams => {
    //         fetchParams.options.headers = {
    //             ...fetchParams.options.headers,
    //             'Content-Type': 'application/json'
    //         }
            
    //         fetchParams.url = '/api/' + fetchParams.url;
            
    //         return fetchParams
    //     },
    //     errorHandler: err => {
    //         if (err.status == 401) {
    //             authorizationStore.state.isAuthorized = false;
    //             authorizationStore.setState(authorizationStore.state)
    //         }
    //     }
    // })

    
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


// polyfill to add path key to the event object in mozilla, edge
if (!('path' in Event.prototype)) {
    Object.defineProperty(Event.prototype, 'path', {
        get: function() {
            let path = []
            let currentElem = this.target;

            while (currentElem) {
                path.push(currentElem);
                currentElem = currentElem.parentElement
            }

            return path
        }
    })
}