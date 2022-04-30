import React from 'react'
import Router from 'siegel-router'

import { routesConfig, pagePathMap, dynamicCrumbsMap } from './config'
import Layout from 'app/Layout'


const App = <Router Layout={ Layout } children={ routesConfig } />


export { routesConfig, pagePathMap, dynamicCrumbsMap }
export default App