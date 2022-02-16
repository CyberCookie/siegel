import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type ThemeKeys =  'children' | 'label' | 'title' | 'title_text' | 'input_wrapper' | 'reset'
    | 'options' | 'option' | 'option__active' | 'option__disabled'
    | '_active' | '_disabled' | '_filled'

type Props<_Value = any, _Payload = any> = PropsComponentThemed<ThemeKeys, {
    options: {
        value: _Value
        title: React.ReactNode
        disabled?: boolean
        payload?: _Payload
        className?: string
    }[],
    onChange(value: _Value, e: React.MouseEvent, payload?: _Payload): void
    innerStore?: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    getDisplayValue?(selectedOption: Props['options'][number]): React.ReactNode
    dropdownIcon?: React.ReactNode
    resetIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    placeholder?: React.ReactNode
    selected?: _Value
    filterSelected?: boolean
    disabled?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
}>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    closeOnSelect: NonNullable<Props['closeOnSelect']>
    dropdownIcon: NonNullable<Props['dropdownIcon']>
    filterSelected: NonNullable<Props['filterSelected']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }