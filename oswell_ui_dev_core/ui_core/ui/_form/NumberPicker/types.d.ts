import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = '_disabled' | '_focused' | 'controls' | 'button_minus' | 'button_plus' | 'label_wrapper'
    | 'label' | 'field'

type Props = {
    value: number | string
    onChange: (
        value: string,
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
    regexp?: RegExp
    precision?: number
    attributes?: ComponentAttributes
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
}

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _NumberPicker }