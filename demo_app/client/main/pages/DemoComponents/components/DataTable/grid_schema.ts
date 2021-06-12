import type { DemoDataTableProps, Entity } from './types'

import styles from './styles.sass'


type GridColumnConfig = DemoDataTableProps['columnsConfig'][number]
type GridOnSortParams = Parameters<NonNullable<GridColumnConfig['onSort']>>
type GridOnFilterParams = Parameters<NonNullable<GridColumnConfig['onFilter']>>

type OnFilterCompareFunc = Parameters<Array<ID>['filter']>[0]

type DateSearchFilter = {
    dateStart: number
    dateEnd: number
}


function getTextValue(this: GridColumnConfig, entity: Entity) {
    return {
        value: entity[this.customParams!.valuePath]
    }
}

function filterValue(
    this: DemoDataTableProps['columnsConfig'][number],
    sorted: GridOnFilterParams[0],
    byID: GridOnFilterParams[1],
    search: string | Set<ID> | DateSearchFilter
) {

    const type = this.customParams!.valuePath

    const isTextColumn = type == 'text'

    let searchLowerCase: string
    isTextColumn && (searchLowerCase = (search as string).toLowerCase())

    const textFilterFunc: OnFilterCompareFunc = (ID, i) => {
        const { value } = this.showValue(byID[ID], i)
        return value!.toString().toLowerCase().includes(searchLowerCase)
    }

    const dateFilterFunc: OnFilterCompareFunc = (ID, i) => {
        const { dateStart, dateEnd } = search as DateSearchFilter
        const { value } = this.showValue(byID[ID], i)
        const timestamp = value
            ?   (new Date(value as string)).getTime()
            :   Date.now()

        return dateStart <= timestamp && timestamp < dateEnd
    }

    const setFilterFunc: OnFilterCompareFunc = ID => {
        const value = byID[ID][this.customParams!.valuePath]
        return !(search as Set<ID>).has(value as ID)
    }

    const filterFunc = isTextColumn
        ?   textFilterFunc
        :   type == 'date'
            ?   dateFilterFunc
            :   setFilterFunc


    return sorted.filter(filterFunc)
}


function sortValue(
    this: GridColumnConfig,
    sorted: GridOnSortParams[0],
    byID: GridOnSortParams[1],
    sortValue: GridOnSortParams[2]
) {

    return sorted.sort((ID_a, ID_b) => {
        const value_a = this.showValue(byID[ID_a], -1).value!
        const value_b = this.showValue(byID[ID_b], -1).value!

        return value_a < value_b ? sortValue : -sortValue
    })
}


const columnsConfig: DemoDataTableProps['columnsConfig'] = [
    {
        label: 'ID',
        className: styles.column_id,
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'text',
            valuePath: 'id'
        }
    },
    {
        label: 'Date',
        className: styles.column_date,
        showValue: ({ date }) => ({
            value: (new Date(date)).toDateString()
        }),
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'date',
            valuePath: 'date'
        }
    },
    {
        label: 'Name',
        className: styles.column_name,
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'text',
            valuePath: 'text'
        }
    },
    {
        label: 'Some number',
        className: styles.column_number,
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'set',
            valuePath: 'num'
        }
    },
    {
        label: 'Some boolean',
        className: styles.column_boolean,
        showValue: ({ bool }) => ({
            value: bool ? '+' : '-'
        }),
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'set',
            valuePath: 'bool'
        }
    }
]


export default columnsConfig