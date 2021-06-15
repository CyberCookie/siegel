import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = {
    onSwipe(dirrection: boolean, e: HTMLSwipeMouseEvent): void
    children?: React.ReactNode
    xAxis?: boolean
    deltaPos?: number
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    deltaPos: number
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, HTMLSwipeMouseEvent, Component }