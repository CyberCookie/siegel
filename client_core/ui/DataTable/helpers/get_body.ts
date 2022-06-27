import isExists from 'siegel-utils/is/exists'
import type { TableBodyRow, TableTD } from '../../Table/types'
import type { SlideWindowRange } from '../helpers/apply_virtualization'
import type { MergedProps, State, SortState } from '../types'


function getBody(
    props: MergedProps,
    state: State,
    slideWindowRange: SlideWindowRange | undefined
) {

    const { entities, columnsConfig, postProcessBodyRow, withFooter } = props
    const { byID, sorted } = entities.raw()

    const { searchByField, sortByField, toggledColumns, showPerPage, currentPage } = state


    let idToIndexMap: Record<string, number>
    let processedList = sorted
    for (const configurationID in searchByField) {
        if (!idToIndexMap!) {
            idToIndexMap = {}
            columnsConfig.forEach(({ ID }, index) => {
                idToIndexMap[ ID ] = index
            })
        }

        const config = columnsConfig[ idToIndexMap[configurationID] ]
        const { onFilter } = config

        if (isExists(onFilter)) {
            processedList = config.onFilter!(processedList, byID, searchByField[configurationID]) // must not deattach onFilter to keep `this`
        }
    }


    if ((sortByField as SortState).value) {
        const { value, ID } = sortByField as SortState
        const columnIndex = idToIndexMap!
            ?   idToIndexMap[ ID ]
            :   columnsConfig.findIndex(config => config.ID == ID)

        const config = columnsConfig[columnIndex]
        const { onSort } = config

        if (isExists(onSort)) {
            processedList = config.onSort!(processedList.slice(), byID, value) // must not deattach onSort to keep `this`
        }
    }


    const maxLength = processedList.length

    let from: number, to: number
    if (withFooter) {
        const maxPages = Math.ceil(maxLength / showPerPage) || 1
        currentPage > maxPages && (state.currentPage = maxPages)

        from = (currentPage - 1) * showPerPage
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


    const resultList: TableBodyRow[] = []
    for (let i = from; i < to; i++) {
        const entityID = processedList[i]
        const entity = byID[entityID]

        const rowChildren: TableTD[] = []
        columnsConfig.forEach(configurationModel => {
            if (!toggledColumns.has(configurationModel.ID)) {
                rowChildren.push(
                    configurationModel.showValue(entity, i) // must not deattach showValue to keep `this`
                )
            }
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
        from, to,
        resultIDs: processedList,
        body: resultList
    }
}


export default getBody