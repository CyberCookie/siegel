import type {
    PropsComponentBase, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = PropsComponentBase<{
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    deltaPos: Props['deltaPos']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, HTMLSwipeMouseEvent, Component }