import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type ComponentFocusEventHandler = React.FocusEventHandler<HTMLDivElement | HTMLButtonElement>

type OnNumberPickerChange = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
    isButtonClick: boolean,
    step: number
) => void


type Theme = {
    _disabled_all?: string
    _focused?: string
    _error?: string
    label_wrapper?: string
    label_text?: string
    input_wrapper?: string
    controls?: string
    button_minus?: string
    button_plus?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    onChange(changeParams: {
        value: string
        numberValue: number
        isValidNumberString: boolean
        prevValidNumer: number | undefined
        event: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>
            |   React.FocusEvent<HTMLDivElement>
        isKeyboardArrowUp?: boolean
        payload: _Payload
    }): void
    value?: string | number
    children?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onFocus' | 'onKeyDown'>
    >
    regexp?: RegExp | ((defaultRegExp: string) => RegExp)
    label?: React.ReactNode
    step?: number
    min?: number
    max?: number
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: _Payload
    precision?: number
    precisionKeepZeroes?: boolean
    zeroesPadLeft?: number
    disabledInput?: boolean
    inputClassName?: InputProps['className']
    inputTheme?: InputProps['theme']
    inputStore?: InputProps['store']
    inputMemoDeps?: InputProps['memoDeps']
    inputRootAttributes?: InputProps['rootTagAttributes']
    debounceMs?: InputProps['debounceMs']
    onBlur?: ComponentFocusEventHandler
    onFocus?: ComponentFocusEventHandler
    onKeyDown?(e: React.KeyboardEvent<HTMLDivElement>): void
}> & Omit<InputProps, 'value' | 'label' | 'theme' | 'type' | 'rootTagAttributes' | 'payload' | 'onBlur' | 'onFocus' | 'onChange' | 'store' | 'regexp'>

type DefaultProps = NonNullableProps<{
    className: Props['className']
    theme: Props['theme']
    min: Props['min']
    max: Props['max']
    precisionKeepZeroes: Props['precisionKeepZeroes']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, OnNumberPickerChange,
    ComponentFocusEventHandler
}