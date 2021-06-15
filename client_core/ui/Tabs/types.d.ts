import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'labels_wrapper' | 'label' | 'label__active' | 'content' | 'content__empty'

type Props = {
    tabs: {
        id: ID
        content: React.ReactNode
        label: React.ReactNode
        payload?: any
    }[],
    onChange(id: ID, e: React.MouseEvent, payload?: any): void
    activeTab?: ID
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }