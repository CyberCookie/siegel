import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListElement = {
    title: React.ReactNode
    children?: ListElement[]
}


type ThemeKeys = 'item' | 'item_title' | 'item__empty' |  'item_title_wrapper' | 'children_wrapper'

type Props = {
    list: ListElement[]
    accordionIcon?: React.ReactNode
    soloOpen?: boolean
    builder?(title: React.ReactNode, children?: ListElement[]): ({
        elem: React.ReactNode,
        parentClassName: string
    })
    attributes?: ComponentAttributes<HTMLDivElement>
    autoExpand?: boolean
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, ListElement, Component }