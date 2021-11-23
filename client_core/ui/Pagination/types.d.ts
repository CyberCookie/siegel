import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ThemeKeys = 'separator' | '_single' | 'control' | 'control__active' | 'control__disabled'

type Props<_Payload = any> = {
    listLength: number
    curPage: number
    showPerPage: number
    onChange(nextPage: number, e: React.MouseEvent, payload: _Payload): void
    elementsBySide?: number
    elementsByMiddle?: number
    controlIcon?: React.ReactNode
    separator?: React.ReactNode
    payload?: _Payload
    attributes?: ComponentAttributes<HTMLDivElement>
    fixedWidth?: boolean
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    elementsBySide: NonNullable<Props['elementsBySide']>
    elementsByMiddle: NonNullable<Props['elementsByMiddle']>
    separator: NonNullable<Props['separator']>
    fixedWidth: NonNullable<Props['fixedWidth']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }