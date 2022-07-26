import { createRoot } from 'react-dom/client'

import 'app/network'
import Router from 'app/Router'

import './styles'


const rootComponent = document.getElementById('root')
if (rootComponent) {

    navigator.serviceWorker
        ?.register('/sw.js')
        .catch(console.error)

    createRoot(rootComponent)
        .render(Router)
}