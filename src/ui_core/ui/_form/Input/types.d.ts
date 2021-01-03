import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'


type ComponentRootAttributes = NonNullable<Props['inputAttributes']> & {
    error: '' | null
    filled: '' | null
}


type InputFieldThemeKeys = | 'label' | 'label_text' | 'field' | 'error_text'
    | '_filled' | '_error' | '_disabled' | '_focused' | '_touched'

type ThemeKeys = 'textarea' | 'extra' | InputFieldThemeKeys

type InputState = {
    isTouched: boolean
    isFocused: boolean
}
type InputStore = [ InputState, React.Dispatch<React.SetStateAction<InputState>> ]


type Props = {
    value?: string
    inputStore?: InputStore
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    attributes?: ComponentAttributes
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    label?: React.ReactNode
    errorMsg?: React.ReactNode
    type?: 'input' | 'textarea' | 'password'
    payload?: any
    regexp?: RegExp
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => any
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>, payload?: any) => any
    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Input = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, ComponentRootAttributes, _Input, InputFieldThemeKeys }