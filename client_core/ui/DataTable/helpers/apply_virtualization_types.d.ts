import type { ReactTagAttributes } from '../../_internals/types'
import type { MergedProps, State } from '../types'


type Ref = React.MutableRefObject<HTMLDivElement>

type Virtualization = NonNullable<MergedProps['virtualization']>

type ScrollTopState = {
    scrollTop: number
    prevScrollTop: number
    timeoutID: number
    prevHeadAdjustment: {
        value: number | undefined
        scrollTop: number | undefined
        isScrollUp: boolean | undefined
    }
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
    Ref, ScrollTopState, SlideWindowRange, GetWindowSlideRanges,
    UseVirtualizationParams, VirtualizationMergedProps
}