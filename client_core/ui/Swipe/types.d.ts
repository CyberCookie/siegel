import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = PropsComponentBase<{
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    deltaPos: Props['deltaPos']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, HTMLSwipeMouseEvent, Component }