import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type SwitchSlide = (nextPage: number) => void


type ThemeKeys = 'children' | 'slides_wrapper' | 'slide' | 'slide__active' | 'controls_wrapper' | 'control' | 'control__active'

type Props = {
    slides: React.ReactNode[]
    innerStore?: [ number, React.Dispatch<React.SetStateAction<number>> ]
    startFrom?: number
    withControlls?: boolean
    swipeDelta?: number
    loop?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    swipeDelta: NonNullable<Props['swipeDelta']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, SwitchSlide }