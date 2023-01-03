import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Props = PropsComponentBase<{
    /** Link path */
    path: string

    /** Link text */
    title: React.ReactNode

    /** Root tag [<a>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
}>

type Component = CoreUIComponent<Props, DefaultProps>

type DefaultProps = {}


export type { Props, DefaultProps, Component }