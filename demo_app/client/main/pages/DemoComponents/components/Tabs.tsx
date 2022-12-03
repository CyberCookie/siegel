import React, { useState } from 'react'

import { Tabs } from 'app/components'


const tabsData = ([ 1, 2, 3 ]).map(id => ({
    id: `${id}`,
    content: <div>content {id}</div>,
    label: `label ${id}`
}))

const Demo = () => {
    const [ activeTab, setActiveTab ] = useState(tabsData[0].id)


    return <>
        <h2 children='simple' />

        <Tabs tabs={ tabsData } activeTab={ activeTab }
            onChange={ id => {
                setActiveTab(id)
            } } />
    </>
}
Demo.coreSrcDirName = 'Tabs'


export default Demo