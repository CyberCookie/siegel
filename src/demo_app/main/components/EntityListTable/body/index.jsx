import React from 'react'

import { deepClone, deepGet } from 'core/utils'

import iconStyles from 'app/styles/icons'
import styles from './styles'


export default ({ state, setState, entities, configuration, rowActions }) => {
    let { byID, sorted } = entities;

    let { selected, updatedFieldsByID, selectedToEdit, showPerPage, currentPage } = state.bodyData;
    let { searchByField, sortByField } = state.headData;


    // function selectItem(id) {
    //     if (selected.has(id)) {
    //         selected.delete(id)
    //         state.headData.isAllSelected = false;
    //     } else {
    //         selected.add(id)
    //     }
        
    //     setState({ ...state })
    // }

    function getEntityRow(entityID, i) {
        let entity = byID[entityID];

        function pushToRow(configurationModel) {
            let { showValue, entityFieldPath, type, editable } = configurationModel;
            
            let value = showValue
                ?   configurationModel.showValue(entity) //if call showValue() then `this` is undefined.
                :   Array.isArray(entityFieldPath)
                    ?   deepGet(entity, entityFieldPath)
                    :   entity[entityFieldPath];


            let cell = { value };
            if (type == 'text' && editable) {
                // inline edit

                // function onClickToEdit(e) {
                //     e.stopPropagation()
                //     let bodyData = state.bodyData;
                //     bodyData.selectedToEdit = {
                //         id: item.id,
                //         fieldName: field
                //     }
    
                //     setState({ ...state })
                // }

                // cell.attributes = { onMouseDown: onClickToEdit }
                

                // if (item.id == selectedToEdit.id && selectedToEdit.fieldName == field) {
                //     function onEditAction(e) {
                //         e.stopPropagation()
                //         let { action_ok, action_cancel } = e.target.dataset;

                //         if (action_ok) {
                //             console.log('ok')
                //             state.bodyData.selectedToEdit.id = ''
                //             setState({ ...state })
                //         }
                //     }

                //     function onInputChange(value) {
                //         let itemToUpdate = data.find(_item => _item.id == item.id)
                //         itemToUpdate[field] = value
    
                //         setState({ ...state })
                //     }

                //     cell.value = (
                //         <div className={styles.input_wrapper} onMouseDown={onEditAction}>
                //             <Input value={item[field]} autofocus onChange={onInputChange} />
    
                //             <i className={`${iconStyles.ok} ${entityTableStyles.ok}`} data-action_ok />
                //             <i className={`${iconStyles.cancel} ${entityTableStyles.cancel}`} data-action_cancel />
                //         </div>
                //     )
                // }
            } else if (type == 'date') {
                cell.attributes = { className: styles.date_cell }
            }

            children.push(cell)
        }
        

        let children = [{ value: i + 1 }]
        // let isSelected;
        // if (extra.selectable) {
        //     isSelected = selected.has(entityID);
        //     children.push(
        //         <Checkbox value={isSelected} onChange={() => selectItem(entityID)} />
        //     )
        // }
        configuration.forEach(pushToRow)


        if (rowActions.onEdit) {
            children.push({
                value: <i className={iconStyles.edit} />,
                attributes: {
                    onMouseDown: () => rowActions.onEdit(deepClone(entity)),
                    className: styles.edit_cell
                }
            })
        }

        let result = {
            children,
            attributes: { key: entityID }
        };
        // isSelected && (result.attributes.className = styles.row_selected)
        

        return result
    }

    
    let processedList = sorted;
    for (let configurationIndex in searchByField) {
        let { onFilter, entityFieldPath } = configuration[configurationIndex];
        let searchString = searchByField[configurationIndex];

        const defaultFilter = itemID => {
            let valueToFilter = Array.isArray(entityFieldPath)
                ?   deepGet(byID[itemID], entityFieldPath)
                :   byID[itemID][entityFieldPath];

            return valueToFilter.toString().toLowerCase().includes(searchString)
        };
        
        processedList = onFilter
            //why not onFiler()? weird bug see showValue() ^
            ?   configuration[configurationIndex].onFilter(processedList, byID, searchString)
            :   processedList.filter(defaultFilter)
    }


    if (sortByField.value) {
        let { value, index } = sortByField;
        let { onSort, entityFieldPath } = configuration[index];

        const defaultSort = (IDa, IDb) => {
            let isNextBigger = Array.isArray(entityFieldPath)
                ?   deepGet(byID[IDa], entityFieldPath) < deepGet(byID[IDb], entityFieldPath)
                :   byID[IDa][entityFieldPath] < byID[IDb][entityFieldPath];
            
            return isNextBigger ? value : -value;
        };

        processedList = onSort
            //why not onSort()? weird bug see showValue() ^
            ?   configuration[index].onSort(processedList, byID, value)
            :   processedList.sort(defaultSort)
    }


    let from = (currentPage - 1) * showPerPage;
    let to = from + showPerPage;
    let resultList = [];
    for (let i = from; i < to; i++) {
        let entityID = processedList[i];
        if (!entityID) break;

        let itemToPush = getEntityRow(entityID, i)
        resultList.push(itemToPush)
    }


    return {
        body: resultList,
        allBodyLength: processedList.length
    }
}