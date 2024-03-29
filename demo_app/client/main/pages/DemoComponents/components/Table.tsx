import React from 'react'

import { Table, TableProps } from 'app/components'


const Demo = () => {
    const props: TableProps = {
        caption: 'Some table',
        head: [{
            children: [
                { value: 'head cell 1' },
                { value: 'head cell 2' },
                { value: 'head cell 3' }
            ]
        }],
        body: [
            {
                children: [
                    {
                        value: 'body cell 1',
                        attributes: {
                            rowSpan: 2
                        }
                    },
                    { value: 'body cell 1' },
                    { value: 'body cell 1' }
                ]
            },
            {
                children: [
                    { value: 'body cell 1' },
                    { value: 'body cell 1' }
                ]
            },
            {
                children: [
                    { value: 'body cell 1' },
                    { value: 'body cell 1' },
                    { value: 'body cell 1' }
                ]
            }
        ],
        foot: [{
            children: [
                { value: 'foot cell 1' },
                {
                    value: 'foot cell 2',
                    attributes: {
                        colSpan: 2
                    }
                }
            ]
        }]
    }


    return <>
        <h2 children='simple' />

        <Table { ...props } />
    </>
}
Demo.coreSrcDirName = 'Table'


export default Demo