import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type TableRow = {
    attributes?: ComponentAttributes<HTMLTableRowElement, React.TableHTMLAttributes<HTMLTableRowElement>>
}

type TableHeadRow = {
    children: TableTH[]
} & TableRow

type TableBodyRow = {
    children: TableTD[]
} & TableRow

type TableCell = {
    value: React.ReactNode
}

type TableTD = {
    attributes?: ComponentAttributes<HTMLTableCellElement, React.TableHTMLAttributes<HTMLTableCellElement>>
} & TableCell

type TableTH = {
    attributes?: ComponentAttributes<HTMLTableHeaderCellElement, React.TableHTMLAttributes<HTMLTableHeaderCellElement>>
} & TableCell



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