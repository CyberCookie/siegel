import createRouter from 'siegel-router'

import Layout from 'app/Layout'
import { history, routesConfig } from './config'


export default createRouter({
    Layout, history,
    children: routesConfig
})