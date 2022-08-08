import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type State = Indexable<string>
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


type CrumbConfig = {
    crumb: string | ((fullPath: string, pathPart: string) => void)
}
type NeverCrumbConfig = Never<CrumbConfig>

type DynamicCrumbConfig = {
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
    children?: BreadcrumbConfig
} & CrumbComposedConfig

type BreadcrumbConfig = {
    [path: string]: BreadcrumbConfigPart
}


type Theme = {
    crumb?: string
}

type Props = PropsComponentThemed<Theme, {
    config: BreadcrumbConfig
    onChange(fullPath: string, pathPart: string, e: React.MouseEvent): void
    separator?: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Required<Props['theme']>
    separator: Props['separator']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, MergedProps, Component, Store,
    BreadcrumbConfig, BreadcrumbConfigPart, CrumbComposedConfig
}