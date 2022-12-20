import type {
    PropsComponentBase, CoreUIComponent, ReactTagAttributes
} from '../../ui/_internals/types'


type LinkReactTagAttributes = ReactTagAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>

type Props = PropsComponentBase<
    {
        href: NonNullable<LinkReactTagAttributes['href']>
        state?: any
        activeClassName?: string
        onClick?(e: React.MouseEvent): void
    } & LinkReactTagAttributes
>

type DefaultProps = {}

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, MergedProps, Component }