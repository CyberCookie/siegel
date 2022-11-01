import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type DynamicCrumbsState = Indexable<React.ReactNode>
type DynamicCrumbsStore = ReactStore<DynamicCrumbsState>

type DynamicCrumbsCustomEventPayload = {
    /** Dynamic crumbs component ID ypu've passed to a Breadcrumbs compoent */
    componentDynamicCrumbsID?: string

    /**
     * Updates related Breadcrumbs component's dynamic crumbs state
     * with the next crumbs data
     */
    crumbs: DynamicCrumbsState
}


type CrumbConfig = {
    /** Crumb name */
    crumb: React.ReactNode | ((fullPath: string, pathPart: string) => React.ReactNode)
}
type NeverCrumbConfig = Never<CrumbConfig>

type DynamicCrumbConfig = {
    /** Dynamic crumb ID */
    dynamicCrumb: string
}
type NeverDynamicCrumbConfig = Never<DynamicCrumbConfig>

type CrumbComposedConfig =
    (CrumbConfig & NeverDynamicCrumbConfig)
    |
    (DynamicCrumbConfig & NeverCrumbConfig)
    |
    Never<CrumbConfig & DynamicCrumbConfig>

type BreadcrumbConfigPart = {
    /** Nested routes paths */
    children?: BreadcrumbConfig
} & CrumbComposedConfig

type BreadcrumbConfig = {
    /** Route path part */
    [path: string]: BreadcrumbConfigPart
}


type Theme = {
    /** Each bread crumb */
    crumb?: string
}

type Props = PropsComponentThemed<Theme, {
    /** Breadcrumbs config */
    config: BreadcrumbConfig

    /** Triggers when crumb link beem clicked */
    onChange(fullPath: string, pathPart: string, e: React.MouseEvent): void

    /** Crumbs separator element */
    separator?: React.ReactNode

    /**
     * String ID to be used in cutom event to trigger dynamic crumbs update.
     * Provide only if you use more than one Breadcrums component with dynamic
     * crumbs in it
     */
    dynamicCrumbsID?: string

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Required<Props['theme']>
    separator: Props['separator']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, MergedProps, Component, DynamicCrumbsStore, DynamicCrumbsCustomEventPayload,
    BreadcrumbConfig, BreadcrumbConfigPart, CrumbComposedConfig
}