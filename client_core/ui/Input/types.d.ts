import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes, ReactTagAttributes
} from '../_internals/types'


type ComponentFocusEvent = React.FocusEvent<HTMLDivElement>

type onChangeEventType = React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>

type InnerInputAttributes = {
    onChange?(e: onChangeEventType): void
} & ReactTagAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>

type InputRef = React.MutableRefObject<HTMLInputElement>

type DebounceStore = ReactStore<{
    debounceValue: string | undefined
    debounceTimeoutID: number | undefined
}>


type Theme = {
    _filled?: string
    _error?: string
    _disabled?: string
    _focused?: string
    _touched?: string
    _readonly?: string
    textarea?: string
    children?: string
    label?: string
    label_text?: string
    field?: string
    error_text?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    children?: React.ReactNode
    value?: string
    store?: ReactStore<{
        isTouched: boolean
        isFocused: boolean
    }>
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onFocus'>
    >
    inputAttributes?: CoreUIReactTagAttributes<
        HTMLInputElement,
        Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
    >
    label?: React.ReactNode
    errorMsg?: React.ReactNode
    type?: 'text' | 'textarea' | 'password' | 'color' | 'date' | 'week' | 'month' | 'time' | 'datetime-local'
    payload?: _Payload
    regexp?: RegExp
    debounceMs?: number
    prefix?: string
    suffix?: string
    mask?: {
        pattern: string
        patternValueChar: string
        processor(
            mask: Omit<NonNullable<Props['mask']>, 'processor'>,
            inputFieldAttr: InnerInputAttributes & { value: NonNullable<Props['value']> }
        ): void
        valuePlaceholderChar?: string
        shiftNextChar?: boolean
        copyMask?: boolean
    }
    onBlur?(e: ComponentFocusEvent): void
    onChange?(value: string, e: onChangeEventType | ComponentFocusEvent, payload: _Payload): void
    onFocus?(e: ComponentFocusEvent): void
}>


type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, Component, InputRef, DebounceStore,
    InnerInputAttributes
}