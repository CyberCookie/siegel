import { PropsComponentThemed } from '../ui_utils'


type DefaultWrapperAttributes = {
    error: string | null
    filled: string | null
}

type ComponentInputAttributes = React.RefAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>

type Props = {
    wrapperAttr?: React.HTMLAttributes<HTMLDivElement>
    inputAttr?: React.HTMLAttributes<HTMLInputElement>
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
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    wrapperAttr: NonNullable<Props['wrapperAttr']>
}


export { Props, DefaultProps, DefaultWrapperAttributes, ComponentInputAttributes }