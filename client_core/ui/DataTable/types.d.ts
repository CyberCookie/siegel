import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent, CoreUIComponentWithDefaults
} from '../_internals/types'
import type { TableTH, TableTD, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import type { Props as SelectProps, Component as SelectComponent } from '../Select/types'
import type { Props as PaginationProps, Component as PaginationComponent } from '../Pagination/types'


type DataTableTableProps = {
    className: NonNullable<TableProps['className']>
    head: NonNullable<TableProps['head']>
    body: NonNullable<TableProps['body']>
    foot?: NonNullable<TableProps['foot']>
    rootTagAttributes?: TableProps['rootTagAttributes']
}

type DisplayedEntityIDs = {
    from: number
    to: number
    allPagesIDs: string[]
} | undefined

type Entities<_Entity> = {
    /** Object where key is an entity ID and value is an entity itself */
    byID: Obj<_Entity>

    /** Sorted entity IDs */
    sorted: string[]
}

type StateSortValues = -1 | 1
type State<_SearchState = any> = {
    /** Entities sorting params */
    sortByField: {
        /** Active sorting column ID */
        ID: string | undefined

        /** Sort value */
        value: StateSortValues
    }

    /**
     * Entities filtering params, where key is column ID and value is filtering value
     */
    searchByField: Obj<_SearchState | undefined>

    /** Column IDs to be hidden */
    toggledColumns: Set<string>

    /** Number of entities showed per one pagination page */
    showPerPage: number

    /** Current pagination page */
    currentPage: number
}


type ColumnsConfig<
    _Entity extends Obj,
    _ColumnParamsExtend = any,
    _SearchState = any,
    _ByID = Obj<_Entity>,
    _Sorted = string[]
> = {
    /** Column ID */
    ID: string

    /**
     * Get display value
     *
     * @param entity table entity
     */
    showValue(entity: _Entity): TableTD

    /**
     *
     * @param IDs
     * @param byID
     * @param value
     */
    onSort?(IDs: _Sorted, byID: _ByID, value: number): Sorted

    /**
     *
     * @param IDs
     * @param byID
     * @param search
     */
    onFilter?(IDs: _Sorted, byID: _ByID, search: _SearchState): Sorted

    /** */
    label?: React.ReactNode

    /** */
    customParams?: _ColumnParamsExtend
}


type Theme = {
    /** Root tag state if footer is applied */
    _with_footer?: string

    /** Underlaying table tag */
    table?: string

    /** Children element */
    children?: string

    /** Data table column resizers elemnts */
    table_resizer?: string

    /** Pagination wrapper element */
    pagination_wrapper?: string

    /** Applied to pagination wrapper if there is only one page in pagination */
    pagination_single_page?: string
}

type Props<
    _Entity = Obj,
    _ColumnParamsExtend = any,
    _SearchState = any
> = PropsComponentThemed<Theme, {
    /** Data table entities to be listed */
    entities: Entities<_Entity>

    /** Data table columns configurations */
    columnsConfig: ColumnsConfig<_Entity, _ColumnParamsExtend, _SearchState>[]

    /**
     * Data table entitites that always appear on top of the table.
     * The entities can't be filtered out
     */
    pinnedEntities?: Entities<_Entity>

    /** Data table inner store */
    store?: ReactStore<State<_SearchState>>

    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'>
    >
    withFooter?: {
        defaultShowPerPage: number
        displayQuantity?(quantity: number): React.ReactNode
        select?: {
            component: CoreUIComponentWithDefaults<SelectComponent> | SelectComponent
            props: Pick<SelectProps<number>, 'options'> & Partial<SelectProps<number>>
        }
        pagination?: {
            component: CoreUIComponentWithDefaults<PaginationComponent> | PaginationComponent
            props?: Partial<PaginationProps>
            isRenderForSinglePage?: boolean
        }
    }
    virtualization?: {
        itemHeight: number
        tableHeight?: number
        preloadedItemsBySide?: number
        scrollUpdateInterval?: number
    }
    onScroll?(event: React.UIEvent<HTMLDivElement>): void
    children?: React.ReactNode
    tableAttributes?: TableProps['rootTagAttributes']
    resizable?: boolean
    postProcessHeadCell?(
        headCell: TableTH,
        columnsConfig: ColumnsConfig<_Entities, _ColumnParamsExtend>,
        displayedEntityIDs: NonNullable<DisplayedEntityIDs>
    ): void
    postProcessHeadRow?(rows: TableHeadRow[], displayedEntityIDs: NonNullable<DisplayedEntityIDs>): void
    postProcessBodyRow?(row: Required<TableBodyRow>[], entity: _Entity, index: number): void
}>


type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    State, Props, DefaultProps, MergedProps, Component, DataTableTableProps,
    ColumnsConfig, DisplayedEntityIDs, StateSortValues
}