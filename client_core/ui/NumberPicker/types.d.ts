import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type OnNumberPickerChange = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick: boolean,
    step: number
) => void


type Theme = {
    _disabled_all?: string
    label?: string
    input_wrapper?: string
    controls?: string
    button_minus?: string
    button_plus?: string
    _focused?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    onChange(changeParams: {
        value: string
        numberValue: number
        isValidNumberString: boolean
        event: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>
            |   React.FocusEvent<HTMLDivElement>
        isKeyboardArrowUp?: boolean
        payload: _Payload
    }): void
    value?: string | number
    children?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
    label?: React.ReactNode
    step?: number
    min?: number
    max?: number
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: _Payload
    precision?: number
    zeroesPadLeft?: number
    disabledInput?: boolean
    inputClassName?: InputProps['className']
    inputTheme?: InputProps['theme']
    inputStore?: InputProps['store']
    inputMemoDeps?: InputProps['memoDeps']
    inputRootAttributes?: InputProps['rootTagAttributes']
    debounceMs?: InputProps['debounceMs']
    onBlur?: InputProps['onBlur']
}> & Omit<InputProps, 'value' | 'label' | 'theme' | 'type' | 'rootTagAttributes' | 'payload' | 'onBlur' | 'onChange' | 'store'>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Props['theme']
    minusIcon: Props['minusIcon']
    plusIcon: Props['plusIcon']
    min: Props['min']
    max: Props['max']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, OnNumberPickerChange }