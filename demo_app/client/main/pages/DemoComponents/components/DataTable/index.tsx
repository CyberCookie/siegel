import React from 'react'
import createEntitiesStruct from 'siegel-utils/entities_struct'
import { msIn } from 'siegel-utils/date/consts'

import type { Entity, DemoDataTableProps } from './types'
import getEnchancedDataTableProps from './postProcessProps'
import columnsConfig from './grid_schema'
import { DataTable } from 'app/components'

import styles from './styles.sass'


const { ID } = DataTable

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
        <h1 children={ ID } />

        <h2 children='simple [like table]' />
        <DataTable { ...props } />

        <h2 children='with pagination, resizable, postProcess' />
        <DataTable { ...getEnchancedDataTableProps(props) } />
    </>
}
Demo.id = ID


export default Demo