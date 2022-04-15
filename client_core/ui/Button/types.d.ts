import type {
    PropsComponentBase, CoreIUComponent, NewComponentAttributes, ComponentAttributes
} from '../_internals/types'


type ButtonAttributes = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = PropsComponentBase<{
    type?: ButtonAttributes['type']
    value?: React.ReactNode
    disabled?: ButtonAttributes['disabled']
    onClick?: ButtonAttributes['onClick']
    rootTagAttributes?: NewComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
}>

type DefaultProps = NonNullableKeys<{
    type: Props['type']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }