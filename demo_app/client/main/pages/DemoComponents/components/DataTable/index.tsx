import React from 'react'
import createEntitiesStruct from 'siegel-utils/entities_struct'
import msIn from 'siegel-utils/date/constants'

import { DataTable, Checkbox } from 'app/components'
import getEnchancedDataTableProps from './getEnchancedDataTableProps'
import columnsConfig from './grid_schema'

import type { Entity, DemoDataTableProps } from './types'

import styles from './styles.sass'


function getMockEntities(count: number) {
    const entitiesStruct = createEntitiesStruct<Entity>('id')

    ;(new Array(count))
    .fill(1)
    .map((_, i) => ({
        id: `${i}`,
        date: Date.now() + msIn.day * i,
        text: 'some text ' + i,
        num: i % 4,
        bool: i % 2 == 0 ? true : false
    }))
    .forEach(el => entitiesStruct.addOrUpdate(el))


    return entitiesStruct
}



const Demo = () => {
    const props: DemoDataTableProps = {
        columnsConfig,
        entities: getMockEntities(300).raw(),
        className: styles.demo_grid,
        postProcessHeadCell(cell, { customParams }) {
            cell.attributes = {
                className: customParams!.className
            }
        }
    }

    const extendedDataTableProps = getEnchancedDataTableProps(props)
    const [ dataTableState, setDataTableState ] = extendedDataTableProps.store!
    const { toggledColumns } = dataTableState


    const virtualizationProps = Object.assign(
        getEnchancedDataTableProps(props),
        {
            entities: getMockEntities(10000).raw(),
            virtualization: {
                itemHeight: 68
            },
            withFooter: undefined
        }
    )


    return <>
        <h2 children='simple [like table]' />
        <DataTable { ...props } />

        <h2 children='with pagination, resizable, postProcess, columns toggle' />
        <div>
            <div className={ styles.column_toggles_wrapper }>
                { columnsConfig.map(({ label, ID }) => (
                    <Checkbox key={ ID } label={ label } value={ !toggledColumns.has(ID) }
                        onChange={ isColumnToggledNext => {
                            isColumnToggledNext
                                ?   toggledColumns.delete(ID)
                                :   toggledColumns.add(ID)

                            setDataTableState({ ...dataTableState })
                        } } />
                )) }
            </div>

            <DataTable { ...extendedDataTableProps } />
        </div>

        <h2 children='Virtualization with 10000 elements' />
        <DataTable { ...virtualizationProps } />
    </>
}
Demo.coreSrcDirName = 'DataTable'


export default Demo