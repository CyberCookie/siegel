import { lazy } from 'react'
import seo from 'siegel-utils/seo'
import type { RoutesConfig } from 'siegel-router/types'
import type { BreadcrumbConfig } from 'siegel-ui/Breadcrumbs'

import demoRouterTransitionStyles from 'app/pages/DemoRouter/pages_transition.sass'


const pagePathMap = {
    any_path: '*',
    home: '',
    demo_components: 'demo_components',
    demo_api: 'demo_api',
    demo_router: 'demo_router',
    not_found: 'not_found',
    change_basename: 'change_basename',
    deep_nested: 'deep_nested',
    another_deep_nested: 'another_deep_nested',
    no_permissions: 'no_permissions'
} as const

const dynamicCrumbsMap = {
    demo_api: 'Demo api dynamic crumb'
} as const



const routesConfig: RoutesConfig & BreadcrumbConfig = {
    [ pagePathMap.home ]: {
        crumb: 'Home',
        onEnter() {
            seo({
                title: 'Siegel demo app',
                keywords: 'demo app',
                description: 'siegel demo app'
            })
        },
        Page: lazy(() => import('app/pages/Home'))
    },

    [ pagePathMap.demo_components ]: {
        crumb: 'Demo coponents',
        onEnter() {
            seo({
                title: 'Siegel | Demo components',
                keywords: 'components',
                description: 'siegel demo components'
            })
        },
        Page: lazy(() => import('app/pages/DemoComponents'))
    },

    [ pagePathMap.demo_api ]: {
        dynamicCrumb: dynamicCrumbsMap.demo_api,
        onEnter() {
            seo({
                title: 'Siegel | Demo API',
                keywords: 'api',
                description: 'siegel demo API'
            })
        },
        Page: lazy(() => import('app/pages/DemoApi'))
    },


    [ pagePathMap.demo_router ]: {
        crumb: 'Demo router',
        onEnter() {
            seo({
                title: 'Siegel | Demo Router',
                keywords: 'router',
                description: 'siegel demo router'
            })
        },
        Layout: lazy(() => import('app/pages/DemoRouter/Layout')),
        transition: {
            duration: 750,
            wrapperClassName: demoRouterTransitionStyles.pages_transition,
            performOnHistoryStateChange: true
        },
        children: {
            [ pagePathMap.change_basename ]: {
                crumb: 'Nested page',
                Page: lazy(() => import('app/pages/DemoRouter/pages/Basename'))
            },
            [ pagePathMap.any_path ]: {
                crumb: 'Parametrized url',
                Page: lazy(() => import('app/pages/DemoRouter/pages/Parametrized')),
                paramName: 'param',
                children: {
                    [ pagePathMap.deep_nested ]: {
                        crumb: 'Deeply nested page',
                        Layout: lazy(() => import('app/pages/DemoRouter/pages/NestedGroup/Layout')),
                        children: {
                            [ pagePathMap.home ]: {
                                Page: lazy(() => import('app/pages/DemoRouter/pages/NestedGroup/pages/Nested'))
                            },
                            [ pagePathMap.another_deep_nested ]: {
                                crumb: 'Another deeply nested page',
                                Page: lazy(() => import('app/pages/DemoRouter/pages/NestedGroup/pages/AnotherNested'))
                            },
                            [ pagePathMap.not_found ]: {
                                crumb: '404',
                                Page: lazy(() => import('app/pages/DemoRouter/pages/NestedGroup/pages/NotFound'))
                            },
                            [ pagePathMap.any_path ]: {
                                redirectTo: {
                                    path: '!not_found',
                                    state: () => ({
                                        pageNotFound: true,
                                        prevPath: location.pathname
                                    })
                                }
                            },
                            [ pagePathMap.no_permissions ]: {
                                Page: lazy(() => import('app/pages/DemoRouter/pages/NestedGroup/pages/Nested')),
                                permissions: false,
                                redirectTo: {
                                    path: '!',
                                    state: () => ({
                                        permissionDenied: true,
                                        prevPath: location.pathname
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    [ pagePathMap.not_found ]: {
        crumb: 'Global 404 page',
        Page: lazy(() => import('app/pages/404'))
    },
    [ pagePathMap.any_path ]: {
        redirectTo: {
            path: () => `/${pagePathMap.not_found}`,
            state: () => ({
                pageNotFound: true,
                prevPath: location.pathname
            })
        }
    }
}


export { routesConfig, pagePathMap, dynamicCrumbsMap }