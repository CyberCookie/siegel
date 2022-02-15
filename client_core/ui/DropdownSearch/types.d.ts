import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type State = {
    searchString: string | undefined
    arrowSelectIndex: number | undefined
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type Option = {
    inputValue: string
    value: _Value
    title?: React.ReactNode
    className?: string
    payload?: _Payload
    disabled?: boolean
    alwaysVisible?: boolean
}

type ThemeKeys = 'children' | 'options' | 'option' | 'option__selected'
    | '_with_suggestions' | '_disabled' | '_focused'

type Props<_Value = any, _Payload = any> = {
    onChange(
        value: _Value | undefined,
        e: React.MouseEvent | React.FocusEvent | React.KeyboardEvent,
        payload?: _Payload
    ): void
    searchOptions: Option[]
    onSearch?(
        searchValue: string,
        e: Parameters<NonNullable<InputProps['onChange']>>[1]
    ): void
    innerStore?: Store
    attributes?: ComponentAttributes<HTMLDivElement>
    minInputLength?: number
    showOnFocus?: boolean
    showAll?: boolean
    selected?: _Value | undefined
    disabled?: boolean
    label?: InputProps['label']
    inputProps?: Omit<InputProps, 'type' | 'onChange' | 'value' | 'attributes'>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Store, State, Option }