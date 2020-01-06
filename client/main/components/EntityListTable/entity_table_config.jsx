import React from 'react'

import { parseISODate } from 'core/utils'

import { store as sportStore } from 'app/modules/dictionaries/sport'
import { store as countryStore } from 'app/modules/dictionaries/country'
import { store as leagueStore } from 'app/modules/dictionaries/league'
import { store as categoryParentStore } from 'app/modules/dictionaries/category'

import iconStyles from 'app/styles/icons'
import { icons } from 'app/components'
import listStyles from 'app/components/EntityListTable/styles'




const id = {
    entityFieldPath: 'id',
    type: 'text'
}

const code = {
    entityFieldPath: 'code',
    type: 'text'
}

const name = {
    entityFieldPath: 'name',
    type: 'text',
    sortable: true
}

const position = {
    entityFieldPath: 'position',
    type: 'text',
    sortable: true
}



function getEntityDate(entity) {
    let { year, month, date, hours, minutes, seconds } = parseISODate(entity[this.entityFieldPath], true)

    return <>
        {year}-{month}-{date} <span children={`${hours}:${minutes}:${seconds}`} />
    </>
}

function onDateEntityFilter(entitiesSorted, entitiesByID, filter) {
    let _self = this;

    function dateFilter(entityID) {
        let entity = entitiesByID[entityID]
        let { dateStart, dateEnd } = filter;
        let valueToFilter = entity[_self.entityFieldPath]
        let dateTimestamp = (new Date(valueToFilter)).getTime()
    
        return dateTimestamp >= dateStart && dateTimestamp <= dateEnd
    }

    return entitiesSorted.filter(dateFilter)
}

const created = {
    entityFieldPath: 'created',
    type: 'date',
    sortable: true,
    showValue: getEntityDate,
    onFilter: onDateEntityFilter
}

const updated = {
    entityFieldPath: 'updated',
    type: 'date',
    sortable: true,
    showValue: getEntityDate,
    onFilter: onDateEntityFilter
}

const startDate = {
    entityFieldPath: 'startDate',
    type: 'date',
    sortable: true,
    showValue: getEntityDate,
    onFilter: onDateEntityFilter
}

const endDate = {
    entityFieldPath: 'endDate',
    type: 'date',
    sortable: true,
    showValue: getEntityDate,
    onFilter: onDateEntityFilter
}



function getDeletedEntityIcon(entity) {
    return entity[this.entityFieldPath]
        ?   icons.trashDeleted
        :   <i className={`${iconStyles.trash} ${listStyles.trash}`} />
}

function getDisabledEntityIcon(entity) {
    return (
        <i className={ entity[this.entityFieldPath]
            ?   iconStyles.eye_disable
            :   `${iconStyles.eye_enable} ${listStyles.eye_enable}`
        } />
    )
}

function onSetEntityFilter(entitiesSorted, entitiesByID, filter) {
    let _self = this;
    function setFilter(entityID) {
        let entity = entitiesByID[entityID]
        return filter.has(entity[_self.entityFieldPath])
    }

    return entitiesSorted.filter(setFilter)
}

const disabled = {
    entityFieldPath: 'disabled',
    type: 'set',
    sortable: true,
    showValue: getDisabledEntityIcon,
    onFilter: onSetEntityFilter,
    typeOptions: {
        filterOptions: [
            {
                title: <>
                    <i className={iconStyles.eye_disable} />
                    Disabled
                </>,
                value: true,
                defaultValue: true
            },
            {
                title: <>
                    <i className={`${iconStyles.eye_enable} ${listStyles.select_eye_enable}`} />
                    Enabled
                </>,
                value: false,
                defaultValue: true
            }
        ]
    }
}

const deleted = {
    entityFieldPath: 'deleted',
    type: 'set',
    sortable: true,
    showValue: getDeletedEntityIcon,
    onFilter: onSetEntityFilter,
    typeOptions: {
        filterOptions: [
            {
                title: <>
                    {icons.trashDeleted}
                    Removed
                </>,
                value: true,
                defaultValue: true
            },
            {
                title: <>
                    <i className={`${iconStyles.trash} ${listStyles.trash}`} />
                    Removed
                </>,
                value: false,
                defaultValue: true
            }
        ]
    }
}



function showDeepEntityValueByID(deepDntitiesByID, item) {
    let deepEntityID = item[this.entityFieldPath]

    if (deepDntitiesByID[deepEntityID]) {
        return deepDntitiesByID[deepEntityID].name
    }
}

function onDeepEntityFilter(deepEntitiesByID, entitiesSorted, entitiesByID, searchField) {
    let _self = this;

    function filterByDeepEntityID(entityId) {
        let deepEntityID = entitiesByID[entityId][_self.entityFieldPath]

        if (deepEntitiesByID[deepEntityID]) {
            return deepEntitiesByID[deepEntityID].name.toLowerCase().includes(searchField)
        }
    }

    return entitiesSorted.filter(filterByDeepEntityID)
}

function onDeepEntitySort(deepEntitiesByID, entitiesSorted, entitiesByID, sortValue) {
    let _self = this;

    function sortByDeepEntity(ID_a, ID_b){
        let deepEntityID_a = entitiesByID[ID_a][_self.entityFieldPath]
        let deepEntityID_b = entitiesByID[ID_b][_self.entityFieldPath]

        if (deepEntitiesByID[deepEntityID_a] && deepEntitiesByID[deepEntityID_b]) {
            return deepEntitiesByID[deepEntityID_a].name < deepEntitiesByID[deepEntityID_b].name
                ?   sortValue
                :   -sortValue
        }
    }

    return entitiesSorted.sort(sortByDeepEntity)
}

const sportID = {
    entityFieldPath: 'sportId',
    label: 'Sport',
    type: 'text',
    sortable: true
}

const countryID = {
    entityFieldPath: 'countryId',
    label: 'Country',
    type: 'text',
    sortable: true
}

const leagueID = {
    entityFieldPath: 'leagueId',
    label: 'League',
    type: 'text',
    sortable: true
}

const parentID = {
    entityFieldPath: 'parentId',
    label: 'Parent',
    type: 'text',
    sortable: true
}

const fieldEntityIDToStoreMap = [
    { fieldEntity: sportID, store: sportStore },
    { fieldEntity: countryID, store: countryStore },
    { fieldEntity: leagueID, store: leagueStore },
    { fieldEntity: parentID, store: categoryParentStore }
]

function fieldEntityIDHelpersBind({ fieldEntity, store }) {
    fieldEntity.showValue = showDeepEntityValueByID.bind(fieldEntity, store.state.byID)
    fieldEntity.onFilter = onDeepEntityFilter.bind(fieldEntity, store.state.byID)
    fieldEntity.onSort = onDeepEntitySort.bind(fieldEntity, store.state.byID)
}

fieldEntityIDToStoreMap.forEach(fieldEntityIDHelpersBind)



const fields = { id, code, name, position, created, updated, disabled, deleted, sportID, countryID, leagueID, parentID, startDate, endDate }
const helpers = { getDeletedEntityIcon, getDisabledEntityIcon, showDeepEntityValueByID, onDeepEntityFilter, onDeepEntitySort }


export { fields, helpers }