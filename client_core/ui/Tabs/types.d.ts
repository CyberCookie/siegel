import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ThemeKeys = 'labels_wrapper' | 'label' | 'label__active' | 'content' | 'content__empty'

type Props<_Payload = any> = PropsComponentThemed<ThemeKeys, {
    tabs: {
        id: string
        label: React.ReactNode
        content?: React.ReactNode
        payload?: _Payload
    }[],
    onChange(id: string, e: React.MouseEvent, payload: _Payload): void
    renderAll?: boolean
    showEmpty?: boolean
    activeTab?: string
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }