import type { RouterProps } from '../types'


type URLparams = Indexable<string>

type ChildrenArrayEl = {
    traversePath: string
    historyState: any
    El: RouterPageConfig['page'] | RouteLayoutConfig['Layout']
    fallback?: PageLayoutCommons['fallback']
    onEnter?: PageLayoutCommons['onEnter']
    onLeave?: PageLayoutCommons['onLeave']
}

type ParsePathname = (
    routerProps: RouterProps, pathname: string, historyState: any
) => {
    childrenArray: ChildrenArrayEl[]
    urlParams: URLparams
    newPathname: string
    newHistoryState: any
    transitionData: RoutesConfig[string]['transition']
}

type GetPageParams = {
    El: ChildrenArrayEl['El']
    fallback: ChildrenArrayEl['fallback']
    onEnter: ChildrenArrayEl['onEnter']
    onLeave: ChildrenArrayEl['onLeave']
    urlParams: URLparams
    resultElement: JSX.Element | undefined
}



type RouterState = {
    pathname: string
    prevChildrenArray: {
        resultElement: GetPageParams['resultElement']
        traversePath: ChildrenArrayEl['traversePath']
        historyState: ChildrenArrayEl['historyState']
    }[]
    prevPathnameParseResult: null | ReturnType<ParsePathname>
    transitionTimeoutID: ReturnType<Window['setTimeout']> | undefined
}
type RouterStore = [ RouterState, React.Dispatch<React.SetStateAction<RouterState>> ]



type Transition = {
    duration: number
    wrapperClassName?: string
    performOnHistoryStateChange?: boolean
}

type LazyComponentIdentifier = {
    _init?: Function
}

type PageProps = {
    urlParams: URLparams
    onEnterData: any
}
type Page = React.ComponentType<PageProps>
type LazyPage = React.LazyExoticComponent<Page> & LazyComponentIdentifier

type LayoutProps = {
    children?: React.ReactNode
}
type Layout = React.ComponentType<PageProps & LayoutProps>
type LazyLayout = React.LazyExoticComponent<Layout> & LazyComponentIdentifier

type RedirectToPath = string
type RedirectToPathGetter = (() => string)
type RedirectToPathObj = {
    path: RedirectToPath | RedirectToPathGetter
    state?: any | (() => any)
}

type RouteConfigAllFields = {
    Page: Page | LazyPage
    paramName: string
    Layout: Layout | LazyLayout
    children: RoutesConfig
    fallback: React.ReactNode
    onEnter: (URLparams: URLparams) => any
    onLeave: () => void
    transition: false | Transition
    permissions: boolean | ((urlParams: URLparams) => boolean)
    redirectTo: RedirectToPathObj | RedirectToPathGetter | RedirectToPath
}

type RouteRedirectConfig = {
    redirectTo: RouteConfigAllFields['redirectTo']
}

type RoutePermissionsConfig = {
    permissions: RouteConfigAllFields['permissions']
    redirectTo: RouteConfigAllFields['redirectTo']
}

type PageLayoutCommons = {
    onEnter?: RouteConfigAllFields['onEnter']
    onLeave?: RouteConfigAllFields['onLeave']
    fallback?: RouteConfigAllFields['fallback']
} & ({
        children: RouteConfigAllFields['children']
        transition?: RouteConfigAllFields['transition']
    }
    | {
        children?: never
        transition?: never
    })

type RouterPageConfig = {
    Page: RouteConfigAllFields['Page']
    paramName?: RouteConfigAllFields['paramName']
}

type RouteLayoutConfig = {
    Layout: RouteConfigAllFields['Layout']
}

type RouteLayoutExcludePage = RouteLayoutConfig & PageLayoutCommons & Never<RouterPageConfig>

type RouteLayoutExclude = RouteLayoutConfig & PageLayoutCommons & Never<RouterPageConfig>
    & Never<RouteRedirectConfig> & Never<RoutePermissionsConfig>

type RoutePageExcludeLayout = RouterPageConfig & PageLayoutCommons & Never<RouteLayoutConfig>

type RoutePageExclude = RouterPageConfig & PageLayoutCommons & Never<RouteLayoutConfig>
    & Never<RouteRedirectConfig> & Never<RoutePermissionsConfig>

type RoutePermissionsExclude = RoutePermissionsConfig
    & (RoutePageExcludeLayout | RouteLayoutExcludePage)

type RouterRedirectExclude = RouteRedirectConfig & Never<Omit<RoutePermissionsExclude, keyof RouteRedirectConfig>>
    & Never<RouteLayoutExcludePage> & Never<RoutePageExcludeLayout>

type RoutesConfig = Record<
    string,
    RoutePermissionsExclude | RouterRedirectExclude | RouteLayoutExclude | RoutePageExclude
>


type RouterProps = {
    children: RoutesConfig
    Layout?: any
    basename?: string
    transition?: Transition
}


export type {
    ChildrenArrayEl, ParsePathname,
    RouterProps, RoutesConfig, LazyLayout, LazyPage, Page, Layout,
    URLparams, RouterStore, RouterState, GetPageParams,
    RedirectToPathGetter, RedirectToPathObj, RedirectToPath
}