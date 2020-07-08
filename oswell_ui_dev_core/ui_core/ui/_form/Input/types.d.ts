import { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import { InputTagProps } from '../autofocus'


type ThemeKeys = 'field' | 'textarea' | 'extra' | 'error_text' | 'label' | 'label_text'
    | '_filled' | '_error' | keyof InputTagProps['theme']

type Props = {
    label?: React.ReactNode
    errorMsg?: React.ReactNode
    type?: 'input' | 'textarea' | 'password'
    payload?: any
    onBlur?: (e: React.FocusEvent) => any
    onChange?: (value: string, e: React.FormEvent, payload?: any) => any
    onFocus?: (e: React.FocusEvent) => void
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>


type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _Input = CoreIUComponent<Props, DefaultProps>

type ComponentRootAttributes = NonNullable<Props['inputAttributes']> & {
    error: '' | null,
    filled: '' | null
}

export { Props, DefaultProps, ComponentRootAttributes, _Input }