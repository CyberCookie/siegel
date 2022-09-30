import type {
    PropsComponentBase, CoreUIComponent, CoreUIReactTagAttributes, ReactTagAttributes
} from '../_internals/types'


type ButtonAttributes = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = PropsComponentBase<{
    type?: ButtonAttributes['type']
    value?: React.ReactNode
    disabled?: ButtonAttributes['disabled']
    onClick?: ButtonAttributes['onClick']
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
}>

type DefaultProps = NonNullableKeys<{
    type: Props['type']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component }