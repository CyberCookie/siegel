import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type List = {
    title: React.ReactNode
    id?: string
    children?: List
}[]

type BuilderArgs<_BuilderListExtend> = {
    listItem: BuilderList<_BuilderListExtend>[number]
    listItemTheme: NonNullable<Props['theme']>
    index: number
    acc: any
}
type BuilderList<_BuilderListExtend = Indexable<any>> = ({
    children?: BuilderList<_BuilderListExtend>
    id?: string
} & _BuilderListExtend)[]


type Theme = {
    item?: string
    item__empty?: string
    item__expanded?: string
    item_title?: string
    item_title_wrapper?: string
    nested_list?: string
}

type Props<_BuilderListExtend = Indexable<any>> = PropsComponentThemed<
    Theme,
    {
        accordionIcon?: React.ReactNode
        soloOpen?: boolean
        rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
        autoExpand?: boolean
        store?: ReactStore<{
            expandedPaths: Indexable
        }>
    }
    &   ({
            builder(args: BuilderArgs<_BuilderListExtend>): ({
                elem: React.ReactNode
                acc?: any
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