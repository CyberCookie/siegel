import isExists from '../../../../common/is/exists'

import type { TableBodyRow, TableTD } from '../../Table/types'
import type { SlideWindowRange } from '../helpers/apply_virtualization'
import type { MergedProps, State } from '../types'


function getBody(
    props: MergedProps,
    state: State,
    slideWindowRange: SlideWindowRange | undefined
) {

    const {
        entities: { byID, sorted },
        pinnedEntities, columnsConfig, postProcessBodyRow, withFooter
    } = props
    let pinnedEntitiesSorted = pinnedEntities?.sorted

    const { searchByField, sortByField, toggledColumns, showPerPage, currentPage } = state


    let idToIndexMap: Indexable<number>
    let processedList = sorted
    for (const configurationID in searchByField) {
        if (!idToIndexMap!) {
            idToIndexMap = {}
            columnsConfig.forEach(({ ID }, index) => {
                idToIndexMap[ ID ] = index
            })
        }

        const config = columnsConfig[ idToIndexMap[configurationID] ]
        if (isExists(config.onFilter)) {
            // leave attached to config to keep 'this'
            processedList = config.onFilter(processedList, byID, searchByField[configurationID])
        }
    }


    if (isExists(sortByField.ID)) {
        const { value, ID } = sortByField
        const columnIndex = idToIndexMap!
            ?   idToIndexMap[ ID ]
            :   columnsConfig.findIndex(config => config.ID == ID)

        const config = columnsConfig[columnIndex]
        if (isExists(config.onSort)) {
            // leave attached to config to keep 'this'
            processedList = config.onSort(processedList.slice(), byID, value)

            pinnedEntitiesSorted &&= config.onSort(
                pinnedEntitiesSorted.slice(),
                pinnedEntities!.byID,
                value
            )
        }
    }



    const maxLength = processedList.length

    let from: number, to: number
    if (withFooter) {
        const maxPages = Math.ceil(maxLength / showPerPage) || 1
        currentPage > maxPages && (state.currentPage = maxPages)

        from = (state.currentPage - 1) * showPerPage
        to = Math.min(from + showPerPage, maxLength)
        if (slideWindowRange) {
            from += slideWindowRange.from
            to = Math.min(to, from + (slideWindowRange.to - slideWindowRange.from))

        }
    } else {
        if (slideWindowRange) {
            from = slideWindowRange.from
            to = Math.min(slideWindowRange.to, maxLength)
        } else {
            from = 0
            to = maxLength
        }
    }


    let resultIDs: string[]
    if (pinnedEntitiesSorted?.length! > 0) {
        processedList = processedList
            .splice(0, from)
            .concat(pinnedEntitiesSorted!, processedList)

        resultIDs = Array.from(new Set(processedList))

        withFooter && (to += pinnedEntitiesSorted!.length)

    } else resultIDs = processedList


    const processedIDs = new Set<string>()
    const resultList: TableBodyRow[] = []
    for (let i = from; i < to; i++) {

        const entityID = processedList[i]
        if (processedIDs.has(entityID)) {
            to = Math.min(processedList.length, to + 1)
            continue

        } else processedIDs.add(entityID)


        const entity = byID[entityID]

        const rowChildren: TableTD[] = []
        columnsConfig.forEach(config => {
            toggledColumns.has(config.ID) || rowChildren.push(
                // leave attached to config to keep 'this'
                config.showValue(entity)
            )
        })

        const itemToPush = [{
            children: rowChildren,
            attributes: { key: entityID }
        }]

        postProcessBodyRow?.(itemToPush, entity, i)

        itemToPush.length > 1
            ?   itemToPush.forEach(item => { resultList.push(item) })
            :   resultList.push(itemToPush[0])
    }


    return {
        from, to, resultIDs,
        body: resultList
    }
}


export default getBody