import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    listLength: number
    curPage: number
    showPerPage: number
    elementsBySide?: number
    elementsByMiddle?: number
    onChange: (nextPage: number, e: React.MouseEvent, payload: any) => void
    controlIcon?: React.ReactNode
    separator?: React.ReactNode
    payload?: any
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    elementsBySide: NonNullable<Props['elementsBySide']>
    elementsByMiddle: NonNullable<Props['elementsByMiddle']>
    separator: NonNullable<Props['separator']>
}

type _Pagination = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Pagination }