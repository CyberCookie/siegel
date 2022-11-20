import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type onSelectInner = (
    option: Option,
    event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
) => void

type State = {
    searchString: string | undefined
    arrowSelectIndex: number | undefined
}
type Store = ReactStore<State>

type Option<_Value = any> = {
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
    reset?: string
    label_wrapper?: string
    label_text?: string
    input_wrapper?: string
    options?: string
    option?: string
    option__disabled?: string
    option__selected?: string
}

type Props<_Value = any> = PropsComponentThemed<Theme, {
    onChange(
        value: _Value | undefined,
        event: React.FocusEvent | Parameters<onSelectInner>[1]
    ): void
    searchOptions: Option<_Value>[]
    onSearch?(
        searchValue: string,
        event: Parameters<NonNullable<InputProps['onChange']>>[1]
    ): void
    onRootBlur?(event: React.FocusEvent<HTMLDivElement>): void
    onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void
    children?: React.ReactNode
    store?: Store
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onKeyDown'>
    >
    minInputLength?: number
    showOnFocus?: boolean
    listDisabledOptions?: boolean
    showAll?: boolean
    selected?: _Value | undefined
    resetIcon?: React.ReactNode
    resetIconKeepChildren?: boolean
    disabled?: InputProps['disabled']
    inputTheme?: InputProps['theme']
    label?: InputProps['label']
    inputStore?: InputProps['store']
    autofocus?: InputProps['autofocus']
    placeholder?: InputProps['placeholder']
    inputClassName?: InputProps['className']
    inputTagAttributes?: InputProps['inputAttributes']
    inputRootTagAttributes?: InputProps['rootTagAttributes']
    inputMemoDeps?: InputProps['memoDeps']
    errorMsg?: InputProps['errorMsg']
    regexp?: InputProps['regexp']
    debounceMs?: InputProps['debounceMs']
    mask?: InputProps['mask']
    onBlur?: InputProps['onBlur']
    onFocus?: InputProps['onFocus']
}>

type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
    minInputLength: Props['minInputLength']
    listDisabledOptions: Props['listDisabledOptions']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, Store, State, Option,
    onSelectInner
}