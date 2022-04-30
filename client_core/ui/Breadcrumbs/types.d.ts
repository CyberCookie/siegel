import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type State = Indexable<string>
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


type BreadcrumbConfig = {
    [path: string]: {
        children?: BreadcrumbConfig
        crumb?: string | ((fullPath: string, pathPart: string) => void)
        dynamicCrumb?: string
    }
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

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, BreadcrumbConfig, Store }