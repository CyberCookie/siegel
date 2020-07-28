import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = '_toggled' | '_disabled' | 'label' | 'toggle_area' | 'toggler'

type Props = {
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    isToggled?: boolean
    payload?: any
    disabled?: boolean
    onChange?: (isToggles: boolean, e: React.MouseEvent, payload?: any) => void
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Toggle = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, MergedProps, _Toggle }