import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
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
    onChange(
        id: string,
        event: React.MouseEvent<HTMLDivElement>,
        payload: _Payload
    ): void
    children?: React.ReactNode
    renderAll?: boolean
    showEmpty?: boolean
    activeTab?: string
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Tab }