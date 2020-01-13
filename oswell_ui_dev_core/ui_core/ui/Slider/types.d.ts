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
    onSlide?: (nextPage: number) => void,
    data: React.ReactNode[]
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    showNumber: number
}


export { Props, DefaultProps, SliderElementsResult }