import React from 'react'

import cx from '../../../utils/cx'
import Select from '../../Select'
import Checkbox from '../../Checkbox'
import Input from '../../Input'
import Calendar from '../../Calendar'

import iconStyles from 'app/components/icons/styles'
import s from './styles'


const passiveEv = { passive: true }

const findFilterable = config => config.filterable;


function getSortingLabel({ configurationIndex, state, setState, nameCellLabelText }) {
    let sortByField = state.headData.sortByField;
    let sortableFieldInState = sortByField.index === configurationIndex;
    let curSortableFieldValue = sortByField.value;


    function onSort() {
        if (sortableFieldInState) {
            curSortableFieldValue == 1 && (state.headData.sortByField = {
                index: '',
                value: ''
            })

            curSortableFieldValue == -1 && (state.headData.sortByField.value = 1)
        } else {
            state.headData.sortByField = {
                index: configurationIndex,
                value: -1,
            }
        }
        
        setState({ ...state })
    }

    let iconClassName = sortableFieldInState ? iconStyles.dropdown : iconStyles.sort;

    let labelClassName = cx(s.sortable_field, {
        [s.sort_active]: sortableFieldInState,
        [s.sort_asc]: curSortableFieldValue == 1
    })


    return (
        <div onMouseDown={onSort} className={labelClassName}>
            { nameCellLabelText }
            <i className={iconClassName} />
        </div>
    )
}



function getFilteringCell({ configurationIndex, state, setState, type, typeOptions }) {
    let searchField = state.headData.searchByField[configurationIndex]

    if (type == 'text') {
        function onFilter(value) {
            value === ''
                ?   (delete state.headData.searchByField[configurationIndex])
                :   (state.headData.searchByField[configurationIndex] = value.toLowerCase())
            
            setState({ ...state })
        }


        return {
            value: <Input placeholder='Search...' value={searchField || ''} onChange={onFilter} />
        }
    } else if (type == 'date') {
        let showCalendar = state.headData.showCalendar;

        function onShowCalendar(e) {
            e.stopPropagation()

            state.headData.showCalendar = isCurrentFieldWithCalendar ? '' : configurationIndex;
            setState({ ...state })
        }

        function onDatePick({ rangeDateStart: dateStart, rangeDateEnd: dateEnd }) {
            state.headData.searchByField[configurationIndex] = { dateStart, dateEnd }
            setState({ ...state })
        }

        let isCurrentFieldWithCalendar = showCalendar === configurationIndex;
        let now = Date.now();
        

        return {
            value: <>
                <Input placeholder='Search...' inputAttr={{ onMouseDown: onShowCalendar }}
                    extraContent={<i className={iconStyles.date} />} />

                { isCurrentFieldWithCalendar && (
                    <Calendar className={s.calendar} onChange={onDatePick}
                        activeDate={{
                            rangeDateStart: searchField ? searchField.dateStart : now,
                            rangeDateEnd: searchField ? searchField.dateEnd : now
                        }} />
                )}
            </>,
            attributes: { className: s.calendar_field }
        }
    } else if (type == 'set') {
        function onChange(_, value) {
            if (searchField) {
                searchField.has(value)
                    ?   state.headData.searchByField[configurationIndex].delete(value)
                    :   state.headData.searchByField[configurationIndex].add(value)
            } else {
                state.headData.searchByField[configurationIndex] = new Set([ !value ])
            }

            setState({ ...state })
        }

        let selectAttributes = {
            onChange,
            value: 'Search',
            closeOnSelect: false,
            className: s.select,
            options: {}
        }


        typeOptions.filterOptions.forEach(({ value, title, defaultValue }, i) => {
            selectAttributes.options[i] = {
                data: value,
                title: <>
                    {title}
                    <Checkbox className={s.select_checkbox}
                        value={searchField ? searchField.has(value) : defaultValue} />
                </>
            }
        })
        
        return { value: <Select {...selectAttributes} />}
    }
}


