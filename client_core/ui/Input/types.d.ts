import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../_internals/types'


type ComponentRootAttributes = NonNullable<Props['inputAttributes']> & {
    error: '' | null
    filled: '' | null
}


type InputState = {
    isTouched: boolean
    isFocused: boolean
}
type InputStore = [ InputState, React.Dispatch<React.SetStateAction<InputState>> ]

type InputFieldThemeKeysArray = [
    'label', 'label_text', 'field', 'error_text',
    '_filled', '_error', '_disabled', '_focused', '_touched', '_readonly'
]
type ThemeKeys = 'textarea' | 'children' | InputFieldThemeKeysArray[number]


type InputElementAttributes = {
    onChange?(e: Parameters<NonNullable<Props['onChange']>>[1]): void
    value: Props['value']
} & Omit<ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>, 'onChange' | 'value'>

type Props<_Payload= any> = PropsComponentThemed<ThemeKeys, {
    value?: string
    innerStore?: InputStore
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    attributes?: ComponentAttributes<HTMLDivElement>
    inputAttributes?: InputElementAttributes
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
            inputFieldAttr: Omit<InputElementAttributes, 'value'> & { value: NonNullable<Props['value']> }
        ): void
        valuePlaceholderChar?: string
        shiftNextChar?: boolean
        copyMask?: boolean
    }
    onBlur?(e: React.FocusEvent<HTMLDivElement>): any
    onChange?(
        value: string, e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
        payload: _Payload
    ): any
    onFocus?(e: React.FocusEvent<HTMLDivElement>): void
}>


type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, ComponentRootAttributes, Component,
    InputFieldThemeKeysArray, InputElementAttributes
}