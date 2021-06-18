import React from 'react'
import createEntitiesStruct from 'siegel-utils/entities_struct'
import { msIn } from 'siegel-utils/date/consts'

import { DataTable } from 'app/components'
import getEnchancedDataTableProps from './postProcessProps'
import columnsConfig from './grid_schema'
import type { Entity, DemoDataTableProps } from './types'

import styles from './styles.sass'


const entitiesStruct = createEntitiesStruct<Entity>('id')
;(new Array(200))
.fill(1)
.map((_, i) => ({
    id: i,
    date: Date.now() + msIn.day * i,
    text: 'some text ' + i,
    num: i % 4,
    bool: i % 2 == 0 ? true : false
}))
.forEach(el => entitiesStruct.addOrUpdate(el))


const Demo = () => {
    const props: DemoDataTableProps = {
        columnsConfig,
        entities: entitiesStruct,
        className: styles.demo_grid,
        postProcessHeadCell(cell, config) {
            cell.attributes = {
                className: config.customParams!.className
            }
        }
    }


    return <>
        <h1>{DataTable.ID}</h1>

        <h2>simple [like table]</h2>
        <DataTable { ...props } />

        <h2> with pagination, resizable, postProcess </h2>
        <DataTable { ...getEnchancedDataTableProps(props) } />
    </>
}
Demo.id = DataTable.ID


export default Demo