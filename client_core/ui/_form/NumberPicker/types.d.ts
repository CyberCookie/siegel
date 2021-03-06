import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import type { Props as InputProps, InputFieldThemeKeysArray } from '../Input/types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>
type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
type OnNumberPickerChange = (
    e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick?: boolean,
    step?: number
) => void


type ThemeKeys = 'children' | 'controls' | 'button_minus' | 'button_plus' | '_disabled_all'
    | 'input_root' | InputFieldThemeKeysArray[number]

type Props = {
    onChange(
        value: string,
        e: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>,
        arrowValue?: boolean,
        payload?: any
    ): void
    attributes?: ComponentAttributes<HTMLDivElement>
    step?: number
    min?: number
    max?: number
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disabledInput?: boolean
    precision?: number
    keyboardControls?: boolean
    inputStore?: InputProps['innerStore']
} & PropsComponentThemed<ThemeKeys> & Omit<InputProps, 'theme' | 'type' | 'attributes' | 'payload' | 'onBlur' | 'onFocus' | 'onChange' | 'innerStore'>

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

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, BtnClickEv, BtnProps, OnNumberPickerChange }