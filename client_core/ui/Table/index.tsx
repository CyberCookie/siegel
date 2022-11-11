import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'

import type {
    Component, Props, DefaultProps,
    TableBodyRow, TableHeadRow, TableTH, TableTD
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

const Table = component<Props, DefaultProps>(
    componentID,
    {},
    props => {

        const { className, head, body, foot, rootTagAttributes, caption } = props

        let tableRootProps = { className }
        applyRefApi(tableRootProps, props)
        tableRootProps = resolveTagAttributes(tableRootProps, rootTagAttributes)


        return (
            <table { ...tableRootProps }>
                { caption && <caption children={ caption } /> }

                { head?.length ? getTableSection(head, 'thead') : undefined }
                { body?.length ? getTableSection(body, 'tbody') : undefined }
                { foot?.length ? getTableSection(foot, 'tfoot') : undefined }
            </table>
        )
    }
)


export default Table
export { componentID }
export type {
    Component, Props,
    TableBodyRow, TableHeadRow, TableTH, TableTD
}