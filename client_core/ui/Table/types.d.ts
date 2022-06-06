import type {
    PropsComponentBase, ComponentAttributes, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type TableRow = {
    attributes?: ComponentAttributes<HTMLTableRowElement, React.TableHTMLAttributes<HTMLTableRowElement>>
}

type TableCell = {
    value: React.ReactNode
}


type TableTH = {
    attributes?: ComponentAttributes<HTMLTableHeaderCellElement, React.ThHTMLAttributes<HTMLTableHeaderCellElement>>
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



type Props = PropsComponentBase<{
    head?: TableHeadRow[]
    body?: TableBodyRow[]
    foot?: TableBodyRow[]
    caption?: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>
}>

type DefaultProps = {}

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Component, Props,
    TableCell, TableRow, TableTH, TableTD, TableBodyRow, TableHeadRow
}