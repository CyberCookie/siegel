import { PropsComponentThemed } from '../ui_utils'


type Props = {
    onChange: (checked: boolean, e: React.MouseEvent) => void
    checkboxAttr?: React.HTMLAttributes<HTMLInputElement>
    disabled?: boolean
    value: boolean
    label: React.ReactNode
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    value: NonNullable<Props['value']>
}


export { Props, DefaultProps }