import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'toggle_checked' | 'label' | 'toggle_area' | 'toggler'

type Props = {
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    isToggled?: boolean
    onChange?: (e: React.MouseEvent) => void
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _Toggle = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Toggle }