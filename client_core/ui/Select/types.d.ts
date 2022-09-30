import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type OnSelect = (
    value: Option['value'],
    e: Parameters<MergedProps['onChange']>[1],
    payload?: Option['payload']
) => void

type RootRef = React.MutableRefObject<HTMLDivElement>


type Store = ReactStore<{
    isActive: boolean
    arrowSelectIndex: number | undefined
}>

type Option<_Value = any> = {
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
    options: Option<_Value>[],
    onChange(value: _Value, e: React.MouseEvent | React.KeyboardEvent, payload?: _Payload): void
    children?: React.ReactNode
    store?: Store
    getDisplayValue?(selectedOption: Option<_Value>): React.ReactNode
    errorMsg?: React.ReactNode
    dropdownIcon?: React.ReactNode
    resetIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    placeholder?: React.ReactNode
    selected?: _Value
    listSelectedOption?: boolean
    listDisabledOptions?: boolean
    disabled?: boolean
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    closeOnSelect: Props['closeOnSelect']
    listSelectedOption: Props['listSelectedOption']
    listDisabledOptions: Props['listDisabledOptions']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component, Store, MergedProps, OnSelect, RootRef }