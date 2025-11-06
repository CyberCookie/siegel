import { useLayoutEffect, useState, useRef } from 'react'

import type {
    Ref, ScrollTopState, SlideWindowRange,
    GetWindowSlideRanges, GetExpanderRow,
    UseVirtualizationParams, VirtualizationMergedProps
} from './apply_virtualization_types'


const getDefaultState = () => ({
    scrollTop: 0,
    prevScrollTop: 0,
    timeoutID: 0,
    prevHeadAdjustment: {
        value: undefined,
        scrollTop: undefined,
        isScrollUp: undefined
    }
})

const getWindowSlideRanges: GetWindowSlideRanges = ({
    scrollTop, itemHeight, preloadedItemsBySide, maxItemsCount, tableHeight
}) => {

    const to = Math.min(
        Math.ceil((scrollTop + tableHeight) / itemHeight) + preloadedItemsBySide,
        maxItemsCount
    )

    const from = Math.max(
        Math.min(
            Math.ceil(scrollTop / itemHeight),
            to - Math.ceil(tableHeight / itemHeight)
        ) - preloadedItemsBySide,
        0
    )


    return { from, to }
}

const getExpanderRow: GetExpanderRow = (isTop, className) => ({
    children: [{
        value: '',
        attributes: { className }
    }],
    attributes: {
        key: `____${isTop ? 'top' : 'bottom'}_virtualization_expander_row_cell`
    }
})

function applyVirtualization(params: UseVirtualizationParams) {
    const {
        rootAttributes,
        state: { showPerPage },
        props: {
            withFooter, onScroll,
            entities: { sorted },
            virtualization: {
                itemHeight,
                preloadedItemsBySide = 20,
                scrollUpdateInterval = 250,
                tableHeight = innerHeight
            }
        }
    } = params as VirtualizationMergedProps


    rootAttributes.ref = useRef(null)

    const [ virtualizationState, setVirtualizationState ] = useState<ScrollTopState>(
        getDefaultState()
    )
    const { scrollTop } = virtualizationState


    const maxItemsCount = withFooter
        ?   Math.min(showPerPage, sorted.length)
        :   sorted.length

    const slideWindowRange = getWindowSlideRanges({
        scrollTop, itemHeight, tableHeight, preloadedItemsBySide, maxItemsCount
    })


    function onScrollHandler(e: React.UIEvent<HTMLDivElement, UIEvent>) {
        onScroll?.(e)

        if (!(e.defaultPrevented || virtualizationState.timeoutID)) {
            const rootElement = e.target as HTMLDivElement

            virtualizationState.timeoutID = (setTimeout as Window['setTimeout'])(() => {
                const newScrollTopState = getDefaultState()
                newScrollTopState.scrollTop = newScrollTopState.prevScrollTop = rootElement.scrollTop

                setVirtualizationState(newScrollTopState)
            }, scrollUpdateInterval)
        }
    }


    function useVirtualizationScrolling(newMaxItemsCount: number) {
        useLayoutEffect(() => {
            const { from, to } = getWindowSlideRanges({
                itemHeight, preloadedItemsBySide, scrollTop, tableHeight,
                maxItemsCount: newMaxItemsCount
            })

            const { rows } = ((rootAttributes.ref as Ref).current!
                .firstChild as HTMLTableElement)
                .tBodies[0]

            rows[0].cells[0].style.height = `${from * itemHeight}px`
            rows[rows.length - 1].cells[0].style.height = `${(newMaxItemsCount - to) * itemHeight}px`


            return () => {
                clearTimeout(virtualizationState.timeoutID)
            }
        }, [ scrollTop, showPerPage, newMaxItemsCount ])
    }


    return {
        slideWindowRange, maxItemsCount,
        useVirtualizationScrolling, onScrollHandler
    }
}


export { applyVirtualization, getExpanderRow }
export type { SlideWindowRange }