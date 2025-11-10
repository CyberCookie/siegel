import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = PropsComponentBase<{
    /**
     * Triggered when swipe gesture occurs
     *
     * @param dirrection - Swipe dirrection. true if swipe to left / top
     * @param e - Mouse or touch event
     */
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void

    /**
     * Root tag touchstart event handler. May prevent inner default onTouchStart event
     *
     * @param event - Touch event
     */
    onTouchStart?(event: React.TouchEvent<HTMLDivElement>): void

    /**
     * Root tag mousedown event handler. May prevent inner default onMouseDown event
     *
     * @param event - Mouse event
     */
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void

    /** Inner content */
    children?: React.ReactNode

    /** Swipe dirrection. **true** means horizontal swipes */
    xAxis?: boolean

    /** Drag length to trigger swipe */
    deltaPos?: number

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onTouchStart'>
    >
}>

type DefaultProps = NonNullableProps<{
    deltaPos: Props['deltaPos']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component, HTMLSwipeMouseEvent }