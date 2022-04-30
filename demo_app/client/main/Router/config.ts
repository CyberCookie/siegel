import { lazy } from 'react'
import seo from 'siegel-utils/seo'
import type { RoutesConfig } from 'siegel-router'
import type { BreadcrumbConfig } from 'siegel-ui/Breadcrumbs'


const pagePathMap = {
    home: '',
    demo_components: 'demo_components',
    demo_api: 'demo_api'
} as const

const dynamicCrumbsMap = {
    demo_api: 'Demo api dynamic crumb'
} as const



const routesConfig: RoutesConfig & BreadcrumbConfig = {
    [ pagePathMap.home ]: {
        onEnter() {
            seo({
                title: 'Siegel demo app',
                keywords: 'demo app',
                description: 'siegel demo app'
            })
        },
        crumb: 'Home',
        Page: lazy(() => import('app/pages/Home'))
    },

    [ pagePathMap.demo_components ]: {
        onEnter() {
            seo({
                title: 'Siegel | Demo components',
                keywords: 'components',
                description: 'siegel demo components'
            })
        },
        crumb: 'Demo coponents',
        Page: lazy(() => import('app/pages/DemoComponents'))
    },

    [ pagePathMap.demo_api ]: {
        onEnter() {
            seo({
                title: 'Siegel | Demo API',
                keywords: 'api',
                description: 'siegel demo API'
            })
        },
        dynamicCrumb: dynamicCrumbsMap.demo_api,
        Page: lazy(() => import('app/pages/DemoApi'))
    }
}


export { routesConfig, pagePathMap, dynamicCrumbsMap }