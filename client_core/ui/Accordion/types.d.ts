import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListElement<T = any> = {
    title: React.ReactNode
    children?: ListElement<T>[]
    builderPayload?: T
}

type BuilderArgs<T> = {
    listItem: ListElement<T>
    listItemTheme: Record<'item' | 'item_title' | 'item_title_wrapper' | 'children_wrapper', string>
    index: number
    acc: any
}


type ThemeKeys = 'item' | 'item_title' | 'item__empty' |  'item_title_wrapper' | 'children_wrapper'

type Props<T = any> = {
    list: ListElement<T>[]
    accordionIcon?: React.ReactNode
    soloOpen?: boolean
    builder?(args: BuilderArgs<T>): ({
        elem: React.ReactNode
        acc?: any
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