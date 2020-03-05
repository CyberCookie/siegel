import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    inputAttr?: ComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
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
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}

type _Input = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, ComponentInputAttributes, _Input }