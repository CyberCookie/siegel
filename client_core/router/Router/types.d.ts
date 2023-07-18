type URLparams = Obj<string>

type ChildrenArrayEl = {
    traversePath: string
    historyState: any
    El: RouteConfigAllFields['Page'] | RouteConfigAllFields['Layout']// | (() => React.ReactNode)
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
    transitionData: NonNullable<RoutesConfig[string]>['transition']
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
type RouterStore = ReactStore<RouterState>



type Transition = {
    /** Transition duration in ms. */
    duration: number

    /** ClassName to be applied to a wrapper that wraps previous and next pages */
    wrapperClassName?: string

    /** Whether to perform transition if same page but different history states */
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
    state?: any
}




type RouteConfigAllFields<_WithPageExtend = {}> = {
    /** Page to render */
    Page: Page | LazyPage

    /** React component to wrap all the children pages */
    Layout: Layout | LazyLayout

    /** Component to display while Page or Layout is lazy loading */
    fallback: React.ReactNode

    /**
     * Executes before first page render
     *
     * @param URLparams Object with parsed url params
     */
    onEnter(URLparams: URLparams): any

    /** Triggered before current component was replaced with another one */
    onLeave(): void

    /** URL parameter name in dynamic route */
    paramName: string

    /** Path to redirect to if current route URL was matched */
    redirectTo: RedirectToPathObj | RedirectToPathGetter | RedirectToPath

    /** Defines children transition params or disables global ones for the nested children */
    transition: false | Transition

    /** Specify whether user has permissions to visit this page */
    permissions: boolean | ((urlParams: URLparams) => boolean)

    /** Nested routes config */
    children: RoutesConfig<_WithPageExtend>
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



type RoutesConfig<_WithPageExtend = {}> = Obj<
    RouteWithPageConfig<_WithPageExtend>
    | RouteWithLayoutConfig
    | RouteWithChildrenConfig
    | RouteWithPermissionsConfig
    | RouteWithRedirectConfig
>



type RouterProps = {
    /** Routes config */
    children: RoutesConfig

    /** React component to wrap all the children pages */
    Layout?: Layout

    /** URL path prefix */
    basename?: string

    /** Defines global cross pages transition params */
    transition?: Transition
}


export type {
    ChildrenArrayEl, ParsePathname,
    RouterProps, RoutesConfig, LazyLayout, LazyPage, Page, Layout,
    URLparams, RouterStore, RouterState, GetPageParams,
    RedirectToPathGetter, RedirectToPathObj, RedirectToPath
}