function getResizeHandler() {
    let mouseXAnchor, isLeftSide,
        targetColumn, currentWidth, currentMinWidth,
        siblingColumn, siblingWidth, siblingMinWidth;


    function onMouseUp() {
        mouseXAnchor = targetColumn = currentWidth = siblingColumn = siblingWidth = isLeftSide = currentMinWidth = siblingMinWidth = null;

        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e) {
        let deltaX = e.x - mouseXAnchor;
        isLeftSide && (deltaX = -deltaX)

        let nextCurWidth = parseInt(currentWidth) + deltaX;
        let nextSiblingWidth = parseInt(siblingWidth) - deltaX;
        
        if ((!siblingMinWidth || nextSiblingWidth >= siblingMinWidth) && (!currentMinWidth || nextCurWidth >= currentMinWidth)) {
            siblingColumn.style.width = nextSiblingWidth + 'px'
            targetColumn.style.width = nextCurWidth + 'px'
        }
    }


    return function(e) {
        e.preventDefault()
        e.stopPropagation()

        mouseXAnchor = e.nativeEvent.x;
        isLeftSide = e.target.dataset.resizer == 'left'

        targetColumn = e.target.parentElement;
        
        siblingColumn = isLeftSide
            ?   targetColumn.previousSibling
            :   targetColumn.nextSibling;
        
        
        if (siblingColumn) {
            let { width: _currentWidth, minWidth: _currentMinWidth } = window.getComputedStyle(targetColumn)
            currentWidth = parseInt(_currentWidth)
            currentMinWidth = parseInt(_currentMinWidth)

            let { width: _siblingWidth, minWidth: _siblingMinWidth } = window.getComputedStyle(siblingColumn)
            siblingWidth = parseInt(_siblingWidth)
            siblingMinWidth = parseInt(_siblingMinWidth)

            window.addEventListener('mousemove', onMouseMove, passiveEv)
            window.addEventListener('mouseup', onMouseUp, passiveEv)        
        }
    }
}


function getHead(params, resultIDs) {
    let { state, setState, entities, columnsConfig, rowActions } = params;
    let { onEdit, selectable, indexer, resizable, postProcessHeadRow, postProcessHeadCell } = rowActions;
    let hasFilterable = columnsConfig.find(findFilterable)
    
    let result = [{ children: [] }]
    
    indexer && result[0].children.push({ value: '' })
    
    hasFilterable && (result[1] = {
        children: indexer ? [{ value: '' }] : []
    })
    
    
    if (selectable) {
        let { selected, showPerPage, currentPage } = state.bodyData;
        let isAllSelected = state.headData.isAllSelected;

        function selectAll() {
            state.bodyData.selected = state.headData.isAllSelected
                ?   new Set()
                :   new Set(resultIDs)

            state.headData.isAllSelected = !state.headData.isAllSelected

            // let _isAllSelected = !isAllSelected;

            // let endOfPage = currentPage * showPerPage;
            // let endOfDisplayedList = Math.min(endOfPage, entities.sorted.length);

            // state.headData.isAllSelected = _isAllSelected;


            // for (let i = endOfPage - showPerPage; i < endOfDisplayedList; i++) {
            //     let item = entities.sorted[i]

            //     _isAllSelected
            //         ?   selected.add(item)
            //         :   selected.delete(item)
            // }

            setState({ ...state })
        }

        let checkboxCell = { value: <Checkbox value={isAllSelected} onChange={selectAll} className={s.checkbox} /> }

        if (hasFilterable) {
            result[0].children.push({ value: '' })
            result[1].children.push(checkboxCell)
        } else {
            result[0].children.push(checkboxCell)
        }
    }


    columnsConfig.forEach((columnConfig, configurationIndex) => {
        let { entityFieldPath, label, sortable, filterable, type, typeOptions } = columnConfig;
    
        let nameCellLabelText = label || entityFieldPath;
        postProcessHeadCell && (nameCellLabelText = postProcessHeadCell(nameCellLabelText, columnConfig, configurationIndex))
    
        let nameCell = {
            value: sortable
                ?   getSortingLabel({ configurationIndex, state, setState, nameCellLabelText })
                :   nameCellLabelText
        }
    
    
        if (resizable) {
            let resizeHandler = getResizeHandler()
    
            nameCell.value = (
                <>
                    <div className={s.resizer} onMouseDown={resizeHandler} data-resizer='left' />
                    { nameCell.value }
                    <div className={s.resizer} onMouseDown={resizeHandler} data-resizer='right' />
                </>
            )
        }
    
        
        result[0].children.push(nameCell)
        
        if (hasFilterable) {
            let filteringCell = filterable
                ?   getFilteringCell({ configurationIndex, state, setState, type, typeOptions })
                :   { value: '' };
            
            result[1].children.push(filteringCell)
        }
    })


    if (onEdit) {
        result[0].children.push({ value: 'Edit' })
        hasFilterable && result[1].children.push({ value: '' })
    }


    if (postProcessHeadRow) {
        result[0] = postProcessHeadRow(result[0])
        hasFilterable && (result[1] = postProcessHeadRow(result[1]))
    }


    return result
}


export default getHead