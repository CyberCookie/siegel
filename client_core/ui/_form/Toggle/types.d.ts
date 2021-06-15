import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'children' | 'label' | 'toggle_area' | 'toggler' | '_toggled' | '_disabled'

type Props = {
    value?: boolean
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    payload?: any
    disabled?: boolean
    onChange?(isToggled: boolean, e: React.MouseEvent, payload?: any): void
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }