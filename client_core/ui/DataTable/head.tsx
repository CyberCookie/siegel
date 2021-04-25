import React from 'react'

import componentID from './id'

import type { MergedProps, DisplayedEntityIDs } from './types'
import type { TableTH } from '../Table/types'

import styles from './styles.sass'


const innerResizerClassName = styles[componentID + '_inner_table_resizer']

const passiveEv = { passive: true }

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
        mouseXAnchor = targetColumn = currentWidth = siblingColumn = siblingWidth = isLeftSide = currentMinWidth = siblingMinWidth = null

        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!
        isLeftSide && (deltaX = -deltaX)

        const nextCurWidth = parseInt(currentWidth) + deltaX
        const nextSiblingWidth = parseInt(siblingWidth) - deltaX

        if ((!siblingMinWidth || nextSiblingWidth >= siblingMinWidth) && (!currentMinWidth || nextCurWidth >= currentMinWidth)) {
            siblingColumn!.style.width = nextSiblingWidth + 'px'
            targetColumn!.style.width = nextCurWidth + 'px'
        }
    }


    return function(e: React.MouseEvent<HTMLDivElement>) {
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
            const { width: _currentWidth, minWidth: _currentMinWidth } = window.getComputedStyle(targetColumn)
            currentWidth = parseInt(_currentWidth)
            currentMinWidth = parseInt(_currentMinWidth)

            const { width: _siblingWidth, minWidth: _siblingMinWidth } = window.getComputedStyle(siblingColumn)
            siblingWidth = parseInt(_siblingWidth)
            siblingMinWidth = parseInt(_siblingMinWidth)

            window.addEventListener('mousemove', onMouseMove, passiveEv)
            window.addEventListener('mouseup', onMouseUp, passiveEv)
        }
    }
}


function getHead(props: MergedProps, resultIDs: ID[], from: number, to: number) {
    const { columnsConfig, resizable, theme, postProcessHeadRow, postProcessHeadCell } = props

    const resizerClassName = `${innerResizerClassName} ${theme.table_resizer}`


    let displayedEntityIDs: DisplayedEntityIDs;
    (postProcessHeadCell || postProcessHeadRow) && (displayedEntityIDs = {
        from, to,
        allPagesIDs: resultIDs
    })

    const children: TableTH[] = []
    columnsConfig.forEach((columnConfig, configurationIndex: number) => {
        let nameCell = {
            value: columnConfig.label
        }
        postProcessHeadCell && (nameCell = postProcessHeadCell(nameCell, columnConfig, configurationIndex, displayedEntityIDs))


        if (resizable) {
            const resizeHandler = getResizeHandler()

            nameCell.value = <>
                <div className={resizerClassName} onMouseDown={resizeHandler} />

                { nameCell.value }

                <div className={resizerClassName} onMouseDown={resizeHandler} />
            </>
        }


        children.push(nameCell)
    })

    let result = [{ children }]
    postProcessHeadRow && (result = postProcessHeadRow(result, displayedEntityIDs))


    return result
}


export default getHead