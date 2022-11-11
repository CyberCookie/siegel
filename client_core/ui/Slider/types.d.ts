import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type SwitchSlide = (
    nextPage: number,
    isNext: boolean,
    isControlClick?: boolean
) => void

type SlideEl = React.ReactNode
type SlideFn = (slideIndex: number) => React.ReactNode
type Slide = SlideEl | SlideFn



type Theme = {
    _slided_forward?: string
    _slided_backward?: string
    children?: string
    slides_wrapper?: string
    slide?: string
    slide__active?: string
    slide__prev?: string
    slide__next?: string
    controls_wrapper?: string
    control?: string
    control__active?: string
}

type Props = PropsComponentThemed<Theme, {
    slides: Slide[]
    onChange?(newSlideIndex: number, prevSlideIndex: number): void
    store?: ReactStore<number>
    children?: React.ReactNode
    startFrom?: number
    withControls?: boolean
    swipeDelta?: number
    loop?: boolean
    autoslideInterval?: number
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
    swipeDelta: Props['swipeDelta']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component,
    Slide, SlideEl, SlideFn, SwitchSlide
}