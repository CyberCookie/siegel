//TODO?: no rendr labels when only one

import React from 'react'

import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'

import type { ReactTagAttributes } from '../_internals/types'
import type { MergedProps, Component, Props, DefaultProps, Tab } from './types'


const _undef = undefined
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

        const isSelected = activeTab == id

        if (renderAll || isSelected) {
            let tabContent = getContent(content)
            if (renderAll) {
                const wrapperProps: ReactTagAttributes<HTMLDivElement> = {
                    children: tabContent,
                    key: id
                }
                isSelected
                    ?   (wrapperProps.className = theme.content)
                    :   (wrapperProps.style = { display: 'none' })

                tabContent = <div { ...wrapperProps } />
            }

            tabsContent.push(tabContent)
        }


        return (
            <div key={ id } children={ label }
                className={
                    applyClassName(theme.label, [
                        [ theme.label__active, isSelected ]
                    ])
                }
                onMouseDown={ e => { onChange(id, e, payload) } } />
        )
    })


    return {
        activeTabContent: (showEmpty || tabsContent.length)
            ?   renderAll
                ?   tabsContent
                :   <div className={ theme.content } children={ tabsContent[0] } />
            :   _undef,
        labels: <div className={ theme.labels_wrapper } children={ labels } />
    }
}

function getTabRootProps(mergedProps: MergedProps, activeTabContent: React.ReactNode) {
    const { theme, rootTagAttributes, refApi, className } = mergedProps

    let tabsRootProps = {
        className: applyClassName(className, [
            [ theme.content__empty, !activeTabContent ]
        ])
    }

    refApi && applyRefApi(tabsRootProps, mergedProps)

    if (rootTagAttributes) {
        tabsRootProps = mergeTagAttributes(tabsRootProps, rootTagAttributes)
    }


    return tabsRootProps
}

const Tabs = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            children: _undef,
            labels_wrapper: _undef,
            label: _undef,
            label__active: _undef,
            content: _undef,
            content__empty: _undef
        }
    },
    props => {

        const { children, theme } = props

        const { activeTabContent, labels } = getTabsVisual(props)


        return (
            <div { ...getTabRootProps(props, activeTabContent) }>
                { labels }
                { activeTabContent }

                { addChildren(children, theme) }
            </div>
        )
    }
)


export default Tabs
export { componentID }
export type { Component, Props }