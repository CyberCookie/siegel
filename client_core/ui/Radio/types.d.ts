import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type MultiSelectProps = {
    /** Selected option(s) */
    selected: Set<string>

    /** Allows to select multiple options */
    multiple: true
}
type SingleSelectProps = {
    selected: string
    multiple?: false
}


type Theme = {
    /** Root tag state if Radio component is disabled */
    _disabled?: string

    /** Radio option */
    option?: string

    /** Radio option selected */
    option__selected?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /**
     * Triggered when you pick an option
     *
     * @param id - Option ID
     * @param event - Mousedown event
     * @param payload - Option payload
     */
    onChange(
        id: string,
        event: React.MouseEvent<HTMLDivElement>,
        payload: _Payload
    ): void

    /** Radio options */
    options: {
        /** Option value */
        id: string

        /** Option text */
        content: React.ReactNode

        /** Option class name */
        className?: string

        /** Extra value to be passed to callback along with option value */
        payload?: _Payload
    }[]

    /** Disables radio buttons component */
    disabled?: boolean

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}> & (MultiSelectProps | SingleSelectProps)

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, MultiSelectProps, SingleSelectProps
}