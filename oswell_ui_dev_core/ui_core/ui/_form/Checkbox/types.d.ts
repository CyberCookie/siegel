import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type WrapperProps = {
    className?: string
    onMouseDown?: (e: React.MouseEvent) => void
}

type ThemeKeys = 'label' | 'checkbox' | '_checked' | '_disabled' | 'with_icon_wrapper'


//TODO: attributes type depends on label <> icon
type Props = {
    value: boolean
    onChange?: (checked: Props['value'], e: React.MouseEvent, payload?: any) => void
    checkboxAttributes?: ComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes
    disabled?: boolean
    label?: React.ReactNode
    payload?: any
    icon?: React.ReactNode
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    value: NonNullable<Props['value']>
}

type MergedProps = Props & DefaultProps

type _Checkbox = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, MergedProps, _Checkbox, WrapperProps }