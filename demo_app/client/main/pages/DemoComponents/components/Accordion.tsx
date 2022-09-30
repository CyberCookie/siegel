import React from 'react'

import { Accordion, AccordionProps } from 'app/components'


const list: AccordionProps['list'] = [
    { title: 'item 1' },
    {
        title: 'item 2',
        children: [
            { title: 'subitem 2.1' },
            { title: 'subitem 2.2' }
        ]
    },
    {
        title: 'item 3',
        children: [{
            title: 'subitem 3.1',
            children: [{
                title: 'subitem 3.1.1',
                children: [{
                    title: 'subitem 3.1.1.1',
                    children: [{ title: 'final' }]
                }]
            }]
        }]
    }
]


const customAccorionList = [
    { customProp: 'customProp 1' },
    {
        customProp: 'customProp 2',
        children: [
            { customProp: 'customProp 2.1' },
            { customProp: 'customProp 2.2' }
        ]
    }
]
const customListAccordionProps: AccordionProps<(typeof customAccorionList)[number]> = {
    list: customAccorionList,
    builder: ({ listItem }) => ({
        elem: listItem.customProp
    })
}

const Demo = () => <>
    <h2 children='simple; soloOpen' />
    <Accordion { ...{ list } } soloOpen autoExpand />

    <h2 children='expanded by default' />
    <Accordion list={ [ list.at(-1)! ] } autoExpand />

    <h2 children='with custom list props and builder' />
    <Accordion { ...customListAccordionProps } />
</>
Demo.coreSrcDirName = 'Accordion'


export default Demo