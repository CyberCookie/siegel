import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'
import { EntitiesRaw } from '../../utils/entities_struct'
import { TableTH, TableBodyRow, TableHeadRow, Props as TableProps } from '../Table/types'
import { Props as SelectProps } from '../_form/Select/types'
import { Props as PaginationProps } from '../Pagination/types'


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

type ColumnsConfigBase = {
    label: React.ReactNode
    type: 'text' | 'set' | 'date'
    putSetValue?: (value: any) => any
}

type ColumnsConfigEntityField = {
    entityFieldPath: string | string[]
}

type ColumnsConfigWithDefaults = {
    showValue: (entity: object, index: number) => React.ReactNode
    onSort: (IDs: ID[], byID: Indexable<object>, value: SortReturnValue) => ID[]
    onFilter: (IDs: ID[], byID: Indexable<object>, search: SearchByFieldValue) => ID[]
}

type ColumnsConfig = ColumnsConfigBase & (
    (Partial<ColumnsConfigEntityField> & ColumnsConfigWithDefaults)
    |   (ColumnsConfigEntityField & Partial<ColumnsConfigWithDefaults>)
)


type Props = {
    entities: EntitiesRaw
    columnsConfig: ColumnsConfig[]
    hookState: [ State, React.Dispatch<React.SetStateAction<State>> ]
    attributes?: ComponentAttributes
    pagination?: {
        displayQuantity?: (quantity: number) => React.ReactNode
        selectProps: SelectProps<number>
        paginationProps?: PaginationProps
    }
    tableAttributes?: TableProps['attributes']
    resizable?: boolean
    postProcessHeadCell?: (cell: TableTH, columnsConfig: ColumnsConfig, index: number) => TableTH
    postProcessHeadRow?: (rows: TableHeadRow[], IDs: ID[]) => TableHeadRow[]
    postProcessBodyRow?: (row: TableBodyRow, entity: {}, index: number) => TableBodyRow
} & PropsComponentThemed


type DefaultProps = {
    theme: NonNullable<Props['theme']>
}

type _DataTable = CoreIUComponent<Props, DefaultProps>


export { Props, State, DefaultProps, _DataTable, DataTableTableProps, ColumnsConfig }