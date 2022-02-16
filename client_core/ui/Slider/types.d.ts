import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type SwitchSlide = (
    nextPage: number,
    isNext: boolean,
    isControlClick?: boolean
) => void

type GetSliderVisualsParams = {
    mergedProps: MergedProps
    switchSlide: SwitchSlide
    curSlide: number
}


type ThemeKeys = 'children' | 'slides_wrapper'
    | 'slide' | 'slide__active' | 'slide__prev' | 'slide__next'
    | 'controls_wrapper' | 'control' | 'control__active'
    | '__slided_forward' | '__slided_backward'

type Props = PropsComponentThemed<ThemeKeys, {
    slides: React.ReactNode[]
    innerStore?: [ number, React.Dispatch<React.SetStateAction<number>> ]
    startFrom?: number
    withControlls?: boolean
    swipeDelta?: number
    loop?: boolean
    autoslideInterval?: number
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    swipeDelta: NonNullable<Props['swipeDelta']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, SwitchSlide, GetSliderVisualsParams }