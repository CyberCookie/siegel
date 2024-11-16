import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
} from '../_internals/types'


type Tab<_Payload = any> = {
    /** Tab ID */
    id: string

    /** Tab label content */
    label: React.ReactNode

    /** Tab content */
    content?: React.ReactNode | (() => React.ReactNode)

    /** Classname to be applied to tab's content when active */
    contentClassName?: string

    /** Classname to be applied to this label */
    labelClassName?: string

    /** Data to be passed to props.onChange callback */
    payload?: _Payload

    /** Always render tab with display: none if not selected */
    prerender?: boolean
}

type Theme = {
    /** props.children element */
    children?: string

    /** Wraps all the tabs labels */
    labels_wrapper?: string

    /** Tab label */
    label?: string

    /** Active tab's label */
    label__active?: string

    /** Tab content */
    content?: string

    /** Tab content state if there is no content defined */
    content__empty?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** Represents each tab data */
    tabs: Tab<_Payload>[],

    /**
     * Triggered when tab is selected
     *
     * @param id Selected tab ID
     * @param event Mouse event
     * @param payload Payload to be passed to props.onChange callback
     */
    onChange(
        id: string,
        event: React.MouseEvent<HTMLDivElement>,
        payload: _Payload
    ): void

    /** Children content to be rendered at the root level */
    children?: React.ReactNode

    /** Renders content wrapper if it's empty */
    showEmpty?: boolean

    /** Active tab ID */
    activeTab?: string

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component, Tab }