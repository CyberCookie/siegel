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
    /** First visible entity index */
    from: number

    /** Last visible entity index */
    to: number

    /** All pages entity IDs */
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
     * Entities filtering params, where key is a column ID and value is a filtering value
     */
    searchByField: Obj<_SearchState | undefined>

    /** Column IDs to be hidden */
    toggledColumns: Set<string>

    /** Number of entities showed per one pagination page */
    showPerPage: number

    /** Current pagination page */
    currentPage: number

    /** Readonly inner filtered props.entities.sorted array of entities IDs */
    __resultIDs: string[]
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
     * Sorts list of entities by sorting their IDs
     *
     * @param IDs entities IDs array
     * @param byID entities hashtable where key is entity ID and value is entity
     * @param value sorting value
     */
    onSort?(IDs: _Sorted, byID: _ByID, value: number): _Sorted

    /**
     * Filters list of entities by filtering out their IDs
     *
     * @param IDs entities IDs array
     * @param byID entities hashtable where key is entity ID and value is entity
     * @param search search value you put into DataTable store
     */
    onFilter?(IDs: _Sorted, byID: _ByID, search: _SearchState): _Sorted

    /** Column TH tag text */
    label?: React.ReactNode

    /** Any custom params you may extend column config with */
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
    _Entity extends Obj = Obj,
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

    /** Root tag [<div>] attributes  */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'>
    >

    /** Table footer you may apply pagination parameters to */
    withFooter?: {
        /** Default number of entities to show per paginationPage */
        defaultShowPerPage: number

        /**
         * Helps to render all entities quantity label
         *
         * @param quantity number of all entities in a table
         */
        displayQuantity?(quantity: number): React.ReactNode

        /** Show per page select params */
        select?: {
            /** Siegel Select component */
            component: CoreUIComponentWithDefaults<SelectComponent> | SelectComponent

            /** Siegel Select props where option value is show per page value */
            props: Pick<SelectProps<number>, 'options'> & Partial<SelectProps<number>>
        }

        /** Pagination params */
        pagination?: {
            /** Siegel Pagination component */
            component: CoreUIComponentWithDefaults<PaginationComponent> | PaginationComponent

            /** Siegel Pagination props */
            props?: Partial<PaginationProps>

            /** Render paginator component if there is only one page available */
            isRenderForSinglePage?: boolean
        }
    }

    /** Allows you to render infinite list of entities applying scrolling window */
    virtualization?: {
        /** Row height */
        itemHeight: number

        /** Table height */
        tableHeight?: number

        /** Defines number of rows to preload by the side of scrolling window */
        preloadedItemsBySide?: number

        /** After scrolling delay in ms after which rows will be updated */
        scrollUpdateInterval?: number
    }

    /**
     * Triggered when you scroll the data table. May prevent virtualization scroll event
     *
     * @param event scroll event
     */
    onScroll?(event: React.UIEvent<HTMLDivElement>): void

    /** Any children element you may put inside DataTable markup at the root level */
    children?: React.ReactNode

    /** Underlaying table tag [<table>] attributes  */
    tableAttributes?: TableProps['rootTagAttributes']

    /** Makes table columns to be resizable horizontally */
    resizable?: boolean

    /**
     * Post processes every column header to be rendered in DataTable
     * by mutating resulting headCell
     *
     * @param headCell table cell data
     * @param columnConfig column config
     * @param displayedEntityIDs final list entities IDs to be rendered on the active page
     */
    postProcessHeadCell?(
        headCell: TableTH,
        columnConfig: ColumnsConfig<_Entity, _ColumnParamsExtend>,
        displayedEntityIDs: NonNullable<DisplayedEntityIDs>
    ): void

    /**
     * Post processes every DataTable head row by mutating resulting rows array
     *
     * @param rows rows array
     * @param displayedEntityIDs final list entities IDs to be rendered on the active page
     */
    postProcessHeadRow?(rows: TableHeadRow[], displayedEntityIDs: NonNullable<DisplayedEntityIDs>): void

    /**
     * Post process evenry DataTable body row by mutating resulting rows array
     *
     * @param row  rows array
     * @param entity list entity
     * @param index entity index within all DataTable rows
     */
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