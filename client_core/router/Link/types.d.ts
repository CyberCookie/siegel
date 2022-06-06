import type {
    PropsComponentBase, CoreUIComponent, ComponentAttributes
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

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, MergedProps, Component }