import React from 'react'

import type { TableTH } from '../../Table/types'
import type { MergedProps, DisplayedEntityIDs, State } from '../types'

import styles from '../styles.sass'


const passiveEv = { passive: true }

const toPercentWidth = (allWidth: number, width: number) => (
    +((100 / (allWidth / width)).toFixed(1))
)

function getColumnWidthParams(
    columnEl: HTMLTableCellElement,
    clientWidth: HTMLTableRowElement['clientWidth']
) {

    const {
        width, minWidth, maxWidth,
        paddingLeft, paddingRight,
        borderLeftWidth, borderRightWidth
    } = getComputedStyle(columnEl)


    return {
        widthPercent: toPercentWidth(clientWidth, parseInt(width)),
        minWidth: toPercentWidth(
            clientWidth,
            parseInt(minWidth)
                +   parseInt(paddingLeft) + parseInt(paddingRight)
                +   parseInt(borderLeftWidth) + parseInt(borderRightWidth)
        ),
        maxWidth: toPercentWidth(clientWidth, parseInt(maxWidth)) || Infinity
    }
}

function getResizeHandler() {
    let mouseXAnchor: number | null,
        isLeftSide: ChildNode | null,
        headRow: HTMLTableRowElement | null,
        targetCell: HTMLTableCellElement | null,
        targetCellMinWidth: number | null,
        targetCellMaxWidth: number | null,
        targetCellWidthPercent: number | null,
        siblingCell: HTMLTableCellElement | null,
        siblingCellMinWidth: number | null,
        siblingCellMaxWidth: number | null,
        siblingCellWidthPercent: number | null


    function onMouseUp() {
        targetCell = targetCellWidthPercent = targetCellMinWidth
            = siblingCell = siblingCellWidthPercent = siblingCellMinWidth
            = mouseXAnchor = headRow = isLeftSide = null

        removeEventListener('mousemove', onMouseMove)
        removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!
        isLeftSide && (deltaX = -deltaX)

        const nextCurWidth = targetCellWidthPercent! + toPercentWidth(headRow!.clientWidth, deltaX)
        const nextSiblingWidth = siblingCellWidthPercent! - toPercentWidth(headRow!.clientWidth, deltaX)

        if (
            (siblingCellMinWidth! <= nextSiblingWidth && nextSiblingWidth <= siblingCellMaxWidth!)
                &&  (targetCellMinWidth! <= nextCurWidth && nextCurWidth <= targetCellMaxWidth!)
        ) {

            targetCell!.style.width = nextCurWidth + '%'
            siblingCell!.style.width = nextSiblingWidth + '%'
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
                widthPercent: targetCellWidthPercent,
                minWidth: targetCellMinWidth,
                maxWidth: targetCellMaxWidth
            } = getColumnWidthParams(targetCell, headRow.clientWidth))
            ;({
                widthPercent: siblingCellWidthPercent,
                minWidth: siblingCellMinWidth,
                maxWidth: siblingCellMaxWidth
            } = getColumnWidthParams(siblingCell, headRow.clientWidth))

            addEventListener('mousemove', onMouseMove, passiveEv)
            addEventListener('mouseup', onMouseUp, passiveEv)
        }
    }
}


function getHead(props: MergedProps, state: State, resultIDs: string[], from: number, to: number) {
    const { columnsConfig, resizable, theme, postProcessHeadRow, postProcessHeadCell } = props
    const { toggledColumns } = state

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

            if (resizable) {
                const resizeHandler = getResizeHandler()

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