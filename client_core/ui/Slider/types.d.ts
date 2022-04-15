import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type SwitchSlide = (
    nextPage: number,
    isNext: boolean,
    isControlClick?: boolean
) => void


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
    slides: React.ReactNode[]
    store?: [ number, React.Dispatch<React.SetStateAction<number>> ]
    children?: React.ReactNode
    startFrom?: number
    withControls?: boolean
    swipeDelta?: number
    loop?: boolean
    autoslideInterval?: number
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    swipeDelta: Props['swipeDelta']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, SwitchSlide }