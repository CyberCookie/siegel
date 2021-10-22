import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'labels_wrapper' | 'label' | 'label__active' | 'content' | 'content__empty'

type Props<_Payload = unknown> = {
    tabs: {
        id: string
        label: React.ReactNode
        content?: React.ReactNode
        payload?: _Payload
    }[],
    onChange(id: string, e: React.MouseEvent, payload: _Payload): void
    activeTab?: string
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }