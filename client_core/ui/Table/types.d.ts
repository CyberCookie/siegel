import type {
    PropsComponentBase, ReactTagAttributes, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type TableRow = {
    attributes?: ReactTagAttributes<HTMLTableRowElement, React.TableHTMLAttributes<HTMLTableRowElement>>
}

type TableCell = {
    value: React.ReactNode
}


type TableTH = {
    attributes?: ReactTagAttributes<HTMLTableHeaderCellElement, React.ThHTMLAttributes<HTMLTableHeaderCellElement>>
} & TableCell
type TableHeadRow = {
    children: TableTH[]
} & TableRow

type TableTD = {
    attributes?: ReactTagAttributes<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>
} & TableCell
type TableBodyRow = {
    children: TableTD[]
} & TableRow



type Props = PropsComponentBase<{
    head?: TableHeadRow[]
    body?: TableBodyRow[]
    foot?: TableBodyRow[]
    caption?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>
}>

type DefaultProps = {}

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Component, Props,
    TableCell, TableRow, TableTH, TableTD, TableBodyRow, TableHeadRow
}