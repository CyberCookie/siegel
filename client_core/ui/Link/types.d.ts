import type {
    PropsComponentBase, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type Props = PropsComponentBase<{
    path: string
    title: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component }