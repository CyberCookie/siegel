import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import type { InputTagProps } from '../input_field_attributes'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>
type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
type InputFieldProps = ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
type OnNumberPickerChange = (
    e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick?: boolean,
    step?: number
) => void


type ThemeKeys = '_disabled_all' | 'controls' | 'button_minus' | 'button_plus' | keyof InputTagProps['theme']

type Props = {
    onChange: (
        value: string,
        e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>,
        arrowValue?: boolean,
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
    keyboardControls?: boolean
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>

type DefaultProps = {
    className: NonNullable<Required<Props['className']>>,
    theme: NonNullable<Required<Props['theme']>>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
    keyboardControls: NonNullable<Props['keyboardControls']>
}

type MergedProps = Props & DefaultProps

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _NumberPicker, BtnClickEv, BtnProps, InputFieldProps, OnNumberPickerChange }