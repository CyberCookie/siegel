import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type State = Indexable<string>
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


type BreadcrumbConfigPart = {
    children?: BreadcrumbConfig
    crumb?: string | ((fullPath: string, pathPart: string) => void)
    dynamicCrumb?: string
}

type BreadcrumbConfigPartOptional = {}

type BreadcrumbConfigPartComposed = BreadcrumbConfigPart | BreadcrumbConfigPartOptional

type BreadcrumbConfig = {
    [path: string]: BreadcrumbConfigPartComposed
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
    BreadcrumbConfig, BreadcrumbConfigPart
}