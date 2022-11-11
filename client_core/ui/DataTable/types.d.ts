import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent, CoreUIComponentWithDefaults
} from '../_internals/types'
import type { TableTH, TableTD, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import type { Props as SelectProps, Component as SelectComponent } from '../Select/types'
import type { Props as PaginationProps, Component as PaginationComponent } from '../Pagination/types'


type DataTableTableProps = {
    head: NonNullable<TableProps['head']>
    body: NonNullable<TableProps['body']>
    foot?: NonNullable<TableProps['foot']>
    className: NonNullable<TableProps['className']>
    rootTagAttributes?: TableProps['rootTagAttributes']
}

type DisplayedEntityIDs = {
    from: number
    to: number
    allPagesIDs: string[]
} | undefined

type SortState = {
    ID: string
    value: number
}
type State = {
    sortByField: SortState | {}
    searchByField: Indexable
    toggledColumns: Set<SortState['ID']>
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
    showValue(entity: _Entity, index: number): TableTD
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
}

type Props<_Entity = Indexable, _ColumnParamsExtend = any> = PropsComponentThemed<Theme, {
    entities: {
        byID: Indexable<_Entity>
        sorted: string[]
    }
    columnsConfig: ColumnsConfig<_Entity, _ColumnParamsExtend>[]
    store?: ReactStore<State>
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'>
    >
    withFooter?: {
        displayQuantity?(quantity: number): React.ReactNode
        select?: {
            props: Pick<SelectProps<number>, 'options'> & Partial<SelectProps<number>>
            component: CoreUIComponentWithDefaults<SelectComponent> | SelectComponent
        }
        pagination?: {
            props?: Partial<PaginationProps>
            component: CoreUIComponentWithDefaults<PaginationComponent> | PaginationComponent
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
        index: number,
        displayedEntityIDs: DisplayedEntityIDs
    ): void
    postProcessHeadRow?(rows: TableHeadRow[], displayedEntityIDs: DisplayedEntityIDs): void
    postProcessBodyRow?(row: TableBodyRow[], entity: _Entity, index: number): void
}>


type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    State, Props, DefaultProps, MergedProps, Component, DataTableTableProps,
    ColumnsConfig, DisplayedEntityIDs, SortState
}