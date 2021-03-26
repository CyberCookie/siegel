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
    value: string
    inputStore?: InputStore
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    attributes?: ComponentAttributes<HTMLDivElement>
    inputAttributes?: Omit<ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>, 'onChange' | 'value'> & {
        onChange?(e: Parameters<NonNullable<Props['onChange']>>[1]): void
        value: Props['value']
    }
    label?: React.ReactNode
    errorMsg?: React.ReactNode
    type?: 'input' | 'textarea' | 'password'
    payload?: any
    regexp?: RegExp
    mask?: {
        pattern: string
        patternValueChar: string
        processor(
            mask: Omit<NonNullable<Props['mask']>, 'processor'>,
            inputFieldAttr: NonNullable<Props['inputAttributes']>
        ): void
        valuePlaceholderChar?: string
        shiftNextChar?: boolean
        copyMask?: boolean
    }
    onBlur?(e: React.FocusEvent<HTMLDivElement>): any
    onChange?(value: string, e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, payload?: any): any
    onFocus?(e: React.FocusEvent<HTMLDivElement>): void
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Input = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, ComponentRootAttributes, _Input, InputFieldThemeKeys }