import { PropsComponentBase } from '../ui_utils'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = {
    children?: React.ReactNode,
    xAxis?: boolean,
    deltaPos?: number,
    onSwipe: (dirrection: boolean, e: HTMLSwipeMouseEvent) => void
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>,
    deltaPos: number
}

type State = {
    mouseDownPos: number | null,
    swipeStart: boolean,
    blocked: boolean
}


export { Props, DefaultProps, State, HTMLSwipeMouseEvent }