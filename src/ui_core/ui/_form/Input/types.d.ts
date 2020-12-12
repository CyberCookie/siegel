import type { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import type { InputTagProps } from '../input_field_attributes'


type ComponentRootAttributes = NonNullable<Props['inputAttributes']> & {
    error: '' | null
    filled: '' | null
}


type ThemeKeys = 'textarea' | 'extra' | 'error_text' | '_filled' | '_error' | keyof InputTagProps['theme']

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

type MergedProps = Props & DefaultProps

type _Input = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, ComponentRootAttributes, _Input }