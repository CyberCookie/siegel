import React from 'react'
import Router from 'siegel-router/Router'

import { localStorageKeys } from 'app/constants'
import Layout from 'app/Layout'
import { routesConfig, pagePathMap, dynamicCrumbsMap } from './config'


const App = (
    <Router Layout={ Layout } children={ routesConfig }
        basename={ localStorage.getItem(localStorageKeys.basename) || '' } />
)


export { routesConfig, pagePathMap, dynamicCrumbsMap }
export default App