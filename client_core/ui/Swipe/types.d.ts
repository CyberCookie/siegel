import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = {
    onSwipe: (dirrection: boolean, e: HTMLSwipeMouseEvent) => void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
    attributes?: ComponentAttributes
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    deltaPos: number
}

type _Swipe = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, HTMLSwipeMouseEvent, _Swipe }