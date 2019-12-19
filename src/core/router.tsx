import React, { Suspense } from 'react'
import { Switch, Router, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'

interface RouterConfig {
    [path: string]: {
        exact?: boolean,
        redirectTo?: string,
        children?: RouterConfig,
        Component: React.ComponentType<any>
    }
}

type CreateRouter = (options: {
    Layout?: React.ComponentType,
    isLazy?: boolean,
    notFound?: React.ComponentType<any>,
    routes: RouterConfig,
    history?: History
}) => JSX.Element

type CreateRoutes = (routerConfig: RouterConfig, urlPref?: string) => JSX.Element[]


const createRoutes: CreateRoutes = (routeConfig, urlPref = '') => {
    let result: JSX.Element[] = []

    for (let path in routeConfig) {
        let { exact = true, Component, children, redirectTo } = routeConfig[path]
        
        if (redirectTo) {
            result.push(<Redirect exact={exact} from={path} to={redirectTo} />)
        } else {
            let pathResult = `${urlPref}/${path}`;

            result.push(
                <Route key={pathResult} exact={exact}
                    path={pathResult}
                    component={Component} />
            )

            if (children) {
                let childrenRoutes = createRoutes(children, pathResult)
                result = result.concat(childrenRoutes)
            }
        }
    }

    return result
}

const createRouter: CreateRouter = ({ routes, Layout, notFound, isLazy, history }) => {
    let createdRoutes = createRoutes(routes)
    notFound && createdRoutes.push( <Route key={404} component={notFound} /> )

    let routerContent = <Switch children={createdRoutes} />

    isLazy && (routerContent = <Suspense fallback='' children={routerContent} />)
    Layout && (routerContent = <Layout children={routerContent} />)


    return <Router history={history || createBrowserHistory()} children={routerContent} />
}


export default createRouter