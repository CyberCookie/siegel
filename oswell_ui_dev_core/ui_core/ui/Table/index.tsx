import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps, TableCell, TableRow } from './types'


const componentID = '-ui-table'

const defaults: DefaultProps = {
    className: componentID
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


let CellHTMLTag: React.ElementType;

function getTableRow(row: TableRow, rowIndex: number) {
    let { children, attributes = {} } = row;
    attributes.key = attributes.key || rowIndex;

    return <tr {...attributes} children={children.map(getTableCell)} />
}

function getTableCell(cell: TableCell, cellIndex: number) {
    let { value, attributes = {} } = cell;
    attributes.key = attributes.key || cellIndex;

    return <CellHTMLTag {...attributes} children={value} />
}

function getTableSection(data: TableRow[], SectionHTMLTag: React.ElementType) {
    CellHTMLTag = SectionHTMLTag == 'thead' ? 'th' : 'td'

    return <SectionHTMLTag children={data.map(getTableRow)} />
}

const Table = (props: Props) => {
    let { className, head, body, foot, attributes } = extractProps(defaults, props)
    
    let wrapperAttr = Object.assign({}, attributes, { className })

    
    return (
        <table {...wrapperAttr}>
            { head ? getTableSection(head, 'thead') : null }
    
            { body ? getTableSection(body, 'tbody') : null }
    
            { foot ? getTableSection(foot, 'tfoot') : null }
        </table>
    )
}


export { setDefaults }
export default Table