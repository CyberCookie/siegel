import { PropsComponentThemed } from '../ui_utils'

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
    onChange: (value: Value, e) => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    step: NonNullable<Props['step']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
}


export { Props, DefaultProps }