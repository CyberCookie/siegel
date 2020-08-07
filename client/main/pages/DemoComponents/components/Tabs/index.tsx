import React, { useState } from 'react'

import Tabs from 'core-ui/Tabs'
import { Props } from 'core-ui/Tabs/types'

import s from './styles.sass'


const theme = {
    root: s.tabs,
    labels_wrapper: s.labels_wrapper,
    label: s.label,
    label__active: s.label__active,
    content: s.content,
    content__empty: s.content__empty
}

const tabsData = ([1,2,3]).map(id => ({
    id,
    content: 'content ' + id,
    label: 'label ' + id
}))

const Demo = () => {
    const [ activeTab, setActiveTab ] = useState(tabsData[0].id)
    
    const props: Props = {
        activeTab, theme,
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


export { theme }
export default Demo