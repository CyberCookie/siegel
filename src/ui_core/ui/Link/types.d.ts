import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    path: string
    title: React.ReactNode
    attributes?: ComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}

type MergedProps = Props & DefaultProps

type _Link = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Link }