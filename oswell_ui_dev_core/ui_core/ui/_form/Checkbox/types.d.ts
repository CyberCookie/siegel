import { PropsComponentThemed,ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'label' | 'checkbox'

type Props = {
    value: boolean
    onChange: (checked: boolean, e: React.MouseEvent, payload: any) => void
    attributes?: ComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
    disabled?: boolean
    label?: React.ReactNode
    payload?: any
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    value: NonNullable<Props['value']>
}

type _Checkbox = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Checkbox }