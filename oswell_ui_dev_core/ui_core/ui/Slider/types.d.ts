import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'slides_wrapper' | 'slide' | 'slide__active' | 'controls_wrapper' | 'control' | 'control__active'

type Props = {
    slides: React.ReactNode[]
    store?: [
        number,
        (nextPage: number) => void
    ]
    startFrom?: number
    withControlls?: boolean
    swipeDelta?: number
    loop?: boolean
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    swipeDelta: NonNullable<Props['swipeDelta']>
}

type _Slider = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Slider }