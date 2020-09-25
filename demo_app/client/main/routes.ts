import { lazy } from 'react'


const pagePathMap = {
    home: '',
    demo_components: 'demo_components',
    demo_api: 'demo_api'
}


export { pagePathMap }
export default {
    [pagePathMap.home]: {
        component: lazy(() => import('app/pages/Home'))
    },

    [pagePathMap.demo_components]: {
        component: lazy(() => import('app/pages/DemoComponents'))
    },

    [pagePathMap.demo_api]: {
        component: lazy(() => import('app/pages/DemoApi'))
    }
}