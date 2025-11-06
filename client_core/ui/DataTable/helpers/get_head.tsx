import React from 'react'

import type { TableTH } from '../../Table/types'
import type { MergedProps, DisplayedEntityIDs, State } from '../types'

import styles from '../styles.sass'


const passiveEv = { passive: true }

const toPercentWidth = (allWidth: number, width: number) => (
    +(100 / (allWidth / width))
)

function getColumnWidthParams(columnEl: HTMLTableCellElement, rowElement: HTMLTableRowElement) {
    const {
        width, minWidth, paddingLeft, paddingRight, borderLeftWidth, borderRightWidth
    } = getComputedStyle(columnEl)


    return {
        width: toPercentWidth(rowElement.clientWidth, parseInt(width)),
        minWidth: toPercentWidth(
            rowElement.clientWidth,
            parseInt(minWidth)
                +   parseInt(paddingLeft) + parseInt(paddingRight)
                +   parseInt(borderLeftWidth) + parseInt(borderRightWidth)
        )
    }
}

function getResizeHandler() {
    let mouseXAnchor: number | null,
        isLeftSide: ChildNode | null,
        targetHeadCell: HTMLTableCellElement | null,
        headRow: HTMLTableRowElement | null,
        currentWidth: number | null,
        currentMinWidth: number | null,
        siblingHeadCell: HTMLTableCellElement | null,
        siblingWidth: number | null,
        siblingMinWidth: number | null


    function onMouseUp() {
        mouseXAnchor = targetHeadCell = currentWidth = siblingHeadCell = siblingWidth = headRow
            = isLeftSide = currentMinWidth = siblingMinWidth = null

        removeEventListener('mousemove', onMouseMove)
        removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!
        isLeftSide && (deltaX = -deltaX)

        const nextCurWidth = currentWidth! + toPercentWidth(headRow!.clientWidth, deltaX)
        const nextSiblingWidth = siblingWidth! - toPercentWidth(headRow!.clientWidth, deltaX)

        if (
            (!siblingMinWidth || (nextSiblingWidth >= siblingMinWidth))
                &&  (!currentMinWidth || (nextCurWidth >= currentMinWidth))
        ) {

            siblingHeadCell!.style.width = nextSiblingWidth + '%'
            targetHeadCell!.style.width = nextCurWidth + '%'
        }
    }


    return (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const resizerElement = e.currentTarget

        targetHeadCell = resizerElement.parentElement as HTMLTableCellElement
        headRow = targetHeadCell.parentElement as HTMLTableRowElement

        mouseXAnchor = e.nativeEvent.x
        isLeftSide = resizerElement.nextSibling

        siblingHeadCell = (resizerElement.nextSibling as HTMLTableCellElement)
            ?   (targetHeadCell.previousSibling as HTMLTableCellElement)
            :   (targetHeadCell.nextSibling as HTMLTableCellElement)


        if (siblingHeadCell) {
            ({ width: currentWidth, minWidth: currentMinWidth } = getColumnWidthParams(targetHeadCell, headRow))
            ;({ width: siblingWidth, minWidth: siblingMinWidth } = getColumnWidthParams(siblingHeadCell, headRow))

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