import { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import { InputTagProps } from '../input_field_attributes'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>
type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
type InputFieldProps = ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
type OnNumberPickerChange = (
    value: number,
    e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick?: boolean
) => void


type ThemeKeys = '_disabled_all' | 'controls' | 'button_minus' | 'button_plus' | 'label_wrapper'
    | 'label' | 'field' | keyof InputTagProps['theme']

type Props = {
    onChange: (
        value: string,
        e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>,
        payload?: any
    ) => void
    step?: number
    min?: number
    max?: number
    label?: React.ReactNode
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disabledInput?: boolean
    regexp?: RegExp
    precision?: number
    keyboardArrows?: boolean
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
    keyboardArrows: NonNullable<Props['keyboardArrows']>
}

type MergedProps = Props & DefaultProps

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, MergedProps, _NumberPicker, BtnClickEv, BtnProps, InputFieldProps, OnNumberPickerChange }