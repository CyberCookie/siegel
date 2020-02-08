import { PropsComponentThemed } from '../ui_utils'


type Props = {
    wrapperAttr?: React.Attributes
    listLength: number
    curPage: number
    showPerPage: number
    elementsBySide?: number
    elementsByMiddle?: number
    onChange: (nextPage: number, e: React.MouseEvent, payload: any) => void
    controlIcon?: React.ReactNode
    separator?: React.ReactNode
    payload?: any
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    elementsBySide: NonNullable<Props['elementsBySide']>
    elementsByMiddle: NonNullable<Props['elementsByMiddle']>
    separator: NonNullable<Props['separator']>
}


export { Props, DefaultProps }