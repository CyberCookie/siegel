import React, { useState, useMemo } from 'react'
import updateURLQuery from 'siegel-utils/query_update'

import { history } from 'app/routes'
import * as demoComponents from './components'

import styles from './styles.sass'


type SidebarItemProps = {
    key: string
    children: string
    onMouseDown(): void
    className?: string
}

const _demoComponents: Indexable = demoComponents;

const hashParam = 'active'

const DemoPage = () => {
    const [ active, setActive ] = useState(
        useMemo(() => (new URLSearchParams(window.location.search)).get(hashParam), [])
    )

    const componentsList = []
    for (const component in demoComponents) {
        const props: SidebarItemProps = {
            key: component,
            children: _demoComponents[component].id,
            onMouseDown() {
                updateURLQuery(history, hashParam, component) 
                setActive(component)
            }
        }
        component == active && (props.className = styles.active)
        
        componentsList.push( <div {...props} /> )
    }

    function getActiveComponent() {
        const Component = _demoComponents[active]
        return <Component />
    }


    return (
        <div className={styles.page}>
            <div className={styles.sidebar} children={componentsList} />

            <div className={styles.demo_component} children={ active && getActiveComponent() } />
        </div>
    )
}


export default DemoPage