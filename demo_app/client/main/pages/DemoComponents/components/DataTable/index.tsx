//TODO: config Props with Entities to get autocomplete in columnsConfig and postProcess hooks

import React from 'react'
import createEntitiesStruct from 'siegel-utils/entities_struct'
import { msIn } from 'siegel-utils/date/consts'
import { Props } from 'siegel-ui/DataTable/types'

import { DataTable } from 'app/components'
import getEnchancedDataTableProps from './postProcessProps'




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
        columnsConfig,
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


export default Demo