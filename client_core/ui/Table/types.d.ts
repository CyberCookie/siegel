import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


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



type Props = {
    head?: TableHeadRow[]
    body?: TableBodyRow[]
    foot?: TableBodyRow[]
    caption?: React.ReactNode
    attributes?: ComponentAttributes<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Component, Props, DefaultProps, MergedProps, TableCell, TableRow, TableTH, TableTD, TableBodyRow, TableHeadRow }