import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Value = number | string

type Props = {
    value: Value
    disabled?: boolean
    step?: number
    min?: number
    max?: number
    label?: React.ReactNode
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disableInput?: boolean
    onChange: (
        value: Value,
        e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>,
        payload: any
    ) => void
    attributes?: ComponentAttributes
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    step: NonNullable<Props['step']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
}

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _NumberPicker }