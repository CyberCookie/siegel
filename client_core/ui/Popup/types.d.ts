import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Theme = {
    content?: string
    close?: string
}

type Props = PropsComponentThemed<Theme, {
    onClose(event: React.MouseEvent<HTMLDivElement>): void
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown'>
    >
}>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }