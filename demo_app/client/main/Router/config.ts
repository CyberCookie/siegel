import { lazy } from 'react'
import { createBrowserHistory } from 'history'
import seo from 'siegel-utils/seo'
import type { RouterConfig } from 'siegel-router'
import type { BreadcrumbConfig } from 'siegel-ui/Breadcrumbs/types'


const history = createBrowserHistory()

const pagePathMap = {
    home: '',
    demo_components: 'demo_components',
    demo_api: 'demo_api'
} as const

const dynamicCrumbsMap = {
    demo_api: 'Demo api dynamic crumb'
} as const


const routesConfig: RouterConfig & BreadcrumbConfig = {
    [pagePathMap.home]: {
        beforeEnter() {
            seo({
                title: 'Siegel demo app',
                keywords: 'demo app',
                description: 'siegel demo app'
            })
        },
        crumb: 'Home',
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
        crumb: 'Demo coponents',
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
        dynamicCrumb: dynamicCrumbsMap.demo_api,
        LazyPage: lazy(() => import('app/pages/DemoApi'))
    }
}


export { history, routesConfig, pagePathMap, dynamicCrumbsMap }