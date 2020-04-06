import React, { Suspense } from 'react'
import { Switch, Router, Route, Redirect, withRouter } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'

import isExists from './utils/is_exists'


type RouterConfig = {
    [path: string]: {
        exact?: boolean,
        redirectTo?: string,
        children?: RouterConfig,
        component: React.ComponentType
    }
}

type CreateRouter = (options: {
    Layout?: React.ComponentType<any>,
    isLazy?: boolean,
    notFound?: React.ComponentType,
    routes: RouterConfig,
    history?: History
}) => JSX.Element

type CreateRoutes = (routerConfig: RouterConfig, urlPref?: string) => JSX.Element[]


const createRoutes: CreateRoutes = (routeConfig, urlPref = '') => {
    let result: JSX.Element[] = []

    for (const path in routeConfig) {
        const { exact = true, component, children, redirectTo } = routeConfig[path]
        
        if (isExists(redirectTo)) {
            result.push( <Redirect exact={exact} from={path} to={redirectTo} /> )
        } else {
            const pathResult = `${urlPref}/${path}`

            result.push(
                <Route key={pathResult} exact={exact} path={pathResult} component={component} />
            )

            if (children) {
                const childrenRoutes = createRoutes(children, pathResult)
                result = result.concat(childrenRoutes)
            }
        }
    }

    return result
}

const createRouter: CreateRouter = ({ routes, Layout, notFound, isLazy, history }) => {
    const createdRoutes = createRoutes(routes)
    notFound && createdRoutes.push( <Route key={404} component={notFound} /> )

    let routerContent = <Switch children={createdRoutes} />

    isLazy && (routerContent = <Suspense fallback='' children={routerContent} />)
    if (Layout) {
        const LayoutWithRouter = withRouter(Layout)
        routerContent = <LayoutWithRouter children={routerContent} />
    }

    
    return <Router history={history || createBrowserHistory()} children={routerContent} />
}


export default createRouter