import type {
    PropsComponentBase, NewComponentAttributes, CoreIUComponent
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

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, HTMLSwipeMouseEvent, Component }