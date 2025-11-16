import React from 'react'

import type { TableTH } from '../../Table/types'
import type { MergedProps, DisplayedEntityIDs, State } from '../types'

import styles from '../styles.sass'


type InnerResizeParams = Partial<Exclude<NonNullable<MergedProps['resizable']>, boolean>>


const passiveEv = { passive: true }

const toPercentWidth = (allWidth: number, width: number) => (
    +((100 / (allWidth / width)).toFixed(1))
)

function getColumnWidthParams(
    columnEl: HTMLTableCellElement,
    clientWidth: HTMLTableRowElement['clientWidth'],
    isPixelResize: InnerResizeParams['resizeInPixel']
) {

    const {
        width, minWidth, maxWidth,
        paddingLeft, paddingRight,
        borderLeftWidth, borderRightWidth
    } = getComputedStyle(columnEl)


    const widthInt = parseInt(width)
    const maxWidthInt = parseInt(maxWidth)
    const minWidthInt = parseInt(minWidth)
        +   parseInt(borderLeftWidth) + parseInt(borderRightWidth)
        +   parseInt(paddingLeft) + parseInt(paddingRight)

    const result = isPixelResize
        ?   {
                width: widthInt,
                maxWidth: maxWidthInt,
                minWidth: minWidthInt
            }
        :   {
                width: toPercentWidth(clientWidth, widthInt),
                maxWidth: toPercentWidth(clientWidth, maxWidthInt),
                minWidth: toPercentWidth(clientWidth, minWidthInt)
            }
    result.maxWidth || (result.maxWidth = Infinity)


    return result
}

function getResizeHandler(resizeParams: InnerResizeParams) {
    const { onCellResize, resizeInPixel } = resizeParams

    let mouseXAnchor: number | null,
        isLeftSide: ChildNode | null,
        headRow: HTMLTableRowElement | null,
        targetCell: HTMLTableCellElement | null,
        targetCellMinWidth: number | null,
        targetCellMaxWidth: number | null,
        targetCellWidth: number | null,
        siblingCell: HTMLTableCellElement | null,
        siblingCellMinWidth: number | null,
        siblingCellMaxWidth: number | null,
        siblingCellWidth: number | null


    function onMouseUp() {
        targetCell = targetCellWidth = targetCellMinWidth
            = siblingCell = siblingCellWidth = siblingCellMinWidth
            = mouseXAnchor = headRow = isLeftSide = null

        removeEventListener('mousemove', onMouseMove)
        removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!
        isLeftSide && (deltaX = -deltaX)

        onCellResize?.(e, targetCell!, siblingCell!, deltaX)

        if (!e.defaultPrevented) {
            const delta = resizeInPixel
                ?   deltaX
                :   toPercentWidth(headRow!.clientWidth, deltaX)

            const nextCurWidth = targetCellWidth! + delta
            const nextSiblingWidth = siblingCellWidth! - delta

            if (
                    (siblingCellMinWidth! <= nextSiblingWidth && nextSiblingWidth <= siblingCellMaxWidth!)
                &&  (targetCellMinWidth! <= nextCurWidth && nextCurWidth <= targetCellMaxWidth!)
            ) {

                const suffix = resizeInPixel ? 'px' : '%'

                targetCell!.style.width = nextCurWidth + suffix
                siblingCell!.style.width = nextSiblingWidth + suffix
            }
        }
    }


    return (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const resizerElement = e.currentTarget

        targetCell = resizerElement.parentElement as HTMLTableCellElement
        headRow = targetCell.parentElement as HTMLTableRowElement

        mouseXAnchor = e.nativeEvent.x
        isLeftSide = resizerElement.nextSibling

        siblingCell = (resizerElement.nextSibling as HTMLTableCellElement)
            ?   (targetCell.previousSibling as HTMLTableCellElement)
            :   (targetCell.nextSibling as HTMLTableCellElement)


        if (siblingCell) {
            ({
                width: targetCellWidth,
                minWidth: targetCellMinWidth,
                maxWidth: targetCellMaxWidth
            } = getColumnWidthParams(targetCell, headRow.clientWidth, resizeInPixel))
            ;({
                width: siblingCellWidth,
                minWidth: siblingCellMinWidth,
                maxWidth: siblingCellMaxWidth
            } = getColumnWidthParams(siblingCell, headRow.clientWidth, resizeInPixel))

            addEventListener('mousemove', onMouseMove, passiveEv)
            addEventListener('mouseup', onMouseUp, passiveEv)
        }
    }
}


function getHead(
    props: MergedProps,
    state: State,
    resultIDs: string[],
    from: number,
    to: number
) {

    const { columnsConfig, resizable, theme, postProcessHeadRow, postProcessHeadCell } = props
    const { toggledColumns } = state

    let resizeParams: InnerResizeParams = {}
    if (resizable) {
        typeof resizable == 'object'
            ?   (resizeParams = resizable)
            :   (resizeParams = {
                    enabled: true,
                    resizeInPixel: false
                })
    }


    let resizerClassName = styles.table_resizer
    theme.table_resizer && (resizerClassName += ` ${theme.table_resizer}`)


    let displayedEntityIDs: DisplayedEntityIDs
    ;(postProcessHeadCell || postProcessHeadRow) && (displayedEntityIDs = {
        from, to,
        allPagesIDs: resultIDs
    })

    const children: TableTH[] = []
    columnsConfig.forEach((columnConfig, i) => {
        const { label, ID } = columnConfig

        if (!toggledColumns.has(ID)) {
            const tableHeadCellToPush: TableTH = { value: label }
            postProcessHeadCell?.(tableHeadCellToPush, columnConfig, displayedEntityIDs!)

            if (resizeParams.enabled) {
                const resizeHandler = getResizeHandler(resizeParams)

                tableHeadCellToPush.value = <>
                    { !i || <div className={ resizerClassName } onMouseDown={ resizeHandler } /> }

                    { tableHeadCellToPush.value }

                    { i < columnsConfig.length - 1
                        &&  <div className={ resizerClassName } onMouseDown={ resizeHandler } /> }
                </>
            }

            children.push(tableHeadCellToPush)
        }
    })

    const result = [{ children }]
    postProcessHeadRow?.(result, displayedEntityIDs!)


    return result
}


export default getHead