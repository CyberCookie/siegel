import { PropsComponentThemed,ComponentAttributes, CoreIUComponent, extractProps } from '../ui_utils'


type Props = {
    onChange: (checked: boolean, e: React.MouseEvent, payload: any) => void
    attributes?: ComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
    disabled?: boolean
    value: boolean
    label?: React.ReactNode
    payload?: any
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    value: NonNullable<Props['value']>
}

type _Checkbox = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Checkbox }