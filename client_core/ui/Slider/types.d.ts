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
    /** Root tag state if previous slide was slide forward */
    _slided_forward?: string

    /** Root tag state if previous slide was slide backward */
    _slided_backward?: string

    /** props.children */
    children?: string

    /** Underlaying Swipe element. Wraps slide elements */
    slides_wrapper?: string

    /** Slide element */
    slide?: string

    /** Currently selectd slide */
    slide__active?: string

    /** Previous slide */
    slide__prev?: string

    /** Next slide */
    slide__next?: string

    /** Wraps slides switch buttons */
    controls_wrapper?: string

    /** Slide pick controls */
    control?: string

    /** Control that represents active slide */
    control__active?: string
}

type Props = PropsComponentThemed<Theme, {
    /** Slides elements */
    slides: Slide[]

    /**
     * Triggered whenever current slide changes
     *
     * @param newSlideIndex
     * @param prevSlideIndex
     */
    onChange?(newSlideIndex: number, prevSlideIndex: number): void

    /** Inner store */
    store?: ReactStore<number>

    /** Children element to be redered at the root level */
    children?: React.ReactNode

    /** Slide index to show first */
    startFrom?: number

    /** Adds slide pick controls */
    withControls?: boolean

    /** Pixels value you should drag before slide change will occur */
    swipeDelta?: number

    /** Whether to loop slides */
    loop?: boolean

    /** Enabled automatic slides change with provided interval in ms. */
    autoslideInterval?: number

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    swipeDelta: Props['swipeDelta']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component,
    Slide, SlideEl, SlideFn, SwitchSlide
}