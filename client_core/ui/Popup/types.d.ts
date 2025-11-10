import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Theme = {
    /** Popup content wrapper */
    content?: string

    /** Popup close icon */
    close?: string
}

type Props = PropsComponentThemed<Theme, {
    /**
     * Triggered when user closes a popup
     *
     * @param event - Click event
     */
    onClose(event: React.MouseEvent<HTMLDivElement>): void

    /**
     * Root tag onmousewon event. May prevent props.onClose event
     *
     * @param event - Mousedown event
     */
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void

    /** Popup close icon */
    closeIcon?: React.ReactNode

    /** Popup content */
    content?: React.ReactNode

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown'>
    >
}>

type DefaultProps = NonNullableProps<{
    className: Props['className']
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }