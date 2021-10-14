import React, { useState } from 'react'

import { Tabs, TabsProps } from 'app/components'


const { ID } = Tabs

const tabsData = ([1,2,3]).map(id => ({
    id: id.toString(),
    content: 'content ' + id,
    label: 'label ' + id
}))

const Demo = () => {
    const [ activeTab, setActiveTab ] = useState(tabsData[0].id)

    const props: TabsProps = {
        activeTab,
        tabs: tabsData,
        onChange(id) {
            setActiveTab(id)
        }
    }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Tabs { ...props } />
    </>
}
Demo.id = ID


export default Demo