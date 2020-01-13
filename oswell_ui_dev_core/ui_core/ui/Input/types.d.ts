import { PropsComponentThemed } from '../ui_utils'


type DefaultWrapperAttributes = {
    error: string | null,
    filled: string | null
}

type ComponentInputAttributes = React.RefAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>

type Props = {
    wrapperAttr?: React.HTMLAttributes<HTMLDivElement>,
    inputAttr?: React.HTMLAttributes<HTMLInputElement>,
    label?: React.ReactNode,
    placeholder?: string,
    value?: string,
    errorMsg?: React.ReactNode,
    type?: string,
    disabled?: boolean,
    autofocus?: boolean,
    onBlur?: () => any,
    onChange?: (value: string, e: React.FormEvent) => any,
    onFocus?: () => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    wrapperAttr: NonNullable<Props['wrapperAttr']>
}


export { Props, DefaultProps, DefaultWrapperAttributes, ComponentInputAttributes }