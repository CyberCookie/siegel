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
    /** Root tag state if both props.disabled and props.diabledInput is true */
    _disabled_all?: string

    /** Root tag state if NumberPicker os focused */
    _focused?: string

    /** Root tag state if props.errorMsg is defined */
    _error?: string

    /** Wraps input_wrapper and label_text */
    label_wrapper?: string

    /** Label text element */
    label_text?: string

    /** Wraps Input and step controls elements */
    input_wrapper?: string

    /** Holds step buttons controls */
    controls?: string

    /** Decrease value button */
    button_minus?: string

    /** Increase value button */
    button_plus?: string

    /** If button is disabled */
    button__disabled?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /**
     * Triggered when NumberPicker value is changing
     *
     * @param changeParams Change params
     */
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

    /** NumberPicker value */
    value?: string | number

    /** Children element to be passed to an underlaying Input component */
    children?: React.ReactNode

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onFocus' | 'onKeyDown'>
    >

    /** NumberPicker regexp to be passed to underlaying Input component */
    regexp?: RegExp | ((defaultRegExp: string) => RegExp)

    /** Component label */
    label?: React.ReactNode

    /** Renders change value step buttons with defined value step */
    step?: number

    /** Minimum value */
    min?: number

    /** Maximum value */
    max?: number

    /** Step decrease value button icon */
    minusIcon?: React.ReactNode

    /** Step increase value button icon */
    plusIcon?: React.ReactNode

    /** Any value to be passed to props.onChange params */
    payload?: _Payload

    /** Value precission (number of digits after dot) */
    precision?: number

    /** Adds zeroes to the end of value if precission allows */
    precisionKeepZeroes?: boolean

    /** Adds zeroes before value */
    zeroesPadLeft?: number

    /** Disables NumbrPicker input */
    disabledInput?: boolean

    /** Triggered if NumberPicker loses its focus */
    onBlur?: ComponentFocusEventHandler

    /** Triggered if NumberPicker takes focus */
    onFocus?: ComponentFocusEventHandler

    /** Triggered if some key pressed when NumberPicker is focused */
    onKeyDown?(e: React.KeyboardEvent<HTMLDivElement>): void

    /** Underlaying Input class name */
    inputClassName?: InputProps['className']

    /** Underlaying Input theme */
    inputTheme?: InputProps['theme']

    /** Underlaying Input inner store */
    inputStore?: InputProps['store']

    /** Underlaying Input memoizing dependencies params */
    inputMemoDeps?: InputProps['memoDeps']

    /** Input component tag [<input>] attributes */
    inputRootAttributes?: InputProps['rootTagAttributes']

    /** Underlaying Input component change debounce */
    debounceMs?: InputProps['debounceMs']
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