import React from 'react'

import { Accordion, AccordionProps } from 'app/components'


const { ID } = Accordion

const list: AccordionProps['list'] = [
    { title: 'item 1' },
    { title: 'item 2' },
    { title: 'item 3' },
    { title: 'item 4' },
    {
        title: 'item 5',
        children: [
            { title: 'subitem 1' },
            { title: 'subitem 2' }
        ]
    },
    {
        title: 'item 6',
        children: [{
            title: 'subitem 1',
            children: [{
                title: 'subitem 1',
                children: [{
                    title: 'subitem 1',
                    children: [{ title: 'final' }]
                }]
            }]
        }]
    }
]

const Demo = () => <>
    <h1 children={ ID } />

    <h2 children='simple' />
    <Accordion { ...{ list } } soloOpen />

    <h2 children='expanded by default' />
    <Accordion { ...{ list: [list[list.length - 1]] } } autoExpand />
</>
Demo.id = ID


export default Demo