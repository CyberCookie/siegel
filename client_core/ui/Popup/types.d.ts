import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type Theme = {
    content?: string
    close?: string
}

type Props = PropsComponentThemed<Theme, {
    onClose(e: React.MouseEvent): void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    className: Props['className']
    theme: Required<Props['theme']>
    closeIcon: Props['closeIcon']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component }