import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Value = number | string


type ThemeKeys = 'number_picker__disabled' | 'controls' | 'button_minus' | 'button_plus' | 'label_wrapper'
    | 'label' | 'field'

type Props = {
    value: Value
    onChange: (
        value: Value,
        e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>,
        payload: any
    ) => void
    disabled?: boolean
    step?: number
    min?: number
    max?: number
    label?: React.ReactNode
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disableInput?: boolean
    placeholder?: string
    regexp?: string
    precision?: number
    attributes?: ComponentAttributes
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
}

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _NumberPicker }