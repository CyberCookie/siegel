import React from 'react'

import type { TableTH } from '../../Table/types'
import type { MergedProps, DisplayedEntityIDs, State } from '../types'

import styles from '../styles.sass'


const passiveEv = { passive: true }

function getColumnWidthParams(columnEl: HTMLTableCellElement) {
    const {
        width, minWidth, paddingLeft, paddingRight, borderLeftWidth, borderRightWidth
    } = getComputedStyle(columnEl)

    return {
        width: parseInt(width),
        minWidth: parseInt(minWidth) + parseInt(paddingLeft) + parseInt(paddingRight) + parseInt(borderLeftWidth) + parseInt(borderRightWidth)
    }
}

function getResizeHandler() {
    let mouseXAnchor: number | null,
        isLeftSide: ChildNode | null,
        targetColumn: HTMLTableCellElement | null,
        currentWidth: number | null,
        currentMinWidth: number | null,
        siblingColumn: HTMLTableCellElement | null,
        siblingWidth: number | null,
        siblingMinWidth: number | null


    function onMouseUp() {
        mouseXAnchor = targetColumn = currentWidth = siblingColumn = siblingWidth
            = isLeftSide = currentMinWidth = siblingMinWidth = null

        removeEventListener('mousemove', onMouseMove)
        removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!
        isLeftSide && (deltaX = -deltaX)

        const nextCurWidth = parseInt(currentWidth) + deltaX
        const nextSiblingWidth = parseInt(siblingWidth) - deltaX

        if ((!siblingMinWidth || (nextSiblingWidth >= siblingMinWidth)) && (!currentMinWidth || (nextCurWidth >= currentMinWidth))) {
            siblingColumn!.style.width = nextSiblingWidth + 'px'
            targetColumn!.style.width = nextCurWidth + 'px'
        }
    }


    return (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const resizerElement = e.currentTarget

        mouseXAnchor = e.nativeEvent.x
        targetColumn = resizerElement.parentElement as HTMLTableCellElement
        isLeftSide = resizerElement.nextSibling

        siblingColumn = (resizerElement.nextSibling as HTMLTableCellElement)
            ?   (targetColumn.previousSibling as HTMLTableCellElement)
            :   (targetColumn.nextSibling as HTMLTableCellElement)


        if (siblingColumn) {
            ({ width: currentWidth, minWidth: currentMinWidth } = getColumnWidthParams(targetColumn))
            ;({ width: siblingWidth, minWidth: siblingMinWidth } = getColumnWidthParams(siblingColumn))

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
    columnsConfig.forEach(columnConfig => {
        const { label, ID } = columnConfig

        if (!toggledColumns.has(ID)) {
            const tableHeadCellToPush: TableTH = { value: label }
            postProcessHeadCell?.(tableHeadCellToPush, columnConfig, displayedEntityIDs!)

            if (resizable) {
                const resizeHandler = getResizeHandler()

                tableHeadCellToPush.value = <>
                    <div className={ resizerClassName } onMouseDown={ resizeHandler } />

                    { tableHeadCellToPush.value }

                    <div className={ resizerClassName } onMouseDown={ resizeHandler } />
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