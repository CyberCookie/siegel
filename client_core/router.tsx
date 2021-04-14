//TODO: rerender routes on layout rerender (optional)

import React, { Suspense, SuspenseProps } from 'react'
import { Switch, Router, Route, Redirect, withRouter, RouteProps } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'

import isExists from './utils/is_exists'


type BeforeEnterProp = {
    beforeEnter?(props: RouteProps): any
}
type Component = React.ComponentType<BeforeEnterProp>

type RouteConfig = {
    Page?: Component
    LazyPage?: React.LazyExoticComponent<Component>
    LazyFallback?: SuspenseProps['fallback']
    Layout?: React.ComponentType<any>
    exact?: boolean
    redirectTo?: string
    redirectUseParentBase?: boolean
    children?: RouterConfig
} & BeforeEnterProp

type RouterConfig = {
    [path: string]: RouteConfig
}

type CreateRouter = (
    options: {
        history?: History
        notFound?: {
            path: string
            Page: RouteConfig['Page']
        }
        children: NonNullable<RouteConfig['children']>
    } & Pick<RouteConfig, 'Layout' | 'LazyFallback'>
) => JSX.Element

type CreateRoutes = (
    routerConfig: RouterConfig,
    urlPref: string,
    notFound?: Parameters<CreateRouter>['0']['notFound']
) => {
    routes: JSX.Element[] | JSX.Element
    isLazy: boolean
}

type CreateRoutesWrapper = (
    routes: ReturnType<CreateRoutes>['routes'],
    params: {
        isLazy: ReturnType<CreateRoutes>['isLazy']
        Layout: RouteConfig['Layout']
        LazyFallback: RouteConfig['LazyFallback']
    }
) => JSX.Element


const createRoutesWrapper: CreateRoutesWrapper = (routes, params) => {
    const { Layout, isLazy, LazyFallback } = params;

    let wrapper = <Switch children={routes} />
    isLazy && (wrapper = <Suspense fallback={LazyFallback || ''} children={wrapper} />)

    if (Layout) {
        const LayoutWithRouter = withRouter(Layout)
        wrapper = <LayoutWithRouter children={wrapper} />
    }
    

    return wrapper
}

const createNotFoundRedirect = (path: string) => <Route path='*' children={ <Redirect to={path} /> } />

const createRoutes: CreateRoutes = (routeConfigs, urlPref, notFound) => {
    const routes: JSX.Element[] | JSX.Element = []
    let isLazy = false;

    for (const path in routeConfigs) {
        const {
            exact = true,
            Layout, beforeEnter, Page, LazyPage, LazyFallback, children, redirectTo, redirectUseParentBase
        } = routeConfigs[path];

        const pathResult = `${urlPref}/${path}`
        
        isExists(LazyPage) && (isLazy ||= true)
        
        
        let _redirectTo = redirectTo;
        if (isExists(redirectTo)) {
            if (redirectUseParentBase) {
                _redirectTo = urlPref;
                redirectTo && (_redirectTo += `/` + redirectTo)
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
                const { routes: childrenRoutes, isLazy: childrenIsLazy } = createRoutes(children, pathResult, notFound)
                childrenIsLazy && (isLazy = true)

                routeProps.children = createRoutesWrapper(childrenRoutes, {
                    isLazy, Layout, LazyFallback
                })
            } else {
                routeProps.exact = exact;
                
                const RouterPage = (Page || LazyPage)!;
                beforeEnter
                    ?   routeProps.render = (props: RouteProps) => <RouterPage {...props} beforeEnter={beforeEnter(props)} />
                    :   routeProps.component = RouterPage
            }

            (routes as JSX.Element[]).push( <Route {...routeProps} /> )
        }
    }
    
    notFound && urlPref && (routes as JSX.Element[]).push( createNotFoundRedirect(notFound.path) )


    return { routes, isLazy }
}

const createRouter: CreateRouter = ({ children, Layout, LazyFallback, notFound, history }) => {
    notFound?.path && (notFound.path = '/' + notFound.path)

    const { routes: createdRoutes, isLazy } = createRoutes(children, '', notFound)

    if (notFound) {
        const { Page, path } = notFound;
        (createdRoutes as JSX.Element[]).push(
            <Route path={path} component={Page} />,
            createNotFoundRedirect(path)
        )
    }

    const routerContent = createRoutesWrapper(createdRoutes, {
        isLazy, Layout, LazyFallback
    })

    
    return <Router history={history || createBrowserHistory()} children={routerContent} />
}


export { createBrowserHistory }
export default createRouter
export type { RouterConfig, RouteConfig, CreateRouter }