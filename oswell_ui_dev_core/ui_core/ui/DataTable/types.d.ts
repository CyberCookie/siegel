import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'
import { EntitiesRaw } from '../../utils/entities_struct'
import { TableTH, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import { Props as SelectProps, _Select } from '../_form/Select/types'
import { Props as PaginationProps, _Pagination } from '../Pagination/types'


type DataTableTableProps = {
    head: NonNullable<TableProps['head']>
    body: NonNullable<TableProps['body']>
    className: NonNullable<TableProps['className']>
    attributes?: TableProps['attributes']
}

type SearchByFieldValue = number & { dateStart: number, dateEnd: number } & Set<string>

type State = {
    headData: {
        sortByField: {
            index: number
            value: SortReturnValue,
        }
        searchByField: Indexable<SearchByFieldValue>
    }
    bodyData: {
        showPerPage: number
        currentPage: number
    }
}


type ColumnsConfigEntityField = {
    entityFieldPath: string | string[]
}
type ColumnsConfigWithDefaults = {
    showValue: (entity: object, index: number) => React.ReactNode
    onSort: (IDs: ID[], byID: Indexable<object>, value: SortReturnValue) => ID[]
    onFilter: (IDs: ID[], byID: Indexable<object>, search: SearchByFieldValue) => ID[]
}
type ColumnsConfig = {
    label: React.ReactNode
    type: 'text' | 'set' | 'date'
    putSetValue?: (value: any) => any
} & (
    (Partial<ColumnsConfigEntityField> & ColumnsConfigWithDefaults)
    |   (ColumnsConfigEntityField & Partial<ColumnsConfigWithDefaults>)
)


type ThemeKeys = 'table' | 'table_resizer' | 'pagination_wrapper'

type Props = {
    entities: EntitiesRaw
    columnsConfig: ColumnsConfig[]
    hookState: [ State, React.Dispatch<React.SetStateAction<State>> ]
    attributes?: ComponentAttributes
    withPagination?: {
        displayQuantity?: (quantity: number) => React.ReactNode
        select: {
            props: SelectProps<number>
            component: _Select
        }
        pagination: {
            props?: PaginationProps
            component: _Pagination
        }
    }
    tableAttributes?: TableProps['attributes']
    resizable?: boolean
    postProcessHeadCell?: (cell: TableTH, columnsConfig: ColumnsConfig, index: number) => TableTH
    postProcessHeadRow?: (rows: TableHeadRow[], IDs: ID[]) => TableHeadRow[]
    postProcessBodyRow?: (row: TableBodyRow, entity: {}, index: number) => TableBodyRow
} & PropsComponentThemed<ThemeKeys>


type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _DataTable = CoreIUComponent<Props, DefaultProps>


export { Props, State, DefaultProps, _DataTable, DataTableTableProps, ColumnsConfig }