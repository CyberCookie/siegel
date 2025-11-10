import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type List = {
    /** List item title element */
    title: React.ReactNode

    /** List item optional id. Default is item index */
    id?: string

    /** List item nested list */
    children?: List
}[]

type BuilderList<_BuilderListExtend = Obj> = ({
    /** List item nested list */
    children?: BuilderList<_BuilderListExtend>

    /** List item optional id */
    id?: string
} & _BuilderListExtend)[]


type Theme = {
    /** List item wrapper */
    item?: string

    /** List item wrapper state when it has no nested list */
    item__empty?: string

    /** List item wrapper state when its nested list is expanded */
    item__expanded?: string

    /** List item title wrapper */
    item_title_wrapper?: string

    /** List item title */
    item_title?: string

    /** List item nested list */
    nested_list?: string
}

type Props<_BuilderListExtend = Obj> = PropsComponentThemed<
    Theme,
    {
        /** Icon to place next to item title */
        accordionIcon?: React.ReactNode

        /** Forces only one list to be expanded at the moment */
        soloOpen?: boolean

        /** Root tag [<ul>] attributes */
        rootTagAttributes?: CoreUIReactTagAttributes<HTMLUListElement>

        /** Renders list with all the nested lists already expanded */
        autoExpand?: boolean

        /** External store, created with React.useState, to controll expanding of nested lists */
        store?: ReactStore<{
            /**
             * Expanded lists paths, where key is dot separeted nested lists ids,
             * and value is boolean
             */
            expandedPaths: Obj<boolean>
        }>
    }
    &   ({
            /**
             * Allows you to provide list items with custom properties
             * and construct the output list elements using this function
             *
             * @param params - Current list item params
             */
            builder(
                params: {
                    /** List item object with custom properties */
                    listItem: BuilderList<_BuilderListExtend>[number]

                    /** Mutable list item theme to be applied to the current list item */
                    listItemTheme: NonNullable<Props['theme']>

                    /** List item index */
                    index: number

                    /** Accumulated value in the scope of mutual parent */
                    acc: any
                }
            ): ({
                /** List item element */
                elem: React.ReactNode

                /** Optioanl accumulator value */
                acc?: any
            })

            /** List items data with custom item properties if builder is provided; */
            list: BuilderList<_BuilderListExtend>
        }
        |
        {
            /** List items data when no builder provided; */
            list: List

            builder?: never
        })
>


type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, List, BuilderList, Component }