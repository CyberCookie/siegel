import React, { useState } from 'react'

import { Tabs, TabsProps } from 'app/components'


const tabsData = ([1,2,3]).map(id => ({
    id,
    content: 'content ' + id,
    label: 'label ' + id
}))

const Demo = () => {
    const [ activeTab, setActiveTab ] = useState(tabsData[0].id)

    const props: TabsProps = {
        activeTab,
        tabs: tabsData,
        onChange(id) {
            setActiveTab(id as number)
        }
    }


    return <>
        <h1>{Tabs.ID}</h1>

        <h2>simple</h2>
        <Tabs {...props} />
    </>
}
Demo.id = Tabs.ID;


export default Demo