import type {
    PropsComponentThemed, CoreUIComponent, NewComponentAttributes, ComponentAttributes
} from '../_internals/types'


type onChangeEventType = React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>

type InnerInputAttributes = {
    onChange?(e: onChangeEventType): void
} & ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>

type InputRef = React.MutableRefObject<HTMLInputElement>


type InputState = {
    isTouched: boolean
    isFocused: boolean
}
type InputStore = [ InputState, React.Dispatch<React.SetStateAction<InputState>> ]


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
    store?: InputStore
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
    inputAttributes?: NewComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    label?: React.ReactNode
    errorMsg?: React.ReactNode
    type?: 'input' | 'textarea' | 'password' | 'color' | 'date' | 'week' | 'month' | 'time' | 'datetime-local'
    payload?: _Payload
    regexp?: RegExp
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
    onBlur?(e: React.FocusEvent<HTMLDivElement>): void
    onChange?(value: string, e: onChangeEventType, payload: _Payload): void
    onFocus?(e: React.FocusEvent<HTMLDivElement>): void
}>


type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component, InnerInputAttributes, InputRef }