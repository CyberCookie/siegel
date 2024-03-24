import React, { useState } from 'react'

import { Tabs, TabsProps } from 'app/components'


const tabsData: TabsProps['tabs'] = ([ 1, 2, 3 ]).map(id => ({
    id: `${id}`,
    content: `content ${id}`,
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