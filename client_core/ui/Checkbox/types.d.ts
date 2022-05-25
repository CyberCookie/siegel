import type { PropsComponentThemed, NewComponentAttributes, CoreIUComponent } from '../_internals/types'


// TODO typing?: attributes type should depend on label <> icon presence
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

type CheckboxRootAttrs = NewComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
type WithIconRootAttrs = NewComponentAttributes<HTMLDivElement>
type WithLabelRootAttrs = NewComponentAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>


type Theme = {
    _checked?: string
    _disabled?: string
    label?: string
    checkbox?: string
    with_icon_wrapper?: string
    label_wrapper?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    value: boolean
    onChange?(checked: Props['value'], e: React.MouseEvent, payload: _Payload): void
    checkboxAttributes?: NewComponentAttributes<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>
    rootTagAttributes?: WithIconRootAttrs | WithLabelRootAttrs
    label?: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    payload?: _Payload
}>
    // & ( WithLabelProps | WithIconProps | NoIconLabelProps /*| WithLabelAndIconProps*/ )

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    value: Props['value']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component,
    WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs
}