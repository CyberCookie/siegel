import React from 'react'
import Router from 'siegel-router/Router'

import { routesConfig, pagePathMap, dynamicCrumbsMap } from './config'
import Layout from 'app/Layout'


const App = (
    <Router Layout={ Layout } children={ routesConfig }
        basename='' />
)


export { routesConfig, pagePathMap, dynamicCrumbsMap }
export default App