import { PropsComponentThemed } from '../ui_utils'


type Props = {
    wrapperAttr?: React.Attributes,
    listLength: number,
    curPage: number,
    showPerPage: number,
    elementsBySide?: number,
    elementsByMiddle?: number,
    onPageClick: (nextPage: number) => void,
    controlIcon?: React.ReactNode,
    separator?: React.ReactNode
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    elementsBySide: NonNullable<Props['elementsBySide']>,
    elementsByMiddle: NonNullable<Props['elementsByMiddle']>,
    separator: NonNullable<Props['separator']>
}


export { Props, DefaultProps }