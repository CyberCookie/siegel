import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ListItemExpandedProps = {
    expanded?: boolean
}

type List = ({
    title: React.ReactNode
    children?: List
} & ListItemExpandedProps)[]

type BuilderArgs<_BuilderListExtend> = {
    listItem: BuilderList<_BuilderListExtend>[number]
    listItemTheme: Record<ThemeKeys, string>
    index: number
    acc: any
}
type BuilderList<_BuilderListExtend = Indexable<any>> = ({
    children?: BuilderList<_BuilderListExtend>
} & ListItemExpandedProps & _BuilderListExtend)[]


type ThemeKeys = 'item' | 'item_title' | 'item__empty' |  'item_title_wrapper' | 'children_wrapper'

type Props<_BuilderListExtend = Indexable<any>> = {
    accordionIcon?: React.ReactNode
    soloOpen?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
    autoExpand?: boolean
}
    &   PropsComponentThemed<ThemeKeys>
    &   ({
            builder(args: BuilderArgs<_BuilderListExtend>): ({
                elem: React.ReactNode
                acc?: any
                replaceParentIfLast?: boolean
                expanded?: boolean
            })
            list: BuilderList<_BuilderListExtend>
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