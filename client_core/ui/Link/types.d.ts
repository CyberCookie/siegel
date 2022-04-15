import type {
    PropsComponentBase, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type Props = PropsComponentBase<{
    path: string
    title: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
}>

type DefaultProps = {}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }