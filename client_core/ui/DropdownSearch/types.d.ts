import type {
    PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes
} from '../_internals/types'
import type { Props as InputProps } from '../Input/types'


type onSelectInner = (
    option: Option,
    event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
) => void

type State = {
    /** Input search string */
    searchString: string | undefined

    /** Keyboard selected option index */
    arrowSelectIndex: number | undefined
}
type Store = ReactStore<State>

type Option<_Value = any> = {
    /** Option string value to match input search string */
    inputValue: string

    /** Option value */
    value: _Value

    /** Option title element */
    title?: React.ReactNode

    /** Option class name */
    className?: string

    /** Disables an option */
    disabled?: boolean

    /** Always persists in search suggestions */
    alwaysVisible?: boolean
}


type Theme = {
    /** Root tag state if search suggestions is visible */
    _with_suggestions?: string

    /** Root tag state if component is disabled */
    _disabled?: string

    /** Root tag state if component is focused */
    _focused?: string

    /** Root tag state if props.error is defined */
    _error?: string

    /** Reset icon wrapper */
    reset?: string

    /** Wraps input and options */
    input_wrapper?: string

    /** Label wrapper element */
    label_wrapper?: string

    /** Label text element */
    label_text?: string

    /** Options wrapper element */
    options?: string

    /** Suggestion option */
    option?: string

    /** Option state if the option is disabled */
    option__disabled?: string

    /** Option state if the option is selected */
    option__selected?: string
}

type Props<_Value = any> = PropsComponentThemed<Theme, {
    /**
     * Triggered on option selection
     *
     * @param value - Option value
     * @param event - Focus event / Mouse event / Keyboard event
     */
    onChange(
        value: _Value | undefined,
        event: React.FocusEvent | Parameters<onSelectInner>[1]
    ): void

    /** Search suggestion options */
    searchOptions: Option<_Value>[]

    /**
     * Triggered when user type into component input
     *
     * @param searchValue - Input value
     * @param event - Change event / Focuse event
     */
    onSearch?(
        searchValue: string,
        event: Parameters<NonNullable<InputProps['onChange']>>[1]
    ): void

    /**
     * Triggered when component root looses focus
     *
     * @param event - Focus event
     */
    onRootBlur?(event: React.FocusEvent<HTMLDivElement>): void

    /**
     * Triggered when key was pressed
     *
     * @param event - Keyboard event
     */
    onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void

    /** Any children element to be passed to underlaying Input component */
    children?: React.ReactNode

    /** Inner store */
    store?: Store

    /** Root tag [<div>] attributes  */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onKeyDown'>
    >

    /** How many characters to type for suggestions to appear */
    minInputLength?: number

    /** Always show suggestions on component focus */
    showOnFocus?: boolean

    /** Show disabled options among popup */
    listDisabledOptions?: boolean

    /** Show all suggestions */
    showAll?: boolean

    /** Selected option value */
    selected?: _Value | undefined

    /** Enables reset option capability providing reset icon */
    resetIcon?: React.ReactNode

    /**
     * Keeps props.children rendered when resetIcon appears
     * since both are Underlaying Input children
     */
    resetIconKeepChildren?: boolean

    /** Disables underlaying Input component */
    disabled?: InputProps['disabled']

    /** Underlaying Input theme */
    inputTheme?: Omit<InputProps['theme'], 'label' | 'label_text'>

    /** Underlaying Input label */
    label?: InputProps['label']

    /** Underlaying Input inner input store */
    inputStore?: InputProps['store']

    /** Enables underlaying Input component's autofocus */
    autofocus?: InputProps['autofocus']

    /** Underlaying Input placeholder */
    placeholder?: InputProps['placeholder']

    /** Underlaying Input class name */
    inputClassName?: InputProps['className']

    /** Underlaying Input input tag [<input>] attributes */
    inputTagAttributes?: InputProps['inputAttributes']

    /** Underlaying Input input root tag [<div>] attributes */
    inputRootTagAttributes?: InputProps['rootTagAttributes']

    /** Underlaying Input memo dependencies params */
    inputMemoDeps?: InputProps['memoDeps']

    /** Underlaying Input error message */
    errorMsg?: InputProps['errorMsg']

    /** Input regexp */
    regexp?: InputProps['regexp']

    /** Search input change debounce in ms */
    debounceMs?: InputProps['debounceMs']

    /** Applies search input mask */
    mask?: InputProps['mask']

    /** Triggered on search input focus */
    onBlur?: InputProps['onBlur']

    /** Triggered on search input blur */
    onFocus?: InputProps['onFocus']
}>

type DefaultProps = NonNullableProps<{
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