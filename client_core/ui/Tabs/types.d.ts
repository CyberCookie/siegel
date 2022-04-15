import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type Tab = {
    id: string
    label: React.ReactNode
    content?: React.ReactNode | (() => React.ReactNode)
    payload?: _Payload
}

type Theme = {
    children?: string
    labels_wrapper?: string
    label?: string
    label__active?: string
    content?: string
    content__empty?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    tabs: Tab[],
    onChange(id: string, e: React.MouseEvent, payload: _Payload): void
    children?: React.ReactNode
    renderAll?: boolean
    showEmpty?: boolean
    activeTab?: string
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Tab }