import React, { lazy } from 'react'


const pagePathMap = {
    page_test: 'page_test',
    page_test_second: 'page_test_second',

    login: 'login'
}


export default {
    '': {
        component: lazy(() => import('app/pages/Home'))
    },

    // testtest: {
    //     component: lazy(() => import('app/pages/Test'))
    // },

    [pagePathMap.page_test]: { component: () => <div>123</div> },
    [pagePathMap.page_test_second]: { component: () => <div>456</div> },

    // [pagePathMap.login]: {
    //     lazy: React.lazy(() => import('app/pages/Login'))
    // }
}


export { pagePathMap }