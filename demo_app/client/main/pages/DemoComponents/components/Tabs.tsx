import React, { useState } from 'react'

import { Tabs } from 'app/components'


const { ID } = Tabs

const tabsData = ([1,2,3]).map(id => ({
    id: id.toString(),
    content: 'content ' + id,
    label: 'label ' + id
}))

const Demo = () => {
    const [ activeTab, setActiveTab ] = useState(tabsData[0].id)


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Tabs tabs={ tabsData } activeTab={ activeTab }
            onChange={ id => {
                setActiveTab(id)
            } } />
    </>
}
Demo.id = ID


export default Demo