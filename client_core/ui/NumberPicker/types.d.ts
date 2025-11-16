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
    value_decrement_icon?: string

    /** Increase value button */
    value_increment_icon?: string

    /** If button is disabled */
    button__disabled?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /**
     * Triggered when NumberPicker number value is change
     *
     * @param changeParams - Change params
     */
    onChange(changeParams: {
        /** New number value */
        numberValue: number

        /** Change event */
        event: Parameters<OnNumberPickerChange>[0] | React.ChangeEvent<HTMLInputElement>
            |   React.FocusEvent<HTMLDivElement>

        /** Is step arrow up was pressed. Undefined if no arrows was pressed */
        isKeyboardArrowUp?: boolean

        /** NumberPicker props.payload */
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
    valueDecrementIcon?: React.ReactNode

    /** Step increase value button icon */
    valueIncrementIcon?: React.ReactNode

    /** Any value to be passed to props.onChange params */
    payload?: _Payload

    /** Value precission (number of digits after dot) */
    precision?: number

    /** Adds zeroes before value */
    zeroesPadLeft?: number

    /** Disables NumbrPicker input */
    disabledInput?: boolean

    /** Rewrites editable value if props.value is changed by outside events. Default is true */
    focusedValueOutsideUpdate?: boolean

    /** Triggered if NumberPicker string value is change */
    onStringChange?(
        changeParams: {
            /** New string value */
            value: string

            /** Is valid new string as number value */
            isValidStringNumber: boolean

            /** Change event */
            event: Parameters<NonNullable<InputProps['onChange']>>[1]

            /** NumberPicker props.payload */
            payload: _Payload
        }
    ): void

    /** Triggered if NumberPicker loses its focus */
    onBlur?: ComponentFocusEventHandler

    /** Triggered if NumberPicker takes focus */
    onFocus?: ComponentFocusEventHandler

    /** Triggered if some key pressed when NumberPicker is focused */
    onKeyDown?(e: React.KeyboardEvent<HTMLDivElement>): void

    /** Triggered when click on step buttons */
    onStepButtonClick?(e: React.MouseEvent<HTMLButtonElement>, isUp: boolean): void

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
    focusedValueOutsideUpdate: Props['focusedValueOutsideUpdate']
    inputTheme: Partial<NonNullable<InputProps['theme']>>
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, OnNumberPickerChange,
    ComponentFocusEventHandler
}