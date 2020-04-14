import deepGet from '../../utils/deep/deep_get'
import isE from '../../utils/is_exists'
import { Props, DefaultProps, State } from './types'
import { TableTD, TableBodyRow } from '../Table/types'


function getBody(props: Props & DefaultProps, state: State) {
    const { entities, columnsConfig, postProcessBodyRow, pagination } = props;
    const { byID, sorted } = entities;

    const { showPerPage, currentPage } = state.bodyData;
    const { searchByField, sortByField } = state.headData;


    function getEntityRow(entityID: ID, i: number): TableBodyRow {
        const entity = byID[entityID]
        const children: TableTD[] = []


        columnsConfig.forEach(configurationModel => {
            const { showValue, entityFieldPath } = configurationModel;
            
            const value = isE(showValue)
                ?   configurationModel.showValue!(entity, i) //must not deattach showValue to keep `this`
                :   Array.isArray(entityFieldPath)
                    ?   deepGet(entity, entityFieldPath)
                    :   entity[entityFieldPath as NonNullable<typeof entityFieldPath>];


            children.push({ value })
        })


        const result = {
            children,
            attributes: { key: entityID }
        }
        

        return result
    }
    
    
    let processedList = sorted;
    for (const configurationIndex in searchByField) {
        const config = columnsConfig[configurationIndex]
        const { onFilter, entityFieldPath, type, putSetValue } = config;
        const searchString = searchByField[configurationIndex]
        
        processedList = isE(onFilter)
            ?   config.onFilter!(processedList, byID, searchString) // must not deattach onSort to keep `this`

            :   processedList.filter(itemID => {
                    let valueToFilter = Array.isArray(entityFieldPath)
                        ?   deepGet(byID[itemID], entityFieldPath)
                        :   byID[itemID][entityFieldPath as NonNullable<typeof entityFieldPath>];
                    
                    if (type == 'set') {
                        putSetValue && (valueToFilter = config.putSetValue!(valueToFilter))
                        
                        return !searchString.has(valueToFilter)
                    } else if (type == 'date') {
                        const { dateStart, dateEnd } = searchString;
                        const timestamp = valueToFilter
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
        processedList = [ ...processedList ]
        
        const { value, index } = sortByField;
        const config = columnsConfig[index]
        const { onSort, entityFieldPath } = config;

        type EntityField = typeof entityFieldPath;
        type EntityFieldString = NonNullable<Exclude<EntityField, string[]>>;

        processedList = isE(onSort)
            ?   config.onSort!(processedList, byID, value) // must not deattach onSort to keep `this`
            
            :   processedList.sort((IDa: ID, IDb: ID) => {
                    const isNextBigger = Array.isArray(entityFieldPath)
                        ?   deepGet(byID[IDa], entityFieldPath) < deepGet(byID[IDb], entityFieldPath)
                        :   byID[IDa][entityFieldPath as EntityFieldString] < byID[IDb][entityFieldPath as EntityFieldString];
                    
                    return isNextBigger ? value : -value
                })
    }


    let from, to;
    if (pagination) {
        from = (currentPage - 1) * showPerPage;
        to = from + showPerPage
    } else {
        from = 0;
        to = processedList.length
    }

    
    const resultList = []
    for (let i = from; i < to; i++) {
        const entityID = processedList[i]
        if (!entityID) break;

        let itemToPush = getEntityRow(entityID, i)
        postProcessBodyRow && (itemToPush = postProcessBodyRow(itemToPush, byID[entityID], i))

        resultList.push(itemToPush)
    }
    

    return {
        body: resultList,
        resultIDs: processedList
    }
}


export default getBody