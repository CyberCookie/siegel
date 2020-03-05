import React from 'react'

import deepGet from '../../../utils/deep_get'
import Checkbox from '../../Checkbox'

import styles from './styles'


function getBody(params) {
    let { state, setState, entities, columnsConfig, rowActions, withPagination } = params;
    let { byID, sorted } = entities;
    let { indexer, selectable, postProcessBodyRow } = rowActions;

    let { selected, showPerPage, currentPage } = state.bodyData;
    let { searchByField, sortByField } = state.headData;


    function selectItem(id) {
        if (selected.has(id)) {
            selected.delete(id)
            state.headData.isAllSelected = false;
        } else {
            selected.add(id)
        }
        
        setState({ ...state })
    }

    function getEntityRow(entityID, i) {
        let entity = byID[entityID]
        let children = indexer ? [{ value: i + 1 }] : []

        
        let isSelected;
        if (selectable) {
            isSelected = selected.has(entityID)
            children.push({
                value: <Checkbox value={isSelected} onChange={() => selectItem(entityID)} />
            })
        }

        columnsConfig.forEach(configurationModel => {
            let { showValue, entityFieldPath } = configurationModel;
            
            let value = showValue
                ?   configurationModel.showValue(entity, i) //must not deattach showValue to keep `this`
                :   Array.isArray(entityFieldPath)
                    ?   deepGet(entity, entityFieldPath)
                    :   entity[entityFieldPath];


            children.push({ value })
        })


        let result = {
            children,
            attributes: { key: entityID }
        }
        isSelected && (result.attributes.className = styles.row_selected)
        

        return result
    }

    
    let processedList = [...sorted]
    for (let configurationIndex in searchByField) {
        let { onFilter, entityFieldPath, type, typeOptions } = columnsConfig[configurationIndex]
        let searchString = searchByField[configurationIndex]
        
        processedList = onFilter
            ?   columnsConfig[configurationIndex].onFilter(processedList, byID, searchString)

            :   processedList.filter(itemID => {
                    let valueToFilter = Array.isArray(entityFieldPath)
                        ?   deepGet(byID[itemID], entityFieldPath)
                        :   byID[itemID][entityFieldPath];
                    
                    if (type == 'set') {
                        if (typeOptions && typeOptions.putSetValue) {
                            valueToFilter = typeOptions.putSetValue(valueToFilter)
                        }
                        
                        return !searchString.has(valueToFilter)
                    } else if (type == 'date') {
                        let { dateStart, dateEnd } = searchString;
                        let timestamp = valueToFilter
                            ?   (new Date(valueToFilter)).getTime()
                            :   Date.now();

                        return dateStart <= timestamp && timestamp < dateEnd
                    } else {
                        return valueToFilter === null || valueToFilter === undefined
                            ?   false
                            :   valueToFilter.toString().toLowerCase().includes(searchString)
                    }
                })
    }


    if (sortByField.value) {
        let { value, index } = sortByField;
        let { onSort, entityFieldPath } = columnsConfig[index]

        const defaultSort = (IDa, IDb) => {
            let isNextBigger = Array.isArray(entityFieldPath)
                ?   deepGet(byID[IDa], entityFieldPath) < deepGet(byID[IDb], entityFieldPath)
                :   byID[IDa][entityFieldPath] < byID[IDb][entityFieldPath];
            
            return isNextBigger ? value : -value
        }

        processedList = onSort
            // must not deattach onSort to keep `this`
            ?   columnsConfig[index].onSort(processedList, byID, value)
            :   processedList.sort(defaultSort)
    }


    let from, to;
    if (withPagination) {
        from = (currentPage - 1) * showPerPage;
        to = from + showPerPage
    } else {
        from = 0;
        to = processedList.length
    }

    
    let resultList = []
    for (let i = from; i < to; i++) {
        let entityID = processedList[i]
        if (!entityID) break;

        let itemToPush = getEntityRow(entityID, i)
        postProcessBodyRow && (itemToPush = postProcessBodyRow(itemToPush, byID[entityID]))

        resultList.push(itemToPush)
    }
    

    return {
        body: resultList,
        resultIDs: processedList
    }
}


export default getBody