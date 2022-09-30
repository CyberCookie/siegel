import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type OnNumberPickerChange = (
    e: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick?: boolean,
    step?: number
) => void


type Theme = {
    _disabled_all?: string
    children?: string
    controls?: string
    button_minus?: string
    button_plus?: string
    input_root?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    onChange(changeParams: {
        value: string
        event: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>
        isKeyboardArrowUp: boolean | undefined
        payload: _Payload
    }): void
    children?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
    step?: number
    min?: number
    max?: number
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: _Payload
    precision?: number
    disabledInput?: boolean
    inputTheme?: InputProps['theme']
    inputStore?: InputProps['store']
    inputMemoDeps?: InputProps['memoDeps']
    inputRootAttributes?: InputProps['rootTagAttributes']
    debounceMs?: InputProps['debounceMs']
    onBlur?: InputProps['onBlur']
}> & Omit<InputProps, 'theme' | 'type' | 'rootTagAttributes' | 'payload' | 'onBlur' | 'onChange' | 'store'>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    minusIcon: Props['minusIcon']
    plusIcon: Props['plusIcon']
    min: Props['min']
    max: Props['max']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, MergedProps, Component, OnNumberPickerChange }