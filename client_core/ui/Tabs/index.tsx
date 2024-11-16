//TODO?: no render labels when only one

import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'

import type { MergedProps, Component, Props, DefaultProps, Tab } from './types'


const _undef = undefined
const componentID = '-ui-tabs'

const getContent = (content: Tab['content']) => (
    content?.constructor == Function
        ?   (content as Extract<Tab['content'], AnyFunc>)()
        :   (content as Exclude<Tab['content'], AnyFunc>)
)

const getContentClassName = (
    { content }: MergedProps['theme'],
    tabClassName: Tab['contentClassName']
) => (
    content
        ?   tabClassName
            ?   `${content} ${tabClassName}`
            :   content
        :   tabClassName
)

function getTabsVisual(mergedProps: MergedProps) {
    const { tabs, activeTab, onChange, theme, showEmpty } = mergedProps

    const hasPrerenderTab = tabs.find(({ prerender }) => prerender)

    const tabsContent: React.ReactNode[] = []
    let tabContentClassName
    const labels = tabs.map(tab => {
        const {
            label, id, payload, content, contentClassName, labelClassName, prerender
        } = tab
        const isSelected = activeTab == id

        if (prerender || isSelected) {
            let tabContent = getContent(content)

            if (hasPrerenderTab) {
                const wrapperProps: ReactTagAttributes<HTMLDivElement> = {
                    children: tabContent,
                    key: id
                }
                isSelected
                    ?   (wrapperProps.className = getContentClassName(theme, contentClassName))
                    :   (wrapperProps.style = { display: 'none' })

                tabContent = <div { ...wrapperProps } />
            }

            tabsContent.push(tabContent)
            isSelected && (tabContentClassName = contentClassName)
        }


        return (
            <div key={ id } children={ label }
                className={
                    applyClassName(theme.label, [
                        [ theme.label__active, isSelected ],
                        [ labelClassName, labelClassName ]
                    ])
                }
                onMouseDown={ e => { onChange(id, e, payload) } } />
        )
    })


    return {
        activeTabContent: (showEmpty || tabsContent.length)
            ?   hasPrerenderTab
                ?   tabsContent
                :   <div className={ getContentClassName(theme, tabContentClassName) }
                        children={ tabsContent[0] } />
            :   _undef,
        labels: <div className={ theme.labels_wrapper } children={ labels } />
    }
}

function getTabRootProps(mergedProps: MergedProps, activeTabContent: React.ReactNode) {
    const { theme, rootTagAttributes, className } = mergedProps

    let tabsRootProps = {
        className: applyClassName(className, [[ theme.content__empty, !activeTabContent ]])
    }
    applyRefApi(tabsRootProps, mergedProps)
    tabsRootProps = resolveTagAttributes(tabsRootProps, rootTagAttributes)


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