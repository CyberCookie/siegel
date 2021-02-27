import { lazy } from 'react'
import { createBrowserHistory } from 'history'
import seo from 'siegel-utils/seo'
import type { RouterConfig } from 'siegel-router'


const history = createBrowserHistory()

const pagePathMap = {
    home: '',
    demo_components: 'demo_components',
    demo_api: 'demo_api'
}

const routerConfig: RouterConfig = {
    [pagePathMap.home]: {
        beforeEnter() {
            seo({
                title: 'Siegel demo app',
                keywords: 'demo app',
                description: 'siegel demo app'
            })
        },
        component: lazy(() => import('app/pages/Home'))
    },
    
    [pagePathMap.demo_components]: {
        beforeEnter() {
            seo({
                title: 'Siegel | Demo components',
                keywords: 'components',
                description: 'siegel demo components'
            })
        },
        component: lazy(() => import('app/pages/DemoComponents'))
    },
    
    [pagePathMap.demo_api]: {
        beforeEnter() {
            seo({
                title: 'Siegel | Demo API', 
                keywords: 'api',
                description: 'siegel demo API'
            })
        },
        component: lazy(() => import('app/pages/DemoApi'))
    }
}


export { pagePathMap, history }
export default routerConfig