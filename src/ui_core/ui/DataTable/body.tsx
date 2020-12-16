import deepGet from '../../utils/deep/get'
import isE from '../../utils/is_exists'
import type { MergedProps, State, SearchByFieldDate, SearchByFieldSet } from './types'
import type { TableTD, TableBodyRow } from '../Table/types'


function getBody(props: MergedProps, state: State) {
    const { entities, columnsConfig, postProcessBodyRow, withPagination } = props;
    const { byID, sorted } = entities.raw();

    const { searchByField, sortByField, showPerPage, currentPage } = state;


    function getEntityRow(entityID: ID, i: number): TableBodyRow {
        const entity = byID[entityID]
        const children: TableTD[] = []


        columnsConfig.forEach(configurationModel => {
            const { showValue, entityFieldPath } = configurationModel;
            
            const value = isE(showValue)
                ?   configurationModel.showValue!(entity, i) //must not deattach showValue to keep `this`
                :   Array.isArray(entityFieldPath)
                    ?   deepGet(entity, entityFieldPath)
                    :   entity[entityFieldPath as NonNullable<typeof entityFieldPath>]


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
        let searchString = searchByField[configurationIndex]
        

        if (isE(onFilter)) {
            processedList = config.onFilter!(processedList, byID, searchString) // must not deattach onSort to keep `this`
        } else {
            const isArrayEntityFieldPath = Array.isArray(entityFieldPath)
            const isSet = type == 'set'
            
            let isText: boolean;
            if (isText = type == 'text') { searchString = (searchString as string).toLowerCase() }
            

            processedList = processedList.filter((itemID: ID) => {
                const entity = byID[itemID]

                let valueToFilter = isArrayEntityFieldPath
                    ?   deepGet(entity, entityFieldPath as string[])
                    :   entity[entityFieldPath as string]
                
                if (isSet) {
                    putSetValue && (valueToFilter = config.putSetValue!(entity))
                    
                    return !(searchString as SearchByFieldSet).has(valueToFilter)
                } else if (isText) {
                    return valueToFilter === null || valueToFilter === undefined
                        ?   false
                        :   valueToFilter.toString().toLowerCase().includes(searchString)
                    } else {
                        const { dateStart, dateEnd } = searchString as SearchByFieldDate;
                        const timestamp = valueToFilter
                            ?   (new Date(valueToFilter)).getTime()
                            :   Date.now()
    
                        return dateStart <= timestamp && timestamp < dateEnd
                    }
            })
        }
    }


    if (sortByField.value) {
        processedList = [ ...processedList ]
        
        const { value, index } = sortByField;
        const config = columnsConfig[index]
        const { onSort, entityFieldPath } = config;


        if (isE(onSort)) {
            processedList = config.onSort!(processedList, byID, value) // must not deattach onSort to keep `this`
        } else {
            const isArrayEntityFieldPath = Array.isArray(entityFieldPath)

            processedList = processedList.sort((IDa: ID, IDb: ID) => {
                const isNextBigger = isArrayEntityFieldPath
                    ?   deepGet(byID[IDa], entityFieldPath as string[]) < deepGet(byID[IDb], entityFieldPath as string[])
                    :   byID[IDa][entityFieldPath as string] < byID[IDb][entityFieldPath as string]
                
                return isNextBigger ? value : -value
            })
        }
    }


    let from, to;
    if (withPagination) {
        const maxPages = Math.ceil(processedList.length / showPerPage) || 1
        currentPage > maxPages && (state.currentPage = maxPages)

        from = (state.currentPage - 1) * showPerPage;
        to = from + showPerPage
    } else {
        from = 0;
        to = processedList.length
    }

    
    const resultList = []
    for (let i = from; i < to; i++) {
        const entityID = processedList[i]
        if (!isE(entityID)) break;

        let itemToPush = getEntityRow(entityID, i)
        postProcessBodyRow && (itemToPush = postProcessBodyRow(itemToPush, byID[entityID], i))

        resultList.push(itemToPush)
    }
    

    return {
        from, to,
        resultIDs: processedList,
        body: resultList
    }
}


export default getBody