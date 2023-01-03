import type {
    PropsComponentBase, CoreUIComponent, ReactTagAttributes
} from '../../ui/_internals/types'


type LinkReactTagAttributes = ReactTagAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>

type Props = PropsComponentBase<
    {
        /** Pathname to perform navigation to */
        href: NonNullable<LinkReactTagAttributes['href']>

        /** History state to be applied when follow this link */
        state?: any

        /** Defines className for this link tag if it points to currently active URL */
        activeClassName?: string

        /**
         * Link click handler, that may prevent default click handler
         *
         * @param e Mouse event
         */
        onClick?(e: React.MouseEvent): void
    } & LinkReactTagAttributes
>

type DefaultProps = {}

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, MergedProps, Component }