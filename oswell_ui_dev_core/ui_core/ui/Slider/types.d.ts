import { HTMLSwipeMouseEvent } from '../Swipe'
import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type SliderElementsResult = {
    slidePages: React.ReactNode[]
    pageControlls?: React.ReactNode
}

type Props = {
    startFrom?: number
    noControlls?: boolean
    showNumber?: number
    onChange?: (nextPage: number, e?: HTMLSwipeMouseEvent | React.MouseEvent) => void
    data: React.ReactNode[]
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    showNumber: number
}

type _Slider = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, SliderElementsResult, _Slider }