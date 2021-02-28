import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'separator' | '_single' | 'control' | 'control__active' | 'control__disabled'

type Props = {
    listLength: number
    curPage: number
    showPerPage: number
    onChange(nextPage: number, e: React.MouseEvent, payload?: any): void
    elementsBySide?: number
    elementsByMiddle?: number
    controlIcon?: React.ReactNode
    separator?: React.ReactNode
    payload?: any
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    elementsBySide: NonNullable<Props['elementsBySide']>
    elementsByMiddle: NonNullable<Props['elementsByMiddle']>
    separator: NonNullable<Props['separator']>
}

type MergedProps = Props & DefaultProps

type _Pagination = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Pagination }