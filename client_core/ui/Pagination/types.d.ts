import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type Theme = {
    _single?: string
    separator?: string
    page?: string
    page__active?: string
    icon_prev?: string
    icon_next?: string
    icon__disabled?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    listLength: number
    curPage: number
    showPerPage: number
    onChange(nextPage: number, e: React.MouseEvent, payload: _Payload): void
    elementsBySide?: number
    elementsByMiddle?: number
    iconPrev?: React.ReactNode
    iconNext?: React.ReactNode
    separator?: React.ReactNode
    payload?: _Payload
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
    fixedWidth?: boolean
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    elementsBySide: Props['elementsBySide']
    elementsByMiddle: Props['elementsByMiddle']
    iconPrev: Props['iconPrev']
    iconNext: Props['iconNext']
    separator: Props['separator']
    fixedWidth: Props['fixedWidth']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }