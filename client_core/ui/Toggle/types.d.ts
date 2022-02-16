import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ThemeKeys = 'children' | 'label' | 'toggle_area' | 'toggler' | '_toggled' | '_disabled'

type Props<_Payload = any> = PropsComponentThemed<ThemeKeys, {
    value?: boolean
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    payload?: _Payload
    disabled?: boolean
    onChange?(isToggled: boolean, e: React.MouseEvent, payload: _Payload): void
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }