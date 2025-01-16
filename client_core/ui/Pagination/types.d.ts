import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type GetPageElement = (page: number, props: MergedProps) => JSX.Element


type Theme = {
    /** Applied to the root tag if there is only one page to select */
    _single?: string

    /** Element between side and middle pages */
    separator?: string

    /** Numeric page switcher */
    page?: string

    /** Applied to currently selected numeric page switcher */
    page__active?: string

    /** Go to previous page element */
    goto_prev?: string

    /** Go to next page element */
    goto_next?: string

    /** Applied to page change switcher if there is no pages left before or next */
    change__disabled?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** All elements quantity */
    listLength: number

    /** Currently selected page */
    curPage: number

    /** Elements to show per page */
    showPerPage: number

    /**
     * Triggered when active page is changed
     *
     * @param nextPage
     * @param event
     * @param payload
     */
    onChange(
        nextPage: number,
        event: React.MouseEvent<HTMLDivElement>,
        payload: _Payload
    ): void

    /**
     * Triggered right before props.onChange is fired. May prevent props.onCHange
     * @param event
     */
    onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void

    /** Number of numeric page switchers by the sides of Paginator */
    elementsBySide?: number

    /** Number of numeric page switchers between side switchers */
    elementsByMiddle?: number

    /** Go to previous page button icon */
    iconPrev?: React.ReactNode

    /** Go to next page button icon */
    iconNext?: React.ReactNode

    /** Element between side and midle pages */
    separator?: React.ReactNode

    /** Any data to be passed to props.onChange callback */
    payload?: _Payload

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<
        HTMLDivElement,
        Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown'>
    >

    /** Makes number of page switchers constant */
    fixedWidth?: boolean
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    elementsBySide: Props['elementsBySide']
    elementsByMiddle: Props['elementsByMiddle']
    fixedWidth: Props['fixedWidth']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, GetPageElement }