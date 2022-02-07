import type { SuspenseProps } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { History } from 'history'


type AllNever<T extends Record<string, unknown>> = {
    [K in keyof T]?: never
}


type Page = React.ComponentType<BeforeEnterRouteConfig & RouteComponentProps>
type LazyPage = React.LazyExoticComponent<Page>
type Layout = React.ComponentType<any>
type LazyFallback = SuspenseProps['fallback']
type IsLazy = boolean
type NotFoundPage = {
    path: string
    Page: Page
}
type Routes = JSX.Element[] | JSX.Element



type BeforeEnterRouteConfig = {
    beforeEnter?(props: RouteComponentProps): RouteComponentProps | void
}
type ExactRouteConfig = { exact?: boolean }


type NormalPageRouteConfig = { Page: Page }
type NotNormalPageRouteConfig = AllNever<NormalPageRouteConfig>
type NormalPageRouteConfigExcludeOthers = NormalPageRouteConfig & NotLazyPageRouteConfig


type LazyPageRouteConfig = {
    LazyPage: LazyPage
    LazyFallback?: LazyFallback
}
type NotLazyPageRouteConfig = AllNever<LazyPageRouteConfig>
type LazyPageRouteConfigRouteConfigExcludeOthers = LazyPageRouteConfig & NotNormalPageRouteConfig


type PageRouteConfig = BeforeEnterRouteConfig
    &   { updateFromLayout?: boolean }
    &   ( NormalPageRouteConfigExcludeOthers | LazyPageRouteConfigRouteConfigExcludeOthers)
type NotPageRouteConfig = AllNever<PageRouteConfig>
type PageRouteConfigRouteConfigExcludeOthers = PageRouteConfig & NotWithChildrenRouteConfig & NotRedirectRouteConfig


type WithChildrenRouteConfig = {
    children: RouterConfig
    Layout?: Layout
}
type NotWithChildrenRouteConfig = AllNever<WithChildrenRouteConfig>
type WithChildrenRouteConfigRouteConfigExcludeOthers = WithChildrenRouteConfig & NotPageRouteConfig & NotRedirectRouteConfig


type RedirectRouteConfig = {
    redirectTo: string
    redirectUseParentBase?: boolean
}
type NotRedirectRouteConfig = AllNever<RedirectRouteConfig>
type RedirectRouteConfigRouteConfigExcludeOthers = RedirectRouteConfig & NotWithChildrenRouteConfig & NotPageRouteConfig


type RouteConfig = WithChildrenRouteConfigRouteConfigExcludeOthers
    |   ((PageRouteConfigRouteConfigExcludeOthers | RedirectRouteConfigRouteConfigExcludeOthers) & ExactRouteConfig)
type RouterConfig = {
    [path: string]: RouteConfig
}



type CreateRouter = (
    options: {
        history?: History
        notFound?: NotFoundPage
        children: RouterConfig
    } & (Pick<WithChildrenRouteConfig, 'Layout'> & Pick<LazyPageRouteConfig, 'LazyFallback'>)
) => JSX.Element

type CreateRoutes = (params: {
    routeConfig: RouterConfig
    urlPref: string
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
    props: RouteComponentProps
    UpLevelLayout: Layout & { __childrenRefresh?: (() => void) | null }
} & BeforeEnterRouteConfig


export type {
    Page, CreateRoutesWrapper, UpdateblePageProps, CreateRoutes, CreateRouter, RouterConfig, RouteConfig, ExactRouteConfig
}