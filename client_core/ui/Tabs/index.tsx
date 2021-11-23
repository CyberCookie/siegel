//TODO: renderAll

import React from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type {
    MergedProps, Component,
    Props
} from './types'


const componentID = '-ui-tabs'

function getTabsVisual(mergedProps: MergedProps) {
    const { tabs, activeTab, onChange, theme } = mergedProps

    let activeTabContent: React.ReactNode
    const labels = tabs.map(tab => {
        const { label, id, payload, content } = tab

        let labelClassName = theme.label
        if (activeTab == id) {
            labelClassName += ` ${theme.label__active}`
            activeTabContent = content
        }

        return (
            <div key={ id } className={ labelClassName } children={ label }
                onMouseDown={ e => { onChange(id, e, payload) } } />
        )
    })


    return {
        activeTabContent: activeTabContent && <div className={ theme.content } children={ activeTabContent } />,
        labels: <div className={ theme.labels_wrapper } children={ labels } />
    }
}

function getTabRootProps(mergedProps: MergedProps, activeTabContent: React.ReactNode) {
    const { theme, attributes } = mergedProps
    let className = mergedProps.className

    activeTabContent || (className += ` ${theme.content__empty}`)

    let tabsRootProps = { className }
    attributes && (tabsRootProps = Object.assign(tabsRootProps, attributes))
    mergedProps.refApi && applyRefApi(tabsRootProps, mergedProps)


    return tabsRootProps
}

const Tabs: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Tabs.defaults, props, false)
        :   (props as MergedProps)


    const { activeTabContent, labels } = getTabsVisual(mergedProps)


    return (
        <div { ...getTabRootProps(mergedProps, activeTabContent) }>
            { labels }
            { activeTabContent }
        </div>
    )
}
Tabs.defaults = {
    theme: {
        root: '',
        labels_wrapper: '',
        label: '',
        label__active: '',
        content: '',
        content__empty: ''
    }
}
Tabs.ID = componentID


export { componentID }
export default Tabs
export type { Props }