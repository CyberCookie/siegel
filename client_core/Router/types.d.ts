declare global {
    interface History {
        push?: (url: string, state?: any, isRedirect?: boolean) => void
        basename?: string
        updateBasename?: (newBasename: string) => void
    }
}


type RouterStore = [ string, React.Dispatch<React.SetStateAction<string>> ]

type URLparams = Indexable<string>

type GetPageParams = {
    El: RouterPageConfig['page'] | RouteLayoutConfig['Layout']
    fallback: PageLayoutCommons['fallback']
    onEnter: PageLayoutCommons['onEnter']
    onLeave: PageLayoutCommons['onLeave']
    urlParams: URLparams
    resultElement: JSX.Element | undefined
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

type PageLayoutCommons = {
    onEnter?: (URLparams: URLparams) => any
    onLeave?: () => void
    children?: RoutesConfig
    fallback?: React.ReactNode
}

type RouterPageConfig = {
    Page: Page | LazyPage
    paramName?: string
    redirectTo?: never
    Layout?: never
} & PageLayoutCommons

type RouteRedirectConfig = {
    redirectTo: string
    onEnter?: never
    onLeave?: never
    children?: never
    fallback?: never
    Page?: never
    Layout?: never
    paramName?: never
}

type RouteLayoutConfig = {
    Layout: Layout | LazyLayout
    redirectTo?: never
    Page?: never
    paramName?: never
} & PageLayoutCommons

type RoutesConfig = Record<
    string,
    RouterPageConfig | RouteLayoutConfig | RouteRedirectConfig
>


type RouterProps = {
    children: RoutesConfig
    Layout?: any
    basename?: string
}


export type {
    RouterProps, RoutesConfig, LazyLayout, LazyPage, Page, Layout,
    URLparams, RouterStore, GetPageParams
}