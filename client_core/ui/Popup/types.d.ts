import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Theme = {
    content?: string
    close?: string
}

type Props = PropsComponentThemed<Theme, {
    onClose(e: React.MouseEvent): void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }