import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type RootTagInnerProps = ReactTagAttributes<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>

type Props = PropsComponentBase<{
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void
    onTouchStart?(e: React.TouchEvent): void
    onMouseDown?(e: React.MouseEvent): void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onTouchStart'>
    >
}>

type DefaultProps = NonNullableKeys<{
    deltaPos: Props['deltaPos']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, Component,
    HTMLSwipeMouseEvent, RootTagInnerProps
}