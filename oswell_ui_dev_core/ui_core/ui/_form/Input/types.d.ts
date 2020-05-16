import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'field' | 'textarea' | 'extra' | 'error_text' | 'label' | 'label_text'
    | '_focused' | '_filled' | '_touched' | '_error' | '_disabled'

type Props = {
    inputAttr?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes
    label?: React.ReactNode
    placeholder?: string
    value?: string
    errorMsg?: React.ReactNode
    type?: 'input' | 'textarea' | 'password'
    disabled?: boolean
    autofocus?: boolean
    payload?: any
    onBlur?: (e: React.FocusEvent) => any
    onChange?: (value: string, e: React.FormEvent, payload: any) => any
    onFocus?: (e: React.FocusEvent) => void
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _Input = CoreIUComponent<Props, DefaultProps>

type ComponentRootAttributes = NonNullable<Props['inputAttr']> & {
    error: '' | null,
    filled: '' | null
}

export { Props, DefaultProps, ComponentRootAttributes, _Input }