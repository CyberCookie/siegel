import { lazy } from 'react'
import { createBrowserHistory } from 'history'
import seo from 'siegel-utils/seo'
import createRouter from 'siegel-router'
import type { RouterConfig } from 'siegel-router'

import Layout from 'app/Layout'
import { pagePathMap } from 'app/_hardcode'


const history = createBrowserHistory()

const routes: RouterConfig = {
    [pagePathMap.home]: {
        beforeEnter() {
            seo({
                title: 'Siegel demo app',
                keywords: 'demo app',
                description: 'siegel demo app'
            })
        },
        LazyPage: lazy(() => import('app/pages/Home'))
    },
    
    [pagePathMap.demo_components]: {
        beforeEnter() {
            seo({
                title: 'Siegel | Demo components',
                keywords: 'components',
                description: 'siegel demo components'
            })
        },
        LazyPage: lazy(() => import('app/pages/DemoComponents'))
    },
    
    [pagePathMap.demo_api]: {
        beforeEnter() {
            seo({
                title: 'Siegel | Demo API',
                keywords: 'api',
                description: 'siegel demo API'
            })
        },
        LazyPage: lazy(() => import('app/pages/DemoApi'))
    }
}


const Router = createRouter({
    Layout, history,
    children: routes
})


export { pagePathMap, history }
export default Router