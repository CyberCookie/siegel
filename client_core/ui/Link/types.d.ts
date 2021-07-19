import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    path: string
    title: React.ReactNode
    attributes?: ComponentAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
} & PropsComponentBase

type DefaultProps = {
    [key in keyof Props]?: Props[key]
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }