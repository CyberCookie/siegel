import { HTMLSwipeMouseEvent } from '../Swipe/types'
import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type SliderElementsResult = {
    slidePages: React.ReactNode[]
    pageControlls?: React.ReactNode
}

type ThemeKeys = 'slides' | 'slide_page' | 'slides_controls' | 'control' | 'control__active'
    | 'slide'

type Props = {
    data: React.ReactNode[]
    startFrom?: number
    noControlls?: boolean
    showNumber?: number
    swipeDelta?: number
    onChange?: (nextPage: number, e?: HTMLSwipeMouseEvent | React.MouseEvent) => void
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    showNumber: NonNullable<Props['showNumber']>
    swipeDelta: NonNullable<Props['swipeDelta']>
}

type _Slider = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, SliderElementsResult, _Slider }