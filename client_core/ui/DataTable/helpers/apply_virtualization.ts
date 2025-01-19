import { useLayoutEffect, useState, useRef } from 'react'

import isExists from '../../../../common/is/exists'

import type {
    Ref, ScrollTopState, SlideWindowRange, GetWindowSlideRanges,
    UseVirtualizationParams, VirtualizationMergedProps
} from './apply_virtualization_types'


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

const parsePixelValue = (value: string) => +value.replace('px', '')

function adjustHeaderTopPositon(rootElement: HTMLDivElement, virtualizationState: ScrollTopState) {
    const { firstChild, scrollTop } = rootElement
    const {
        tBodies,
        style: { paddingTop }
    } = firstChild as HTMLTableElement

    const { prevHeadAdjustment, prevScrollTop } = virtualizationState


    const isScrollUp = scrollTop < prevScrollTop
    virtualizationState.prevScrollTop = scrollTop

    const contentTopPos = parsePixelValue(paddingTop)
    const contentBottomPos = contentTopPos + tBodies[0].clientHeight

    const scrollDiffAdjust = prevHeadAdjustment.value! - (prevHeadAdjustment.scrollTop! - scrollTop)
    const scrollDiffContentTop = scrollTop - contentTopPos
    const scrollDiffContentBottom = scrollTop - contentBottomPos

    const isScrollBelowContent = scrollTop > contentBottomPos
    const isScrollAboveContent = scrollTop < contentTopPos

    const isSameScrollDirection = prevHeadAdjustment.isScrollUp == isScrollUp
    const isSameScrollBelowContent = isSameScrollDirection && isScrollBelowContent
    const isSameScrollAboveContent = isSameScrollDirection && isScrollAboveContent


    let theadPositionAdjust = isScrollUp
        ?   prevHeadAdjustment.isScrollUp
            ?   isSameScrollBelowContent
                ?   scrollDiffContentBottom
                :   Math.min(scrollDiffContentTop, 0)
            :   isScrollAboveContent
                ?   scrollDiffContentTop
                :   Math.max(scrollDiffAdjust, 0)
        :   prevHeadAdjustment.isScrollUp
            ?   isScrollBelowContent
                ?   scrollDiffContentBottom
                :   Math.min(scrollDiffAdjust, 0)
            :   isSameScrollAboveContent
                ?   scrollDiffContentTop
                :   Math.max(scrollDiffContentBottom, 0)

    isNaN(theadPositionAdjust) && (theadPositionAdjust = 0)

    const isUpdate =
        ( isScrollUp
            ?   theadPositionAdjust <= 0 || isSameScrollBelowContent
            :   theadPositionAdjust >= 0 || isSameScrollAboveContent )
        ||  !isSameScrollDirection

    if (isUpdate) {
        virtualizationState.prevHeadAdjustment = {
            scrollTop,
            isScrollUp: isExists(prevHeadAdjustment.isScrollUp)
                ?   prevHeadAdjustment.isScrollUp
                :   isScrollUp,
            value: theadPositionAdjust
        }

        rootElement.style.setProperty(
            '--data_table_virtualization_scrolltop',
            `${theadPositionAdjust}px`
        )
    }
}

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
                scrollUpdateInterval = 350,
                tableHeight = innerHeight
            }
        }
    } = params as VirtualizationMergedProps


    rootAttributes.ref = useRef(null)

    const [ virtualizationState, setVirtualizationState ] = useState<ScrollTopState>( getDefaultState() )
    const { scrollTop } = virtualizationState


    const maxItemsCount = withFooter
        ?   Math.min(showPerPage, sorted.length)
        :   sorted.length

    const slideWindowRange = getWindowSlideRanges({
        scrollTop, itemHeight, tableHeight, preloadedItemsBySide, maxItemsCount
    })


    function onScrollHandler(e: React.UIEvent<HTMLDivElement, UIEvent>) {
        onScroll?.(e)

        if (!e.defaultPrevented) {
            const rootElement = e.target as HTMLDivElement
            const tableElement = rootElement.firstChild as HTMLTableElement

            const isStickyHeader = getComputedStyle(tableElement.tHead!.rows[0].cells[0])
                .position == 'sticky'
            isStickyHeader && adjustHeaderTopPositon(rootElement, virtualizationState)

            if (!virtualizationState.timeoutID) {
                virtualizationState.timeoutID = (setTimeout as Window['setTimeout'])(() => {
                    const newScrollTopState = getDefaultState()
                    newScrollTopState.scrollTop = newScrollTopState.prevScrollTop = rootElement.scrollTop

                    setVirtualizationState(newScrollTopState)
                }, scrollUpdateInterval)
            }
        }
    }


    function useVirtualizationScrolling(newMaxItemsCount: number) {
        useLayoutEffect(() => {
            const { from, to } = getWindowSlideRanges({
                itemHeight, preloadedItemsBySide, scrollTop, tableHeight,
                maxItemsCount: newMaxItemsCount
            })

            const rootElement = (rootAttributes.ref as Ref).current!
            const tableElement = rootElement.firstChild as HTMLTableElement
            tableElement.style.padding = `${from * itemHeight}px 0 ${(newMaxItemsCount - to) * itemHeight}px`

            rootElement.style.setProperty('--data_table_virtualization_scrolltop', '0px')


            return () => {
                clearTimeout(virtualizationState.timeoutID)
            }
        }, [ scrollTop, showPerPage, newMaxItemsCount ])
    }


    return { slideWindowRange, maxItemsCount, useVirtualizationScrolling, onScrollHandler }
}


export { applyVirtualization }
export type { SlideWindowRange }