import type {
    PropsComponentThemed, CoreUIReactTagAttributes, ReactTagAttributes, CoreUIComponent
} from '../_internals/types'


// TODO typing?: attributes type should depend on label <> icon presence
// type WithLabelProps = {
//     label: React.ReactNode
//     icon?: never
//     attributes?: ReactTagAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
// }
// type WithIconProps = {
//     icon: React.ReactNode
//     label?: never
//     attributes?: ReactTagAttributes<HTMLDivElement>
// }
// type NoIconLabelProps = {
//     attributes?: never
//     label?: never
//     icon?: never
// }
// type WithLabelAndIconProps = {
//     label: React.ReactNode
//     icon: React.ReactNode
//     attributes?: ReactTagAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
// }


type AttributesExcluded<Element> = CoreUIReactTagAttributes<
    Element,
    Omit<React.HTMLAttributes<Element>, 'onMouseDown'>
>

type CheckboxRootAttrs = AttributesExcluded<HTMLInputElement>
type CheckboxInnerProps = ReactTagAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>

type WithIconRootAttrs = AttributesExcluded<HTMLDivElement>
type IconWrapperInnerProps = ReactTagAttributes<HTMLDivElement>

type WithLabelRootAttrs = AttributesExcluded<HTMLLabelElement>
type LabelInnerProps = ReactTagAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>


type HandlerEvent = React.MouseEvent<HTMLDivElement | HTMLLabelElement | HTMLInputElement>

type Theme = {
    /** Root tag state if checkbox is checked */
    _checked?: string

    /** Root tag state if checkbox is disabled */
    _disabled?: string

    /** Checkbox label */
    label?: string

    /** Checkbox input tag */
    checkbox?: string

    /** Applied to checkbox tag wrapper if icon is applied */
    with_icon_wrapper?: string

    /** Applied to label wrapper tag if label is applied */
    label_wrapper?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** Checkbox value */
    value?: boolean

    /**
     * Triggered on checkbox click
     *
     * @param checked New checkbox value
     * @param event Click Mouse event
     * @param payload props.payload
     */
    onChange?(
        checked: NonNullable<Props['value']>,
        event: HandlerEvent,
        payload: _Payload
    ): void

    /**
     * Triggered right before props.onChange handler is fired.
     * Can prevent props.onChange from beeing triggered
     *
     * @param event Click Mouse event
     */
    onMouseDown?(event: HandlerEvent)

    /** Tag [<input>] attributes */
    checkboxAttributes?: CheckboxRootAttrs

    /**
     * Root tag [<div> <label>] attributes.
     * The tag repends on icon / label presence
     */
    rootTagAttributes?: WithIconRootAttrs | WithLabelRootAttrs

    /** Checkbox label */
    label?: React.ReactNode

    /** Checkbox checked icon */
    icon?: React.ReactNode

    /** Disables checkbox */
    disabled?: boolean

    /** Any value to be present in props.onChange callback */
    payload?: _Payload
}>
    // & ( WithLabelProps | WithIconProps | NoIconLabelProps /*| WithLabelAndIconProps*/ )

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    value: Props['value']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component,
    WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs,
    CheckboxInnerProps, IconWrapperInnerProps, LabelInnerProps,
    HandlerEvent
}