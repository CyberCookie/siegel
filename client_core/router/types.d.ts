import type { SuspenseProps } from 'react'
import type { RouteProps } from 'react-router-dom'
import type { History } from 'history'


type BeforeEnterProp = {
    beforeEnter?(props: RouteProps): any
}

type Page = React.ComponentType<BeforeEnterProp>
type LazyPage = React.LazyExoticComponent<Page>
type Layout = React.ComponentType<any>
type LazyFallback = SuspenseProps['fallback']
type IsLazy = boolean
type NotFoundPage = {
    path: string
    Page: Page
}
type Routes = JSX.Element[] | JSX.Element


type RouteConfig = {
    Page?: Page
    LazyPage?: LazyPage
    LazyFallback?: LazyFallback
    Layout?: Layout
    exact?: boolean
    redirectTo?: string
    redirectUseParentBase?: boolean
    children?: RouterConfig
    updateFromLayout?: boolean
} & BeforeEnterProp

type RouterConfig = {
    [path: string]: RouteConfig
}

type CreateRouter = (
    options: {
        history?: History
        notFound?: NotFoundPage
        children: RouterConfig
    } & Pick<RouteConfig, 'Layout' | 'LazyFallback'>
) => JSX.Element

type CreateRoutes = (params: {
    routeConfig: RouterConfig,
    urlPref: string,
    notFound?: NotFoundPage
    UpLevelLayout?: Layout
}) => {
    routes: Routes
    isLazy: IsLazy
}

type CreateRoutesWrapper = (
    routes: Routes,
    params: {
        isLazy: IsLazy
        LazyFallback?: LazyFallback
        Layout?: Layout
    }
) => JSX.Element

type UpdateblePageProps = {
    RouterPage: NonNullable<Page | LazyPage>
    props: RouteProps,
    UpLevelLayout: Layout & { __childrenRefresh?: (() => void) | null }
} & BeforeEnterProp


export type { CreateRoutesWrapper, UpdateblePageProps, CreateRoutes, CreateRouter, RouterConfig, RouteConfig }