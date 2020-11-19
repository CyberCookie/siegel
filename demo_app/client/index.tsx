import React from 'react'
import { render } from 'react-dom'
// import createRouter from 'siegel-router'
// import { setup as requestServiceSetup, RequestParams } from 'siegel-services/request'

// import routes from 'app/routes'
// import Layout from 'app/Layout'
import icons from 'app/components/icons'
import './styles'


const rootComponent = document.getElementById('root')
if (rootComponent) {
    window.navigator.serviceWorker?.register('/sw.js')
        .catch(console.error)


    // const extraHeades = {
    //     'Content-Type': 'application/json'
    // }
    // requestServiceSetup({
    //     beforeRequest(fetchParams: RequestParams) {
    //         fetchParams.headers
    //             ?   Object.assign(fetchParams.headers, extraHeades)
    //             :   (fetchParams.headers = extraHeades)
    //     }
    // })


    render(
        <div>{icons.users} {icons.eye_enable}</div>,
        // createRouter({ routes, Layout }),
        rootComponent
    )


    Object.defineProperty(Event.prototype, '__stop', {
        value() {
            this.stopPropagation()
            this.preventDefault()
        }
    })
}