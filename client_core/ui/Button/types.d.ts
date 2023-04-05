import type {
    PropsComponentBase, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'


type ButtonAttributes = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = PropsComponentBase<{
    /** Button type */
    type?: ButtonAttributes['type']

    /** Button content */
    value?: React.ReactNode

    /** Disables button */
    disabled?: ButtonAttributes['disabled']

    /** Click handler  */
    onClick?: ButtonAttributes['onClick']

    /** Root tag [<button>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
}>

type DefaultProps = NonNullableProps<{
    type: Props['type']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }