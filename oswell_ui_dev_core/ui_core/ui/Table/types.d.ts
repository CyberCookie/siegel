import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type TableRow = {
    attributes?: ComponentAttributes<HTMLTableRowElement, React.TableHTMLAttributes<HTMLTableRowElement>>
}

type TableCell = {
    value: React.ReactNode
}

//TODO React.ThHTMLAttributes
type TableTH = {
    attributes?: ComponentAttributes<HTMLTableHeaderCellElement, React.TdHTMLAttributes<HTMLTableHeaderCellElement>>
} & TableCell
type TableHeadRow = {
    children: TableTH[]
} & TableRow

type TableTD = {
    attributes?: ComponentAttributes<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>
} & TableCell
type TableBodyRow = {
    children: TableTD[]
} & TableRow




type Props = {
    head?: TableHeadRow[]
    body?: TableBodyRow[]
    foot?: TableBodyRow[]
    attributes?: ComponentAttributes<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}

type _Table = CoreIUComponent<Props, DefaultProps>


export { _Table, Props, DefaultProps, TableCell, TableRow, TableTH, TableTD, TableBodyRow, TableHeadRow }