import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Option = {
    id: ID
    content: React.ReactNode
    className?: string
}

type MultiSelectProps = {
    multiple: true
    selected: Set<ID>
}
type SingleSelectProps = {
    multiple?: false
    selected: ID
}

type ThemeKeys = 'option' | 'option__selected' | '_disabled'

type Props = {
    onChange(id: ID, e: React.MouseEvent): void
    options: Option[]
    disabled?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>
    & (MultiSelectProps | SingleSelectProps)

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Option, MultiSelectProps, SingleSelectProps }