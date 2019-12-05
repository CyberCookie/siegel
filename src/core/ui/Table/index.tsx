import React, { ReactNode } from 'react'

type tableCell = {
    value: ReactNode,
    attributes: React.Attributes
}

type tableRow = {
    children: tableCell[],
    attributes: React.Attributes
}

interface Props {
    attributes?: React.Attributes,
    className?: string,
    body?: tableRow[],
    head?: tableRow[],
    foot?: tableRow[]
}

interface DefaultProps {
    className: string
}


const componentID = '-ui-table'

const defaults: DefaultProps = {
    className: componentID
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


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
    let className = defaults.className;
    props.className && (className += ` ${props.className}`)

    let { head, body, foot, attributes } = Object.assign({}, defaults, props)

    let _attributes = Object.assign({}, attributes, { className })

    
    return (
        <table {..._attributes}>
            { head ? getTableSection(head, 'thead') : null }
    
            { body ? getTableSection(body, 'tbody') : null }
    
            { foot ? getTableSection(foot, 'tfoot') : null }
        </table>
    )
}


export { setDefaults }
export default Table