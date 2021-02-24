import React, { Suspense } from 'react'
import { Switch, Router, Route, Redirect, withRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import type { RouteProps } from 'react-router-dom'
import type { History } from 'history'

import isExists from './utils/is_exists'


type BeforeEnterProp = {
    beforeEnter?(props: RouteProps): any
}

type Component = React.ComponentType<BeforeEnterProp>
type LazyComponent = React.LazyExoticComponent<Component>

type RouteConfig = {
    component: Component | LazyComponent
    layout?: React.ComponentType<any>
    exact?: boolean
    redirectTo?: string
    children?: RouterConfig
}
type RouterConfig = {
    [path: string]: RouteConfig & BeforeEnterProp
}

type CreateRouter = (options: {
    Layout?: React.ComponentType<any>
    notFound?: React.ComponentType
    routes: RouterConfig
    history?: History
}) => JSX.Element

type CreateRoutes = (routerConfig: RouterConfig, urlPref?: string) => {
    routes: JSX.Element[] | JSX.Element
    isLazy: boolean
}


const wrapRoutesIntoLayout = (routes: ReturnType<CreateRoutes>['routes'], layout: RouteConfig['layout']) => {
    const LayoutWithRouter = withRouter(layout)
    return <LayoutWithRouter children={routes} />
}

const createRoutes: CreateRoutes = (routeConfigs, urlPref = '') => {
    let routes: JSX.Element[] | JSX.Element = []
    let isLazy = false;

    for (const path in routeConfigs) {
        const routeConfig = routeConfigs[path]
        const { exact = true, component, children, redirectTo, beforeEnter, layout } = routeConfig;
        isExists((component as LazyComponent)._result) && (isLazy ||= true)
        
        if (isExists(redirectTo)) {
            (routes as JSX.Element[]).push( <Redirect exact={exact} from={path} to={redirectTo || '/'} /> )
        } else {
            const pathResult = `${urlPref}/${path}`
            const Page = component;

            const routeProps: RouteProps & { key?: string } = {
                exact,
                path: pathResult,
                key: pathResult
            }

            beforeEnter
                ?   routeProps.render = (props: RouteProps) => <Page {...props} beforeEnter={beforeEnter(props)} />
                :   routeProps.component = Page;
                
            (routes as JSX.Element[]).push( <Route {...routeProps} /> )


            if (children) {
                const { routes: childrenRoutes, isLazy: childrenIsLazy } = createRoutes(children, pathResult)
                
                childrenIsLazy && (isLazy = true)
                routes = (routes as JSX.Element[]).concat(childrenRoutes)
            }

            layout && (routes = wrapRoutesIntoLayout(routes, layout))
        }
    }


    return { routes, isLazy }
}

const createRouter: CreateRouter = ({ routes, Layout, notFound, history: _history }) => {
    const { routes: createdRoutes, isLazy } = createRoutes(routes)
    notFound && (createdRoutes as JSX.Element[]).push( <Route key={404} component={notFound} /> )

    let routerContent = <Switch children={createdRoutes} />
    isLazy && (routerContent = <Suspense fallback='' children={routerContent} />)
    Layout && (routerContent = wrapRoutesIntoLayout(routerContent, Layout))

    
    return <Router history={_history || createBrowserHistory()} children={routerContent} />
}


export { createBrowserHistory }
export default createRouter
export type { RouterConfig, RouteConfig, CreateRouter }