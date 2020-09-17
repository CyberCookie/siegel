//TODO: config Props with Entities to get autocomplete in columnsConfig and postProcess hooks

import React from 'react'

import getEnchancedDataTableProps from './postProcessProps'
import createEntitiesStruct from 'siegel-utils/entities_struct'
import { msIn } from 'siegel-utils/date/consts'
import DataTable from 'siegel-ui/DataTable'
import { Props } from 'siegel-ui/DataTable/types'

import tableDemoTheme from '../Table/styles.sass'
import s from './styles.sass'


const entitiesStruct = createEntitiesStruct('id')
;(new Array(200))
.fill(1)
.map((_, i) => ({
    id: i,
    date: Date.now() + msIn.day * i,
    name: 'some text ' + i,
    someNumer: i % 4,
    bool: i % 2 == 0 ? true : false
}))
.forEach(el => entitiesStruct.addOrUpdate(el))
// type Entities = typeof entitiesStruct

const theme: Props['theme'] = {
    root: s.data_table,
    table: `${tableDemoTheme.table} ${s.table}`,
    table_resizer: s.resizer,
    pagination_wrapper: s.pagination_wrapper,
    _with_pagination: s._with_pagination
}
const columnsConfig: Props['columnsConfig'] = [
    {
        label: 'ID',
        type: 'text',
        entityFieldPath: 'id'
    },
    {
        label: 'Date',
        type: 'date',
        entityFieldPath: 'date',
        showValue(entity) {
            return (new Date(entity[this.entityFieldPath as string])).toDateString()
        }
    },
    {
        label: 'Name',
        type: 'text',
        entityFieldPath: 'name'
    },
    {
        label: 'Some number',
        type: 'set',
        entityFieldPath: 'someNumer'
    },
    {
        label: 'Some boolean',
        type: 'set',
        entityFieldPath: 'bool',
        showValue: entity => entity.bool ? '+' : '-'
    }
]

const Demo = () => {
    const props: Props = {
        theme, columnsConfig,
        entities: entitiesStruct
    }


    return <>
        <h1>{DataTable.ID}</h1>

        <h2>simple [like table]</h2>
        <DataTable {...props} />

        <h2> with pagination, resizable, postProcess </h2>
        <DataTable {...getEnchancedDataTableProps(props)} />
    </>
}
Demo.id = DataTable.ID;


export { theme }
export default Demo