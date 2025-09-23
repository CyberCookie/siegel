import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type OnSelect = (
    value: Option['value'],
    e: Parameters<MergedProps['onChange']>[1],
    payload?: Option['payload']
) => void

type OnChangeEvent = React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>

type RootRef = React.RefObject<HTMLDivElement>

type SelectedOption = Option | Option[] | undefined


type Store = ReactStore<{
    /** Whether select is in focus */
    isActive: boolean

    /** Keyboard selected option index */
    arrowSelectIndex: number | undefined
}>

type Option<_Value = any, _Payload = any> = {
    /** Option value */
    value: _Value

    /** Option text element */
    title: React.ReactNode

    /** Disable this option */
    disabled?: boolean

    /** Any value to be passed to props.onChange callback */
    payload?: _Payload

    /** Option class name */
    className?: string
}


type Theme = {
    /** Root tag state if select is in focus */
    _active?: string

    /** Root tag state if select is disabled */
    _disabled?: string

    /** Root tag state if props.errorMsg is defined */
    _error?: string

    /** Root tag state if select has selected value */
    _filled?: string

    /** Root tag state if multiselect is enabled */
    _multiselect?: string

    /** props.children element */
    children?: string

    /** Select component label */
    label?: string

    /** Wraps title_text, reset and props.dropdownIcon */
    title_wrapper?: string

    /** Title text element */
    title_text?: string

    /** Title text option if props.multiselect is enabled */
    multiselect_title_option?: string

    /** Wraps title_wrapper, error_text and options */
    input_wrapper?: string

    /** props.resetIcon element */
    reset?: string

    /** props.errorMsg element */
    error_text?: string

    /** Select options */
    options?: string

    /** Each Select option */
    option?: string

    /** Currently selected option */
    option__active?: string

    /** Disabled option */
    option__disabled?: string
}

type Props<_Value = any, _Payload = any> = PropsComponentThemed<Theme, {
    /** Possible options to choose */
    options: Option<_Value, _Payload>[],

    /**
     * Root tag focus event handler. May prevent inner default onFocus event
     *
     * @param event focus event
     */
    onFocus?(event: React.FocusEvent<HTMLDivElement>): void

    /**
     * Root tag blur event handler. May prevent inner default onBlur event
     *
     * @param event focus event
     */
    onBlur?(event: React.FocusEvent<HTMLDivElement>): void

    /**
     * Root tag keydown event handler. May prevent inner default onKeyDown event
     *
     * @param event keyboard event
     */
    onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void

    /** Children element to be rendered at root level */
    children?: React.ReactNode

    /** Select inner store */
    store?: Store

    /** Error message */
    errorMsg?: React.ReactNode

    /** Icon to use near title */
    dropdownIcon?: React.ReactNode

    /** Icon to use to reset selected option. Definition of this icon provides reset functionality */
    resetIcon?: React.ReactNode

    /** Whether to close options list when an option has been picked */
    closeOnSelect?: boolean

    /** Component label */
    label?: React.ReactNode

    /** String to place instead of props.getDisplayValue() when option is not selected */
    placeholder?: React.ReactNode

    /** Selected option */
    // selected?: _Value

    /** Whether to filter out selected option from the options list */
    listSelectedOption?: boolean

    /** Whether to show disabled options in a options list */
    listDisabledOptions?: boolean

    /** Disalbes select component */
    disabled?: boolean

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<Element>, 'onKeyDown' | 'onFocus' | 'onBlur'>
    >
}>
& ({
    /** Allows options multiselect */
    multiselect?: false

    /** Selected option */
    selected?: _Value

    /**
     * Triggered when you choose new option
     *
     * @param value Option's value
     * @param event
     * @param payload option payload
     */
    onChange(value: _Value, event: OnChangeEvent, payload?: _Payload): void

    /**
     * Constructs component input title
     *
     * @param selectedOption selected option
     */
    getDisplayValue?(selectedOption: Option<_Value>): React.ReactNode
} | {
    /** Allows options multiselection */
    multiselect: true

    /** Selected set of options */
    selected: Set<_Value>

    /**
     * Triggered when you choose new option
     *
     * @param value Set of option's values
     * @param event
     * @param payload option payload
     */
    onChange(value: Set<_Value>, event: OnChangeEvent, payload?: _Payload): void

    /**
     * Constructs component input title
     *
     * @param selectedOption selected options array
     */
    getDisplayValue?(selectedOptions: Option<_Value>[]): React.ReactNode
})

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    closeOnSelect: Props['closeOnSelect']
    listDisabledOptions: Props['listDisabledOptions']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, Component, Store, MergedProps,
    OnSelect, RootRef, SelectedOption, Option
}