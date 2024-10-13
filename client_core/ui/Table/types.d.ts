import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type TableRow = {
    /** TR tag attributes */
    attributes?: ReactTagAttributes<HTMLTableRowElement, React.TableHTMLAttributes<HTMLTableRowElement>>
}

type TableCell = {
    /** Table cell content */
    value: React.ReactNode
}


type TableTH = {
    /** TH tag attributes */
    attributes?: ReactTagAttributes<HTMLTableHeaderCellElement, React.ThHTMLAttributes<HTMLTableHeaderCellElement>>
} & TableCell
type TableHeadRow = {
    /** TH row data */
    children: TableTH[]
} & TableRow

type TableTD = {
    /** TD tag attributes */
    attributes?: ReactTagAttributes<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>
} & TableCell
type TableBodyRow = {
    /** TD row data */
    children: TableTD[]
} & TableRow



type Props = PropsComponentBase<{
    /** Table Header, represents each row in thead tag */
    head?: TableHeadRow[]

    /** Table Body, represents each row in tbody tag */
    body?: TableBodyRow[]

    /** Table Footer, represents each row in tfoot tag */
    foot?: TableBodyRow[]

    /** Table caption */
    caption?: React.ReactNode

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>
}>

type DefaultProps = object

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Component, Props, DefaultProps,
    TableCell, TableRow, TableTH, TableTD, TableBodyRow, TableHeadRow
}