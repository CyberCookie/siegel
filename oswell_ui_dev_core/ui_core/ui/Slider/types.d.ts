import { HTMLSwipeMouseEvent } from '../Swipe'
import { PropsComponentThemed } from '../ui_utils'


type SliderElementsResult = {
    slidePages: React.ReactNode[],
    pageControlls?: React.ReactNode
}

type Props = {
    startFrom?: number,
    noControlls?: boolean,
    showNumber?: number,
    attributes?: React.Attributes,
    onSlide?: (nextPage: number, e?: HTMLSwipeMouseEvent | React.MouseEvent) => void,
    data: React.ReactNode[]
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    showNumber: number
}


export { Props, DefaultProps, SliderElementsResult }