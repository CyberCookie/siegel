import type {
    PropsComponentBase, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Props = PropsComponentBase<{
    path: string
    title: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
}>

type Component = CoreUIComponent<Props, DefaultProps>

type DefaultProps = {}


export type { Props, DefaultProps, Component }