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




type RouteConfigAllFields<_WithPageExtend = {}> = {
    Page: Page | LazyPage
    paramName: string
    Layout: Layout | LazyLayout
    children: RoutesConfig<_WithPageExtend>
    fallback: React.ReactNode
    onEnter: (URLparams: URLparams) => any
    onLeave: () => void
    transition: false | Transition
    permissions: boolean | ((urlParams: URLparams) => boolean)
    redirectTo: RedirectToPathObj | RedirectToPathGetter | RedirectToPath
}



type PageLayoutCommons = {
    onEnter?: RouteConfigAllFields['onEnter']
    onLeave?: RouteConfigAllFields['onLeave']
    fallback?: RouteConfigAllFields['fallback']
}


type RoutePageConfig<_WithPageExtend = {}> = {
    Page: RouteConfigAllFields['Page']
    paramName?: RouteConfigAllFields['paramName']
} & _WithPageExtend
type NeverPageConfig = Never<RoutePageConfig>


type RouteLayoutConfig = {
    Layout: RouteConfigAllFields['Layout']
}
type NeverLayoutConfig = Never<RouteLayoutConfig>


type RouteChildrenConfig<_WithPageExtend = {}> = {
    children: RouteConfigAllFields<_WithPageExtend>['children']
    transition?: RouteConfigAllFields['transition']
}
type NeverChildrenConfig = Never<RouteChildrenConfig>


type RouteRedirectConfig = {
    redirectTo: RouteConfigAllFields['redirectTo']
}
type NeverRedirectConfig = Never<RouteRedirectConfig>


type RoutePermissionsConfig = {
    permissions: RouteConfigAllFields['permissions']
    redirectTo: RouteConfigAllFields['redirectTo']
}
type NeverPermissionsConfig = Never<RoutePermissionsConfig>




type RouteWithPageLayoutCommon<_WithPageExtend = {}> = PageLayoutCommons
    & (RouteChildrenConfig<_WithPageExtend> | NeverChildrenConfig)
    & (RoutePermissionsConfig | NeverPermissionsConfig)

type RouteWithPageConfig<_WithPageExtend = {}> = RouteWithPageLayoutCommon<_WithPageExtend>
    & RoutePageConfig<_WithPageExtend>
    & NeverLayoutConfig

type RouteWithLayoutConfig = RouteWithPageLayoutCommon & RouteLayoutConfig
    & NeverPageConfig

type RouteWithChildrenConfig = RouteChildrenConfig
    & (Never<PageLayoutCommons & RoutePageConfig & RouteLayoutConfig>)
    & (RoutePermissionsConfig | NeverPermissionsConfig)

type RouteWithPermissionsConfig = RoutePermissionsConfig
    & (RouteWithPageConfig | RouteWithLayoutConfig | RouteWithChildrenConfig)

type RouteWithRedirectConfig = RouteRedirectConfig
    & Never<PageLayoutCommons & RoutePageConfig & RouteLayoutConfig & RouteChildrenConfig>
    & Never<Omit<RoutePermissionsConfig, keyof RouteRedirectConfig>>



type RoutesConfig<_WithPageExtend = {}> = Indexable<
    RouteWithPageConfig<_WithPageExtend>
    | RouteWithLayoutConfig
    | RouteWithChildrenConfig
    | RouteWithPermissionsConfig
    | RouteWithRedirectConfig
>



type RouterProps = {
    children: RoutesConfig
    Layout?: Layout
    basename?: string
    transition?: Transition
}


export type {
    ChildrenArrayEl, ParsePathname,
    RouterProps, RoutesConfig, LazyLayout, LazyPage, Page, Layout,
    URLparams, RouterStore, RouterState, GetPageParams,
    RedirectToPathGetter, RedirectToPathObj, RedirectToPath
}