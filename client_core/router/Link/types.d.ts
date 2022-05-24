import type {
    PropsComponentBase, CoreIUComponent, ComponentAttributes
} from '../../ui/_internals/types'


type LinkTagAttributes = ComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>

type Props = PropsComponentBase<
    {
        href: NonNullable<LinkTagAttributes['href']>
        state?: any
        activeClassName?: string
        onClick?: (e: React.MouseEvent) => void
    } & LinkTagAttributes
>

type DefaultProps = {}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, MergedProps, Component }