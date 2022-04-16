import type { PropsComponentThemed, CoreIUComponent, NewComponentAttributes } from '../_internals/types'
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
    disabled?: boolean
    alwaysVisible?: boolean
}


type Theme = {
    _with_suggestions?: string
    _disabled?: string
    _focused?: string
    _error?: string
    children?: string
    reset?: string
    options?: string
    option?: string
    option__selected?: string
}

type Props<_Value = any> = PropsComponentThemed<Theme, {
    onChange(
        value: _Value | undefined,
        e: React.MouseEvent | React.FocusEvent | React.KeyboardEvent
    ): void
    searchOptions: Option[]
    onSearch?(
        searchValue: string,
        e: Parameters<NonNullable<InputProps['onChange']>>[1]
    ): void
    children?: React.ReactNode
    store?: Store
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
    minInputLength?: number
    showOnFocus?: boolean
    showAll?: boolean
    selected?: _Value | undefined
    resetIcon?: React.ReactNode
    disabled?: InputProps['disabled']
    inputTheme?: InputProps['theme']
    label?: InputProps['label']
    inputChildren?: InputProps['children']
    inputStore?: InputProps['store']
    autofocus?: InputProps['autofocus']
    placeholder?: InputProps['placeholder']
    inputTagAttributes?: InputProps['inputAttributes']
    errorMsg?: InputProps['errorMsg']
    regexp?: InputProps['regexp']
    mask?: InputProps['mask']
    onBlur?: InputProps['onBlur']
    onFocus?: InputProps['onFocus']
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    minInputLength: Props['minInputLength']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Store, State, Option }