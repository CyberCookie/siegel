import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type Theme = {
    _toggled?: string
    _disabled?: string
    children?: string
    label?: string
    toggle_area?: string
    toggler?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    children?: React.ReactNode
    value?: boolean
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    payload?: _Payload
    disabled?: boolean
    onChange?(value: boolean, e: React.MouseEvent, payload: _Payload): void
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }