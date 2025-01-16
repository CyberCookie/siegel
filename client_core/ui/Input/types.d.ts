import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'


type ComponentFocusEvent = React.FocusEvent<HTMLDivElement>

type onChangeEventType = React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>

type InnerInputAttributes = {
    onChange?(e: onChangeEventType): void
} & ReactTagAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>

type InputRef = React.RefObject<HTMLInputElement>

type DebounceStore = ReactStore<{
    debounceValue: string | undefined
    debounceTimeoutID: number | undefined
}>


type Theme = {
    /** Root tag state if input is not empty */
    _filled?: string

    /** Root tag state if props.errorMsg is defined */
    _error?: string

    /** Root tag state if Input props.disabled is true */
    _disabled?: string

    /** Root tag state if Input component is focused */
    _focused?: string

    /** Root tag state if Input once been focused */
    _touched?: string

    /** Root tag state if no props.onChange handler provided */
    _readonly?: string

    /** Root tag state if props.type is textarea */
    _textarea?: string

    /** Input component children */
    children?: string

    /** Input label wrapper */
    label?: string

    /** Input label text */
    label_text?: string

    /** Input tag */
    field?: string

    /** Error text */
    error_text?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** Component children element */
    children?: React.ReactNode

    /** Input value */
    value?: string

    /** Inner store */
    store?: ReactStore<{
        /** If input been focused at least once */
        isTouched: boolean

        /** If currently focused */
        isFocused: boolean
    }>

    /** Disables Input component */
    disabled?: boolean

    /** Autofocus Input component on first render */
    autofocus?: boolean

    /** Input tag placeholder */
    placeholder?: string

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onFocus'>
    >

    /** Root tag [<input>] attributes */
    inputAttributes?: CoreUIReactTagAttributes<
        HTMLInputElement,
        Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
    >

    /** Input label text */
    label?: React.ReactNode

    /** Error text */
    errorMsg?: React.ReactNode

    /** Input tag type */
    type?: 'text' | 'textarea' | 'password' | 'color' | 'date' | 'week' | 'month' | 'time' | 'datetime-local'

    /** Any data to be returned in props.onChange callback */
    payload?: _Payload

    /** Input value regexp */
    regexp?: RegExp

    /** Provides delay after which props.onChange is triggers */
    debounceMs?: number

    /** Input value to be applied before props.value */
    prefix?: string

    /** Input value to be applied after props.value */
    suffix?: string

    /** Applies input mask */
    mask?: {
        /** Provides string pattern to describe a mask */
        pattern: string

        /** Pattern char to be replaced with props.value chars */
        patternValueChar: string

        /** Mask processor you should import from Input component and apply separately */
        processor(
            mask: Omit<NonNullable<Props['mask']>, 'processor'>,
            inputFieldAttr: InnerInputAttributes & { value: NonNullable<Props['value']> }
        ): void

        /** Char to be placed instead empty props.value chars */
        valuePlaceholderChar?: string

        /** Whether to shift next chars during typing */
        shiftNextChar?: boolean

        /** Whether to copy the whole mask or only props.value when perform ctrl+c on input */
        copyMask?: boolean

        /** Enables lazy mask appliance - new mask characters appears during value update */
        formatterMode?: boolean
    }

    /**
     * Triggered when user updates input value
     *
     * @param value new input value
     * @param e Change event
     * @param payload props.payload
     */
    onChange?(value: string, e: onChangeEventType | ComponentFocusEvent, payload: _Payload): void

    /**
     * Triggered when Input component lost its focus
     *
     * @param e Focus event
     */
    onBlur?(e: ComponentFocusEvent): void

    /**
     * Triggered when Input component takes focus
     *
     * @param e Focus event
     */
    onFocus?(e: ComponentFocusEvent): void
}>


type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, Component, InputRef, DebounceStore, InnerInputAttributes
}