import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ThemeKeys = 'content' | 'close'

type Props = PropsComponentThemed<ThemeKeys, {
    onClose(e: React.MouseEvent): void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    className: NonNullable<Required<Props['className']>>
    theme: NonNullable<Required<Props['theme']>>
    closeIcon: NonNullable<Props['closeIcon']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }