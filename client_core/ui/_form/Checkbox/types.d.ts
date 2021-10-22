import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type CheckboxInputProps = React.InputHTMLAttributes<HTMLInputElement>

type ThemeKeys = 'label' | 'checkbox' | 'with_icon_wrapper' | 'label_wrapper' | '_checked' | '_disabled'

//#TS_sucks. attributes type should depend on label <> icon presence
// type WithLabelProps = {
//     label: React.ReactNode
//     icon?: never
//     attributes?: ComponentAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
// }
// type WithIconProps = {
//     icon: React.ReactNode
//     label?: never
//     attributes?: ComponentAttributes<HTMLDivElement>
// }
// type NoIconLabelProps = {
//     attributes?: never
//     label?: never
//     icon?: never
// }
// type WithLabelAndIconProps = {
//     label: React.ReactNode
//     icon: React.ReactNode
//     attributes?: ComponentAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
// }

type Props<_Payload = unknown> = {
    value: boolean
    onChange?(checked: Props['value'], e: React.MouseEvent, payload: _Payload): void
    checkboxAttributes?: ComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes<HTMLDivElement> | ComponentAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
    label?: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    payload?: _Payload
} & PropsComponentThemed<ThemeKeys>
    // & ( WithLabelProps | WithIconProps | NoIconLabelProps /*| WithLabelAndIconProps*/ )

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    value: NonNullable<Props['value']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, CheckboxInputProps }