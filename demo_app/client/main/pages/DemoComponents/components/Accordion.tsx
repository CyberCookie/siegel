import React from 'react'
import { Props } from 'siegel-ui/Accordion/types'

import { Accordion } from 'app/components'


const list: Props['list'] = [
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
    <h1>{Accordion.ID}</h1>

    <h2>simple</h2>
    <Accordion {...{ list }} />

    <h2>expanded by default</h2>
    <Accordion {...{ list: [list[list.length - 1]] }} autoExpand />
</>
Demo.id = Accordion.ID;


export default Demo