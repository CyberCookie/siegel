import React from 'react'

import { extractProps } from '../ui_utils'
import type { TableBodyRow, TableHeadRow, TableTH, TableTD, _Table } from './types'


const componentID = '-ui-table'

let CellHTMLTag: React.ElementType;

function getTableRow(row: TableHeadRow | TableBodyRow, rowIndex: number) {
    const { children, attributes = {} } = row;
    attributes.key = attributes.key || rowIndex;

    return <tr {...attributes} children={children.map(getTableCell)} />
}

function getTableCell(cell: TableTH | TableTD, cellIndex: number) {
    const { value, attributes = {} } = cell;
    attributes.key = attributes.key || cellIndex;

    return <CellHTMLTag {...attributes} children={value} />
}

function getTableSection(data: TableHeadRow[] | TableBodyRow[], SectionHTMLTag: React.ElementType) {
    CellHTMLTag = SectionHTMLTag == 'thead' ? 'th' : 'td'

    return <SectionHTMLTag children={data.map(getTableRow)} />
}

const Table: _Table = (props, noDefaults) => {
    const { className, head, body, foot, attributes } = noDefaults
        ?   extractProps(Table.defaults, props)
        :   (props as _Table['defaults'] & typeof props)
    
    let tableRootProps = { className }
    attributes && (tableRootProps = Object.assign(tableRootProps, attributes))

    
    return (
        <table {...tableRootProps}>
            { head ? getTableSection(head, 'thead') : null }
    
            { body ? getTableSection(body, 'tbody') : null }
    
            { foot ? getTableSection(foot, 'tfoot') : null }
        </table>
    )
}
Table.defaults = {
    className: componentID
}
Table.ID = componentID;


export { componentID }
export default Table