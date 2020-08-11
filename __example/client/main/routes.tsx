import { lazy } from 'react'


const pagePathMap = {
    page_test: 'page_test',
    page_test_second: 'page_test_second',

    login: 'login'
}


export default {
    '': {
        component: lazy(() => import('app/pages/DemoComponents'))
    },

    'work_with_api': {
        component: lazy(() => import('app/pages/DemoApi'))
    }
}


export { pagePathMap }