import React, { lazy } from 'react'


const pagePathMap = {
    page_test: 'page_test',
    page_test_second: 'page_test_second',

    login: 'login'
}


export default {
    '': {
        Component: lazy(() => import('app/pages/Home'))
    },

    [pagePathMap.page_test]: { Component: () => <div>123</div> },
    [pagePathMap.page_test_second]: { Component: () => <div>456</div> },

    // [pagePathMap.login]: {
    //     lazy: React.lazy(() => import('app/pages/Login'))
    // }
}


export { pagePathMap }