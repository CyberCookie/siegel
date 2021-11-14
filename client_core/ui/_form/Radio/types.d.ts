import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type MultiSelectProps = {
    multiple: true
    selected: Set<string>
}
type SingleSelectProps = {
    multiple?: false
    selected: string
}

type ThemeKeys = 'option' | 'option__selected' | '_disabled'

type Props<_Payload = any> = {
    onChange(id: string, e: React.MouseEvent, payload: _Payload): void
    options: {
        id: string
        content: React.ReactNode
        className?: string
        payload?: _Payload
    }[]
    disabled?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>
    & (MultiSelectProps | SingleSelectProps)

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, MultiSelectProps, SingleSelectProps }