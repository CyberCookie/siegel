import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'label' | 'title' | 'title_text' | 'input_wrapper' | 'options' | 'option'
    | '_option_active' | '_option_disabled' | '_active' | '_disabled' | '_filled'

type Props<V = any> = {
    displayValue: React.ReactNode
    options: {
        disabled?: boolean
        payload?: any
        className?: string
        value: V
        title: React.ReactNode
    }[],
    onChange(value: V, e: React.MouseEvent, payload?: any): void
    dropdownIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    placeholder?: React.ReactNode
    selected?: V
    filterSelected?: boolean
    disabled?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    closeOnSelect: NonNullable<Props['closeOnSelect']>
    dropdownIcon: NonNullable<Props['dropdownIcon']>
    filterSelected: NonNullable<Props['filterSelected']>
}

type MergedProps = Props & DefaultProps

type _Select = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Select }