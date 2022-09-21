import type { DemoDataTableProps, Entity } from './types'

import styles from './styles.sass'


type GridColumnConfig = DemoDataTableProps['columnsConfig'][number]
type GridOnSortParams = Parameters<NonNullable<GridColumnConfig['onSort']>>
type GridOnFilterParams = Parameters<NonNullable<GridColumnConfig['onFilter']>>

type OnFilterCompareFunc = Parameters<Array<string>['filter']>[0]

type DateSearchFilter = {
    dateStart: number
    dateEnd: number
}


function getTextValue(this: GridColumnConfig, entity: Entity) {
    const { className, valuePath } = this.customParams!
    return {
        className,
        value: entity[valuePath!]
    }
}

function filterValue(
    this: DemoDataTableProps['columnsConfig'][number],
    sorted: GridOnFilterParams[0],
    byID: GridOnFilterParams[1],
    search: string | Set<string> | DateSearchFilter
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
        const value: string = byID[ID][this.customParams!.valuePath!]
        return !(search as Set<string>).has(value)
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
        ID: 'id',
        label: 'ID',
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'text',
            valuePath: 'id',
            className: styles.column_id!
        }
    },
    {
        ID: 'date',
        label: 'Date',
        showValue({ date }) {
            return {
                value: (new Date(date)).toDateString(),
                className: this.customParams!.className
            }
        },
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'date',
            valuePath: 'date',
            className: styles.column_date!
        }
    },
    {
        ID: 'name',
        label: 'Name',
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'text',
            valuePath: 'text',
            className: styles.column_name!
        }
    },
    {
        ID: 'number',
        label: 'Some number',
        showValue: getTextValue,
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'set',
            valuePath: 'num',
            className: styles.column_number!
        }
    },
    {
        ID: 'bool',
        label: 'Some boolean',
        showValue({ bool }) {
            return {
                value: bool ? '+' : '-',
                className: this.customParams!.className
            }
        },
        onSort: sortValue,
        onFilter: filterValue,
        customParams: {
            type: 'set',
            valuePath: 'bool',
            className: styles.column_boolean!
        }
    }
]


export default columnsConfig