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
    placeholder?: string
    regexp?: string
    precision?: number
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
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
}

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _NumberPicker }