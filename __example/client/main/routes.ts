import { lazy } from 'react'


const pagePathMap = {
    home: '',
    work_with_api: 'work_with_api'
}


export { pagePathMap }
export default {
    [pagePathMap.home]: {
        component: lazy(() => import('app/pages/DemoComponents'))
    },

    [pagePathMap.work_with_api]: {
        component: lazy(() => import('app/pages/DemoApi'))
    }
}