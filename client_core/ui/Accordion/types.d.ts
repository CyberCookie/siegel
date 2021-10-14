import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListItenExpandedProps = {
    expanded?: boolean
}

type List = ({
    title: React.ReactNode
    children?: List
} & ListItenExpandedProps)[]

type BuilderArgs<T = unknown> = {
    listItem: BuilderList<T>[number]
    listItemTheme: Record<ThemeKeys, string>
    index: number
    acc: any
}
type BuilderList<T = unknown> = ({
    children?: BuilderList<T>
} & ListItenExpandedProps & T)[]


type ThemeKeys = 'item' | 'item_title' | 'item__empty' |  'item_title_wrapper' | 'children_wrapper'

type Props<T = unknown> = {
    accordionIcon?: React.ReactNode
    soloOpen?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
    autoExpand?: boolean
}
    &   PropsComponentThemed<ThemeKeys>
    &   ({
            builder(args: BuilderArgs<T>): ({
                elem: React.ReactNode
                acc?: any
                replaceParentIfLast?: boolean
            })
            list: BuilderList<T>
        }   |
        {
            builder?: never
            list: List
        })

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, List, BuilderList, Component }