import { PropsComponentBase } from '../ui_utils'


type TableCell = {
    value: React.ReactNode,
    attributes: React.Attributes
}

type TableRow = {
    children: TableCell[],
    attributes: React.Attributes
}

type Props = {
    attributes?: React.Attributes,
    body?: TableRow[],
    head?: TableRow[],
    foot?: TableRow[]
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}


export { Props, DefaultProps, TableCell, TableRow }