import React from 'react'

import { Props, DefaultProps } from './types'
import { TableTH } from '../Table/types'

import s from './styles.sass'


const passiveEv = { passive: true }

function getResizeHandler() {
    let mouseXAnchor: number | null,
        isLeftSide: boolean | null,
        targetColumn: HTMLTableCellElement | null,
        currentWidth: number | null,
        currentMinWidth: number | null,
        siblingColumn: HTMLTableCellElement | null,
        siblingWidth: number | null,
        siblingMinWidth: number | null;


    function onMouseUp() {
        mouseXAnchor = targetColumn = currentWidth = siblingColumn = siblingWidth = isLeftSide = currentMinWidth = siblingMinWidth = null;

        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
        let deltaX = e.x - mouseXAnchor!;
        isLeftSide && (deltaX = -deltaX)

        const nextCurWidth = parseInt(currentWidth) + deltaX;
        const nextSiblingWidth = parseInt(siblingWidth) - deltaX;
        
        if ((!siblingMinWidth || nextSiblingWidth >= siblingMinWidth) && (!currentMinWidth || nextCurWidth >= currentMinWidth)) {
            siblingColumn!.style.width = nextSiblingWidth + 'px'
            targetColumn!.style.width = nextCurWidth + 'px'
        }
    }


    return function(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()

        mouseXAnchor = e.nativeEvent.x;

        targetColumn = ((e.target as HTMLDivElement).parentElement as HTMLTableCellElement);
        
        siblingColumn = ((e.target as HTMLDivElement).nextSibling as HTMLTableCellElement)
            ?   (targetColumn.previousSibling as HTMLTableCellElement)
            :   (targetColumn.nextSibling as HTMLTableCellElement);
        
        
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


function getHead(props: Props & DefaultProps, resultIDs: ID[]) {
    const { columnsConfig, resizable, theme, postProcessHeadRow, postProcessHeadCell } = props;

    let resizerClassName = s.resizer;
    resizerClassName && (resizerClassName += ` ${theme.table_resizer}`)


    const children: TableTH[] = []
    columnsConfig.forEach((columnConfig, configurationIndex: number) => {
        let nameCell = {
            value: columnConfig.label
        }
        postProcessHeadCell && (nameCell = postProcessHeadCell(nameCell, columnConfig, configurationIndex))
        
        
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
    postProcessHeadRow && (result = postProcessHeadRow(result, resultIDs))


    return result
}


export default getHead