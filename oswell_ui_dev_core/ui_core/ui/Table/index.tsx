import React from 'react'

import { setDefaultProps, extractProps, PropsComponentBase } from '../ui_utils'

type tableCell = {
    value: React.ReactNode,
    attributes: React.Attributes
}

type tableRow = {
    children: tableCell[],
    attributes: React.Attributes
}

type Props = {
    attributes?: React.Attributes,
    body?: tableRow[],
    head?: tableRow[],
    foot?: tableRow[]
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<PropsComponentBase['className']>
}


const componentID = '-ui-table'

const defaults: DefaultProps = {
    className: componentID
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


let CellHTMLTag: React.ElementType;

function getTableRow(row: tableRow, rowIndex: number) {
    let { children, attributes = {} } = row;
    attributes.key = attributes.key || rowIndex;

    return <tr {...attributes} children={children.map(getTableCell)} />
}

function getTableCell(cell: tableCell, cellIndex: number) {
    let { value, attributes = {} } = cell;
    attributes.key = attributes.key || cellIndex;

    return <CellHTMLTag {...attributes} children={value} />
}

function getTableSection(data: tableRow[], SectionHTMLTag: React.ElementType) {
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