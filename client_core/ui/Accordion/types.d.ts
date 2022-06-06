import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type ListItemExpandedProps = {
    expanded?: boolean
}

type List = ({
    title: React.ReactNode
    children?: List
} & ListItemExpandedProps)[]

type BuilderArgs<_BuilderListExtend> = {
    listItem: BuilderList<_BuilderListExtend>[number]
    listItemTheme: NonNullable<Props['theme']>
    index: number
    acc: any
}
type BuilderList<_BuilderListExtend = Indexable<any>> = ({
    children?: BuilderList<_BuilderListExtend>
} & ListItemExpandedProps & _BuilderListExtend)[]


type Theme = {
    item?: string
    item__empty?: string
    item_title?: string
    item_title_wrapper?: string
    item_children_wrapper?: string
}

type Props<_BuilderListExtend = Indexable<any>> = PropsComponentThemed<
    Theme,
    {
        accordionIcon?: React.ReactNode
        soloOpen?: boolean
        rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
        autoExpand?: boolean
    }
    &   ({
            builder(args: BuilderArgs<_BuilderListExtend>): ({
                elem: React.ReactNode
                acc?: any
                replaceParentIfLast?: boolean
                expanded?: boolean
            })
            list: BuilderList<_BuilderListExtend>
        }
        |
        {
            builder?: never
            list: List
        })
>


type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, List, BuilderList, Component }