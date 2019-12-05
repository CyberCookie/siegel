import React from 'react'

import { cx, deepGet, deepSet } from 'core/utils'

import { Select, Checkbox, Input, Calendar } from 'app/components/theme'

import iconStyles from 'app/styles/icons'
import styles from './styles'


export default ({ state, setState, entities, configuration, rowActions }) => {
    let { sortByField, searchByField, isAllSelected, showCalendar } = state.headData;
    
    let result = [
        { children: [{ value: '' }] },
        { children: [{ value: '' }] }
    ]
    
    // if (extra.selectable) {
    //     function selectAll() {
    //         let _isAllSelected = !isAllSelected;
    
    //         function updateSelection(item) {
    //             _isAllSelected
    //                 ?   selected.add(item)
    //                 :   selected.delete(item)
    //         }
            
    //         state.headData.isAllSelected = _isAllSelected;
    //         dataSorted.forEach(updateSelection)
    
    //         setState({ ...state })
    //     }

    //     result[0].children.push({ value: '' })
    //     result[1].children.push({ value: (
    //         <Checkbox value={isAllSelected} onChange={selectAll} />
    //     )})
    // }

    
    function pushToResult({ entityFieldPath, label, sortable, type, typeOptions }, configurationIndex) {
        let nameCell;
        let nameCellLabel = label || entityFieldPath;
        
        if (sortable) {
            let sortableFieldInState = sortByField.index == configurationIndex;
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

            
            nameCell = {
                value: <>{nameCellLabel}<i className={iconClassName}/></>,
                attributes: {
                    onMouseDown: onSort,
                    className: cx(styles.sortable_field, {
                        [styles.sort_active]: sortableFieldInState,
                        [styles.sort_asc]: curSortableFieldValue == 1
                    })
                }
            }
        } else {
            nameCell = { value: nameCellLabel }
        }
        
        result[0].children.push(nameCell)
        


        let searchField = searchByField[configurationIndex];
        
        let filterCell;
        if (type == 'text') {
            function onFilter(value) {
                value === ''
                    ?   (delete state.headData.searchByField[configurationIndex])
                    :   (state.headData.searchByField[configurationIndex] = value)
                
                setState({ ...state })
            }

            filterCell = {
                value: (
                    <Input placeholder='Search...' value={searchField || ''}
                        onChange={onFilter} />
                )
            }
        } else if (type == 'date') {
            function onShowCalendar(e) {
                e.stopPropagation();

                state.headData.showCalendar = isCurrentFieldWithCalendar ? '' : configurationIndex;
                setState({ ...state })
            }

            function onDatePick({ rangeDateStart: dateStart, rangeDateEnd: dateEnd }) {
                state.headData.searchByField[configurationIndex] = { dateStart, dateEnd }
                setState({ ...state })
            }

            let isCurrentFieldWithCalendar = showCalendar == configurationIndex;
            let now = Date.now();
            

            filterCell = {
                value: <>
                    <Input placeholder='Search...' inputAttr={{ onMouseDown: onShowCalendar }} />
                    
                    <i className={iconStyles.date} />

                    { isCurrentFieldWithCalendar && (
                        <Calendar className={styles.calendar} onDateRangePick={onDatePick}
                            activeDate={{
                                rangeDateStart: searchField ? searchField.dateStart : now,
                                rangeDateEnd: searchField ? searchField.dateEnd : now
                            }} />
                    )}
                </>,
                attributes: { className: styles.calendar_field }
            }
        } else if (type == 'set') {
            function addOption({ value, title, defaultValue }, i) {
                selectAttributes.options[i] = {
                    data: value,
                    title: <>
                        {title}
                        <Checkbox className={styles.select_checkbox}
                            value={searchField ? searchField.has(value) : defaultValue} />
                    </>
                }
            }

            function onSelect(_, value) {
                if (searchField) {
                    searchField.has(value)
                        ?   state.headData.searchByField[configurationIndex].delete(value)
                        :   state.headData.searchByField[configurationIndex].add(value)
                } else {
                    state.headData.searchByField[configurationIndex] = new Set([ !value ]);
                }
    
                setState({ ...state })
            }

            let selectAttributes = {
                onSelect,
                value: { title: 'Search' },
                closeOnSelect: false,
                className: styles.select,
                options: {}
            }

            typeOptions.filterOptions.forEach(addOption)
            
            filterCell = { value: <Select {...selectAttributes} />}
        }
    
        result[1].children.push(filterCell)
    }
    
    configuration.forEach(pushToResult)
    if (rowActions.onEdit) {
        result[0].children.push({ value: 'Edit' })
        result[1].children.push({ value: '' })
    }


    return result
}