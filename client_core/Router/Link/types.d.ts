import type { ComponentAttributes } from '../ui/_internals/types'


type LinkTagAttributes = ComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
type LinkProps = {
    href: NonNullable<LinkTagAttributes['href']>
    activeClassName?: string
    onClick?: (e: React.MouseEvent) => void
} & LinkTagAttributes


export type { LinkProps }