import createRouter from 'siegel-router'

import { history, routesConfig, pagePathMap, dynamicCrumbsMap } from './config'
import Layout from 'app/Layout'


export { history, routesConfig, pagePathMap, dynamicCrumbsMap }
export default createRouter({
    Layout, history,
    children: routesConfig
})