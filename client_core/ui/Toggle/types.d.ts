import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Theme = {
    /** Root tag state if Toggle is toggled */
    _toggled?: string

    /** Root tag state if Toggle is disabled */
    _disabled?: string

    /** props.children element */
    children?: string

    /** Toggle labels element */
    label?: string

    /** Toggle area element which keeps toggler element */
    toggle_area?: string

    /** Toggler element */
    toggler?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** Children element to be rendered at the root level */
    children?: React.ReactNode

    /** Toggle value */
    value?: boolean

    /** Toggle label placed before toggler */
    labelLeft?: React.ReactNode

    /** Toggle label placed after toggler */
    labelRight?: React.ReactNode

    /** Toggler icon */
    toggleIcon?: React.ReactNode

    /** Payload to be passed to props.onChange callback */
    payload?: _Payload

    /** Disables Toggle */
    disabled?: boolean

    /**
     * Triggered when user change Toggle value
     *
     * @param value New toggle value
     * @param event Mouse event
     * @param payload props.payload
     */
    onChange?(
        value: boolean,
        event: React.MouseEvent<HTMLDivElement>,
        payload: _Payload
    ): void

    /**
     * Root tag mousedown event handler. May prevent inner default onMouseDown event
     *
     * @param event Mouse event
     */
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown'>
    >
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }