import type { History } from 'history'
import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type State = Indexable<string>
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


type BreadcrumbConfig = {
    [path: string]: {
        children?: BreadcrumbConfig
        crumb?: string | ((path: string, name: string) => void)
        dynamicCrumb?: string
    }
}


type ThemeKeys = 'link'

type Props = PropsComponentThemed<ThemeKeys, {
    config: BreadcrumbConfig
    history: History
    hasDynamicCrumbs?: boolean
    onChange?(path: string, e: React.MouseEvent): void
    separator?: React.ReactNode
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    className: NonNullable<Props['className']>
    separator: NonNullable<Props['separator']>
    theme: Required<NonNullable<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, BreadcrumbConfig, Store }