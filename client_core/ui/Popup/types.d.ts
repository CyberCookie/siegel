import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'content' | 'close'

type Props = {
    onClose(e: React.MouseEvent): void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    className: NonNullable<Required<Props['className']>>
    theme: NonNullable<Required<Props['theme']>>
    closeIcon: NonNullable<Props['closeIcon']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }