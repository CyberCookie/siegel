import { render } from 'react-dom'

import 'app/network'
import Router from 'app/Router'

import './styles'


const rootComponent = document.getElementById('root')
if (rootComponent) {
    window.navigator.serviceWorker
        ?.register('/sw.js')
        .catch(console.error)

    render(Router, rootComponent)
}

module.hot?.accept()