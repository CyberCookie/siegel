import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent, CoreIUComponentWithDefaults } from '../ui_utils'
import type { Entities } from '../../utils/entities_struct'
import type { TableTH, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import type { Props as SelectProps, _Select } from '../_form/Select/types'
import type { Props as PaginationProps, _Pagination } from '../Pagination/types'


type DataTableTableProps = {
    head: NonNullable<TableProps['head']>
    body: NonNullable<TableProps['body']>
    foot?: NonNullable<TableProps['foot']>
    className: NonNullable<TableProps['className']>
    attributes?: TableProps['attributes']
}

type SearchByFieldText = string
type SearchByFieldDate = { dateStart: number, dateEnd: number }
type SearchByFieldSet = Set<ID>
type SearchByFieldValue = SearchByFieldText | SearchByFieldDate | SearchByFieldSet

type DisplayedEntityIDs<T extends Entities = Entities> = {
    from: number
    to: number
    allPagesIDs: ReturnType<T['raw']>['sorted']
} | undefined

type State = {
    sortByField: {
        index: number
        value: number,
    }
    searchByField: Indexable<SearchByFieldValue>
    showPerPage: number
    currentPage: number
}


type ColumnsConfigEntityField = {
    entityFieldPath: string | string[]
}
type ColumnsConfigWithDefaults<
    T extends Entities,
    Entity = ReturnType<T['get']>,
    ByID = ReturnType<T['raw']>['byID'],
    Sorted = ReturnType<T['raw']>['sorted']
> = {
    showValue(entity: Entity, index: number): React.ReactNode
    onSort(IDs: Sorted, byID: ByID, value: number): Sorted
    onFilter(IDs: Sorted, byID: ByID, search: SearchByFieldValue): Sorted
}
type ColumnsConfig<T extends Entities> = {
    label: React.ReactNode
    type: 'text' | 'set' | 'date'
    putSetValue?(value: any): any
} & (
    (Partial<ColumnsConfigEntityField> & ColumnsConfigWithDefaults<T>)
    |   (ColumnsConfigEntityField & Partial<ColumnsConfigWithDefaults<T>>)
)


type ThemeKeys = 'table' | 'table_resizer' | 'pagination_wrapper' | '_with_pagination'

type Props<T extends Entities> = {
    entities: T
    columnsConfig: ColumnsConfig<T>[]
    hookStore?: [ State, React.Dispatch<React.SetStateAction<State>> ]
    attributes?: ComponentAttributes<HTMLDivElement>
    withPagination?: {
        displayQuantity?(quantity: number): React.ReactNode
        select: {
            props: Pick<SelectProps<number>, 'options'> & Partial<SelectProps>
            component: CoreIUComponentWithDefaults<_Select> | _Select
        }
        pagination: {
            props?: Partial<PaginationProps>
            component: CoreIUComponentWithDefaults<_Pagination> | _Pagination
        }
    }
    tableAttributes?: TableProps['attributes']
    resizable?: boolean
    postProcessHeadCell?(cell: TableTH, columnsConfig: ColumnsConfig<T>, index: number, displayedEntityIDs: DisplayedEntityIDs): TableTH
    postProcessHeadRow?(rows: TableHeadRow[], displayedEntityIDs: DisplayedEntityIDs): TableHeadRow[]
    postProcessBodyRow?(row: TableBodyRow, entity: ReturnType<T['get']>, index: number): TableBodyRow | TableBodyRow[]
} & PropsComponentThemed<ThemeKeys>


type DefaultProps = {
    theme: NonNullable<Required<Props<any>['theme']>>
}

type MergedProps = Props<any> & DefaultProps

type _DataTable = CoreIUComponent<Props<any>, DefaultProps>


export type { Props, State, DefaultProps, MergedProps, _DataTable, DataTableTableProps, ColumnsConfig,
    SearchByFieldText, SearchByFieldDate, SearchByFieldSet, DisplayedEntityIDs }