import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent, CoreIUComponentWithDefaults } from '../ui_utils'
import type { Entities } from '../../utils/entities_struct'
import type { TableTH, TableTD, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import type { Props as SelectProps, _Select } from '../_form/Select/types'
import type { Props as PaginationProps, _Pagination } from '../Pagination/types'


type DataTableTableProps = {
    head: NonNullable<TableProps['head']>
    body: NonNullable<TableProps['body']>
    foot?: NonNullable<TableProps['foot']>
    className: NonNullable<TableProps['className']>
    attributes?: TableProps['attributes']
}

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
    searchByField: Indexable
    showPerPage: number
    currentPage: number
}


type ColumnsConfig<
    T extends Entities,
    K = any,
    Entity = ReturnType<T['get']>,
    ByID = ReturnType<T['raw']>['byID'],
    Sorted = ReturnType<T['raw']>['sorted']
> = {
    showValue(entity: Entity, index: number): TableTD
    onSort?(IDs: Sorted, byID: ByID, value: number): Sorted
    onFilter?(IDs: Sorted, byID: ByID, search: any): Sorted
    label?: React.ReactNode
    className?: string
    customParams?: K
}


type ThemeKeys = 'table' | 'table_resizer' | 'pagination_wrapper' | '_with_pagination'

type Props<T extends Entities = Entities, K = any> = {
    entities: T
    columnsConfig: ColumnsConfig<T, K>[]
    innerStore?: [ State, React.Dispatch<React.SetStateAction<State>> ]
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
    postProcessHeadCell?(headCell: TableTH, columnsConfig: ColumnsConfig<T, K>, index: number, displayedEntityIDs: DisplayedEntityIDs): void
    postProcessHeadRow?(rows: TableHeadRow[], displayedEntityIDs: DisplayedEntityIDs): void
    postProcessBodyRow?(row: TableBodyRow[], entity: ReturnType<T['get']>, index: number): void
} & PropsComponentThemed<ThemeKeys>


type DefaultProps = {
    theme: NonNullable<Required<Props<any>['theme']>>
}

type MergedProps = Props & DefaultProps

type _DataTable = CoreIUComponent<Props<any>, DefaultProps>


export type {
    State, Props, DefaultProps, MergedProps, _DataTable, DataTableTableProps, ColumnsConfig,
    DisplayedEntityIDs
}