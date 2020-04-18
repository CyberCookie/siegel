import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


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

type State = {
    mouseDownPos: number | null
    swipeStart: boolean
    blocked: boolean
}

type _Swipe = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, State, HTMLSwipeMouseEvent, _Swipe }