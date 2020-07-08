import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'label' | 'title' | 'input_wrapper' | '_active' | '_disabled' | 'options'
    | 'option' | '_option_active' | '_option_disabled'

type Props<V = any> = {
    displayValue: React.ReactNode
    options: {
        disabled?: boolean
        payload?: any
        value: V
        title: React.ReactNode
    }[],
    onChange: (value: V, e: React.MouseEvent, payload?: any) => void
    dropdownIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    placeholder?: React.ReactNode
    selected?: V
    disabled?: boolean
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    closeOnSelect: NonNullable<Props['closeOnSelect']>
    dropdownIcon: NonNullable<Props['dropdownIcon']>
}

type _Select = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Select }