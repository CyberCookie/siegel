import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import type { Props as InputProps, InputFieldThemeKeys } from '../Input/types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>
type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
type OnNumberPickerChange = (
    e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick?: boolean,
    step?: number
) => void


type ThemeKeys = '_disabled_all' | 'controls' | 'button_minus' | 'button_plus' | InputFieldThemeKeys

type Props = {
    onChange(
        value: string,
        e: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>,
        arrowValue?: boolean,
        payload?: any
    ): void
    step?: number
    min?: number
    max?: number
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disabledInput?: boolean
    precision?: number
    keyboardControls?: boolean
} & PropsComponentThemed<ThemeKeys> & Omit<InputProps, 'theme' | 'type' | 'attributes' | 'payload' | 'onBlur' | 'onFocus' | 'onChange'>

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


export type { Props, DefaultProps, MergedProps, _NumberPicker, BtnClickEv, BtnProps, OnNumberPickerChange }