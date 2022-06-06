import type { Entities } from '../../utils/entities_struct'
import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent, CoreUIComponentWithDefaults
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

type DisplayedEntityIDs<_Entities extends Entities = Entities> = {
    from: number
    to: number
    allPagesIDs: ReturnType<_Entities['raw']>['sorted']
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
    _Entities extends Entities,
    _ColumnParamsExtend = any,
    Entity = ReturnType<_Entities['get']>,
    ByID = ReturnType<_Entities['raw']>['byID'],
    Sorted = ReturnType<_Entities['raw']>['sorted']
> = {
    ID: string
    showValue(entity: Entity, index: number): TableTD
    onSort?(IDs: Sorted, byID: ByID, value: number): Sorted
    onFilter?(IDs: Sorted, byID: ByID, search: any): Sorted
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

type Props<
    _Entities extends Entities<Indexable> = Entities<Indexable>,
    _ColumnParamsExtend = any
> = PropsComponentThemed<Theme, {
    entities: _Entities
    columnsConfig: ColumnsConfig<_Entities, _ColumnParamsExtend>[]
    store?: [ State, React.Dispatch<React.SetStateAction<State>> ]
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
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
    postProcessBodyRow?(row: TableBodyRow[], entity: ReturnType<_Entities['get']>, index: number): void
}>


type DefaultProps = NonNullableKeys<{
    theme: Required<Props<any>['theme']>
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    State, Props, MergedProps, Component, DataTableTableProps, ColumnsConfig,
    DisplayedEntityIDs, SortState
}