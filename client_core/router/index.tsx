import React, { Suspense, useState, useLayoutEffect } from 'react'
import { Switch, Router, Route, Redirect, withRouter, RouteProps } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import type { CreateRoutesWrapper, UpdateblePageProps, CreateRoutes, CreateRouter, RouterConfig, RouteConfig } from './types'

import usePrevious from '../hooks/previous'
import isExists from '../utils/is_exists'


const createRoutesWrapper: CreateRoutesWrapper = (routes, params) => {
    const { Layout, isLazy, LazyFallback } = params

    let wrapper = <Switch children={routes} />
    isLazy && (wrapper = <Suspense fallback={LazyFallback || ''} children={wrapper} />)

    if (Layout) {
        const LayoutWithRouter = withRouter(Layout)
        wrapper = <LayoutWithRouter children={wrapper} />
    }


    return wrapper
}

const createNotFoundRedirect = (path: string) => <Route path='*' children={ <Redirect to={path} /> } />

const UpdateblePage = (_props: UpdateblePageProps) => {
    const { RouterPage, props, beforeEnter, UpLevelLayout } = _props

    const [ count, setState ] = useState(0)
    UpLevelLayout.__childrenRefresh = () => {
        setTimeout(setState, 0, count + 1)
    }
    useLayoutEffect(() => {
        return () => { UpLevelLayout.__childrenRefresh = null }
    }, [])


    return <RouterPage { ...props } beforeEnter={beforeEnter?.(props)} />
}

const useUpdateChildren = (Layout: NonNullable<RouteConfig['Layout']>, pathname: string, extraCondition = true) => {
    if (usePrevious(pathname) == pathname && extraCondition) {
        (Layout as UpdateblePageProps['UpLevelLayout']).__childrenRefresh?.()
    }
}

const createRoutes: CreateRoutes = ({ routeConfig, urlPref, notFound, UpLevelLayout }) => {
    const routes: JSX.Element[] | JSX.Element = []
    let isLazy = false

    for (const path in routeConfig) {
        const {
            exact = true,
            Layout, beforeEnter, Page, LazyPage, LazyFallback, children, redirectTo, redirectUseParentBase, updateFromLayout
        } = routeConfig[path]

        const pathResult = `${urlPref}/${path}`

        isExists(LazyPage) && (isLazy ||= true)


        let _redirectTo = redirectTo
        if (isExists(redirectTo)) {
            if (redirectUseParentBase) {
                _redirectTo = urlPref
                redirectTo && (_redirectTo += '/' + redirectTo)
            }

            (routes as JSX.Element[]).push(
                <Route exact={exact} path={pathResult}>
                    <Redirect to={_redirectTo!} />
                </Route>
            )
        } else {
            const routeProps: RouteProps & { key?: string } = {
                path: pathResult
            }

            if (children) {
                const { routes: childrenRoutes, isLazy: childrenIsLazy } = createRoutes({
                    notFound,
                    routeConfig: children,
                    urlPref: pathResult,
                    UpLevelLayout: Layout
                })

                childrenIsLazy && (isLazy = true)

                routeProps.children = createRoutesWrapper(childrenRoutes, {
                    isLazy, Layout, LazyFallback
                })
            } else {
                routeProps.exact = exact

                const RouterPage = (Page || LazyPage)!
                const isLayoutUpdate = updateFromLayout && UpLevelLayout

                if (beforeEnter || isLayoutUpdate) {
                    routeProps.render = (props: RouteProps) => (
                        isLayoutUpdate
                            ?   <UpdateblePage { ...{ RouterPage, props, beforeEnter }}
                                    UpLevelLayout={UpLevelLayout!} />

                            :   <RouterPage { ...props } beforeEnter={beforeEnter!(props)} />
                    )
                } else routeProps.component = RouterPage
            }

            (routes as JSX.Element[]).push( <Route { ...routeProps } /> )
        }
    }

    notFound && urlPref && (routes as JSX.Element[]).push( createNotFoundRedirect(notFound.path) )


    return { routes, isLazy }
}

const createRouter: CreateRouter = ({ children, Layout, LazyFallback, notFound, history }) => {
    notFound?.path && (notFound.path = '/' + notFound.path)

    const { routes: createdRoutes, isLazy } = createRoutes({
        notFound,
        routeConfig: children,
        urlPref: '',
        UpLevelLayout: Layout
    })


    if (notFound) {
        const { Page, path } = notFound
        ;(createdRoutes as JSX.Element[]).push(
            <Route path={path} component={Page} />,
            createNotFoundRedirect(path)
        )
    }

    const routerContent = createRoutesWrapper(createdRoutes, {
        isLazy, Layout, LazyFallback
    })


    return <Router history={history || createBrowserHistory()} children={routerContent} />
}


export { createBrowserHistory, useUpdateChildren }
export default createRouter
export type { RouterConfig, RouteConfig, CreateRouter }