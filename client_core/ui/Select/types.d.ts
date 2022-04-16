import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type State = {
    isActive: boolean
    arrowSelectIndex: number | undefined
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type Option = {
    value: _Value
    title: React.ReactNode
    disabled?: boolean
    payload?: _Payload
    className?: string
}


type Theme = {
    _active?: string
    _disabled?: string
    _error?: string
    _filled?: string
    children?: string
    label?: string
    title_wrapper?: string
    title_text?: string
    input_wrapper?: string
    reset?: string
    error_text?: string
    options?: string
    option?: string
    option__active?: string
    option__disabled?: string
}

type Props<_Value = any, _Payload = any> = PropsComponentThemed<Theme, {
    options: Option[],
    onChange(value: _Value, e: React.MouseEvent | React.KeyboardEvent, payload?: _Payload): void
    children?: React.ReactNode
    store?: Store
    getDisplayValue?(selectedOption: Option): React.ReactNode
    errorMsg?: React.ReactNode
    dropdownIcon?: React.ReactNode
    resetIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    placeholder?: React.ReactNode
    selected?: _Value
    filterSelected?: boolean
    disabled?: boolean
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    closeOnSelect: Props['closeOnSelect']
    filterSelected: Props['filterSelected']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Store, Option }