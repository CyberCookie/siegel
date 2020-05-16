import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'

import * as demoComponents from './demo_components'

import s from './styles.sass'


type SidebarItemProps = {
    key: string
    children: string
    onMouseDown: () => void
    className?: string
}

const _demoComponents: Indexable = demoComponents;

const DemoPage = () => {
    const [ active, setActive ] = useState('')

    const componentsList = []
    for (const component in demoComponents) {
        const props: SidebarItemProps = {
            key: component,
            children: _demoComponents[component].default.id,
            onMouseDown() { setActive(component) }
        }
        component == active && (props.className = s.active)
        
        componentsList.push( <div {...props} /> )
    }

    function getActiveComponent() {
        const component = _demoComponents[active]
        if (component) {
            const Component = component.default;
            return <Component />
        }
    }


    return (
        <div className={s.page}>
            <div className={s.sidebar} children={componentsList} />

            <div className={s.demo_component} children={ getActiveComponent() } />
        </div>
    )
}


export default hot(DemoPage)