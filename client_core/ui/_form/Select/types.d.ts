import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys =  'children' | 'label' | 'title' | 'title_text' | 'input_wrapper' | 'options' | 'option' | 'reset'
    | '_option_active' | '_option_disabled' | '_active' | '_disabled' | '_filled'

type Props<V = any> = {
    options: {
        value: V
        title: React.ReactNode
        disabled?: boolean
        payload?: any
        className?: string
    }[],
    onChange(value: V, e: React.MouseEvent, payload?: any): void
    innerStore?: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    getDisplayValue?(selectedOption: Props['options'][number]): React.ReactNode
    dropdownIcon?: React.ReactNode
    resetIcon?: React.ReactNode
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

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }