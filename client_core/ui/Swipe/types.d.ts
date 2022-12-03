import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = PropsComponentBase<{
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void
    onTouchStart?(event: React.TouchEvent<HTMLDivElement>): void
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
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