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

type StateSortValues = -1 | 1
type State<_SearchState = any> = {
    sortByField: {
        ID: string | undefined
        value: StateSortValues
    }
    searchByField: Indexable<_SearchState>
    toggledColumns: Set<string>
    showPerPage: number
    currentPage: number
}


type ColumnsConfig<
    _Entity extends Indexable,
    _ColumnParamsExtend = any,
    _ByID = Indexable<_Entity>,
    _Sorted = string[]
> = {
    ID: string
    showValue(entity: _Entity): TableTD
    onSort?(IDs: _Sorted, byID: _ByID, value: number): Sorted
    onFilter?(IDs: _Sorted, byID: _ByID, search: any): Sorted
    label?: React.ReactNode
    customParams?: _ColumnParamsExtend
}


type Theme = {
    _with_footer?: string
    table?: string
    children?: string
    table_resizer?: string
    pagination_wrapper?: string
    pagination_single_page?: string
}

type Props<
    _Entity = Indexable,
    _ColumnParamsExtend = any,
    _SearchState = any
> = PropsComponentThemed<Theme, {
    entities: {
        byID: Indexable<_Entity>
        sorted: string[]
    }
    columnsConfig: ColumnsConfig<_Entity, _ColumnParamsExtend>[]
    pinnedEntities?: {
        byID: Indexable<_Entity>
        sorted: string[]
    }
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


type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    State, Props, DefaultProps, MergedProps, Component, DataTableTableProps,
    ColumnsConfig, DisplayedEntityIDs, StateSortValues
}