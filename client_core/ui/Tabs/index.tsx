import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'
import type { MergedProps, Component, Tab } from './types'


const componentID = '-ui-tabs'

const getContent = (content: Tab['content']) => (
    content?.constructor == Function
        ?   (content as Function)()
        :   content
)

function getTabsVisual(mergedProps: MergedProps) {
    const { tabs, activeTab, onChange, theme, showEmpty, renderAll } = mergedProps

    const tabsContent: React.ReactNode[] = []
    const labels = tabs.map(tab => {
        const { label, id, payload, content } = tab

        let labelClassName = theme.label

        if (activeTab == id) {
            labelClassName += ` ${theme.label__active}`
            tabsContent.push( getContent(content) )
        } else if (renderAll) {
            tabsContent.push(
                <div key={ id } style={{ display: 'none' }}
                    children={ getContent(content) } />
            )
        }

        return (
            <div key={ id } className={ labelClassName } children={ label }
                onMouseDown={ e => { onChange(id, e, payload) } } />
        )
    })


    return {
        activeTabContent: (showEmpty || tabsContent.length) && (
            <div className={ theme.content }
                children={ renderAll ? tabsContent : tabsContent[0] } />
        ),
        labels: <div className={ theme.labels_wrapper } children={ labels } />
    }
}

function getTabRootProps(mergedProps: MergedProps, activeTabContent: React.ReactNode) {
    const { theme, rootTagAttributes, refApi, className } = mergedProps

    let tabsRootProps = { className }

    activeTabContent || (tabsRootProps.className += ` ${theme.content__empty}`)

    refApi && applyRefApi(tabsRootProps, mergedProps)

    if (rootTagAttributes) {
        tabsRootProps = mergeTagAttributes(tabsRootProps, rootTagAttributes)
    }


    return tabsRootProps
}

const Tabs: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Tabs.defaults, props, false)
        :   (props as MergedProps)

    const { children, theme } = mergedProps

    const { activeTabContent, labels } = getTabsVisual(mergedProps)


    return (
        <div { ...getTabRootProps(mergedProps, activeTabContent) }>
            { labels }
            { activeTabContent }

            { children && addChildren(children, theme) }
        </div>
    )
}
Tabs.defaults = {
    theme: {
        root: '',
        children: '',
        labels_wrapper: '',
        label: '',
        label__active: '',
        content: '',
        content__empty: ''
    }
}
Tabs.ID = componentID


export default Tabs
export { componentID }
export * from './types'