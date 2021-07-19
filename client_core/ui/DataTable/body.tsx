import isE from '../../utils/is_exists'
import type { MergedProps, State } from './types'
import type { TableBodyRow } from '../Table/types'


function getBody(props: MergedProps, state: State) {
    const { entities, columnsConfig, postProcessBodyRow, withPagination } = props
    const { byID, sorted } = entities.raw()

    const { searchByField, sortByField, showPerPage, currentPage } = state


    let processedList = sorted
    for (const configurationIndex in searchByField) {
        const config = columnsConfig[+configurationIndex]
        const { onFilter } = config

        if (isE(onFilter)) {
            processedList = config.onFilter!(processedList, byID, searchByField[configurationIndex]) // must not deattach onFilter to keep `this`
        }
    }


    if (sortByField.value) {
        const { value, index } = sortByField
        const config = columnsConfig[index]
        const { onSort } = config

        if (isE(onSort)) {
            processedList = config.onSort!(processedList.slice(), byID, value) // must not deattach onSort to keep `this`
        }
    }


    let from: number, to: number
    if (withPagination) {
        const maxPages = Math.ceil(processedList.length / showPerPage) || 1
        currentPage > maxPages && (state.currentPage = maxPages)

        from = (state.currentPage - 1) * showPerPage
        to = from + showPerPage
    } else {
        from = 0
        to = processedList.length
    }


    const resultList: TableBodyRow[] = []
    for (let i = from; i < to; i++) {
        const entityID = processedList[i]
        if (!isE(entityID)) break

        const entity = byID[entityID]

        const itemToPush = [{
            children: columnsConfig.map(configurationModel => (
                configurationModel.showValue(entity, i) // must not deattach showValue to keep `this`
            )),
            attributes: { key: entityID }
        }]

        postProcessBodyRow && (postProcessBodyRow(itemToPush, entity, i))

        itemToPush.length > 1
            ?   itemToPush.forEach(item => { resultList.push(item) })
            :   resultList.push(itemToPush[0])
    }


    return {
        from, to,
        resultIDs: processedList,
        body: resultList
    }
}


export default getBody