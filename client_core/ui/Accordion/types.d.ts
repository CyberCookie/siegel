import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListElement<T = any> = {
    title: React.ReactNode
    children?: ListElement<T>[]
    builderPayload?: T
}


type ThemeKeys = 'item' | 'item_title' | 'item__empty' |  'item_title_wrapper' | 'children_wrapper'

type Props<T = any> = {
    list: ListElement<T>[]
    accordionIcon?: React.ReactNode
    soloOpen?: boolean
    builder?(title: React.ReactNode, children?: ListElement<T>[], builderPayload?: T): ({
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