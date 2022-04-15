import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type {
    Component, MergedProps, TableBodyRow, TableHeadRow, TableTH, TableTD
} from './types'


const componentID = '-ui-table'

let CellHTMLTag: React.ElementType

function getTableRow(row: TableHeadRow | TableBodyRow, rowIndex: number) {
    const { children, attributes = {} } = row
    attributes.key = attributes.key || rowIndex

    return <tr { ...attributes } children={ (children as (TableTH | TableTD)[]).map(getTableCell) } />
}

function getTableCell(cell: TableTH | TableTD, cellIndex: number) {
    const { value, attributes = {} } = cell
    attributes.key = attributes.key || cellIndex

    return <CellHTMLTag { ...attributes } children={ value } />
}

function getTableSection(data: (TableHeadRow | TableBodyRow)[], SectionHTMLTag: React.ElementType) {
    CellHTMLTag = SectionHTMLTag == 'thead' ? 'th' : 'td'

    return <SectionHTMLTag children={ data.map(getTableRow) } />
}

const Table: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Table.defaults, props, false)
        :   (props as MergedProps)

    const { className, head, body, foot, rootTagAttributes, caption, refApi } = mergedProps

    let tableRootProps = { className }
    refApi && (applyRefApi(tableRootProps, mergedProps))
    if (rootTagAttributes) {
        tableRootProps = mergeTagAttributes(tableRootProps, rootTagAttributes)
    }


    return (
        <table { ...tableRootProps }>
            { caption && <caption children={ caption } /> }

            { head && getTableSection(head, 'thead') }
            { body && getTableSection(body, 'tbody') }
            { foot && getTableSection(foot, 'tfoot') }
        </table>
    )
}
Table.defaults = {}
Table.ID = componentID


export { componentID }
export default Table
export * from './types'