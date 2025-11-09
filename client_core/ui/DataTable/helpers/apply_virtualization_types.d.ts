import type { TableBodyRow } from '../../Table'
import type { MergedProps, State } from '../types'


type Ref = React.RefObject<HTMLDivElement>

type Virtualization = NonNullable<MergedProps['virtualization']>

type ScrollTopState = {
    scrollTop: number
    timeoutID: number
}

type SlideWindowRange = {
    from: number
    to: number
}
type GetWindowSlideRanges = (params: {
    scrollTop: number
    itemHeight: Virtualization['itemHeight']
    tableHeight: NonNullable<Virtualization['tableHeight']>
    preloadedItemsBySide: NonNullable<Virtualization['preloadedItemsBySide']>
    maxItemsCount: number
}) => SlideWindowRange

type GetExpanderRow = (
    isTop: boolean,
    themeClassName: MergedProps['theme']['virtualization_expander_cell']
) => TableBodyRow

type UseVirtualizationParams = {
    state: State
    rootAttributes: ReactTagAttributes<HTMLDivElement>
    props: MergedProps
}
type VirtualizationMergedProps = {
    props: {
        virtualization: Virtualization
    } & MergedProps
} & UseVirtualizationParams


export type {
    Ref, ScrollTopState, SlideWindowRange,
    GetWindowSlideRanges, GetExpanderRow,
    UseVirtualizationParams, VirtualizationMergedProps
}