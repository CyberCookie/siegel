import React from 'react'

import { extractProps } from '../ui_utils'
import { Props, DefaultProps, _Tabs } from './types'
import './styles'


const componentID = `-ui-tabs`

function getLabels({ data, activeTab, onChange, theme }: Props & DefaultProps) {
    const labels = data.map(({ label, id, payload }) => {
        let labelClassName = theme.tab_label;
        activeTab == id && (labelClassName += ` ${theme.tab_label__active}`)
    
        return (
            <div key={id} className={labelClassName} children={label}
                onMouseDown={e => onChange(id, e, payload)} />
        )
    })

    return <div className={theme.label_wrapper} children={labels} />
}

const Tabs: _Tabs = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Tabs['defaults'] & typeof props)
        :   extractProps(Tabs.defaults, props)

    const { theme, data, activeTab, attributes } = mergedProps;
    let className = mergedProps.className;
    
    const tab = data.find(tab => tab.id === activeTab);
    
    (tab && tab.content) || (className += ` ${theme.tab_content__empty}`)

    let tabsRootProps = { className }
    attributes && (tabsRootProps = Object.assign(tabsRootProps, attributes))

    
    return (
        <div {...tabsRootProps}>
            { getLabels(mergedProps) }

            { tab && (
                <div data-value={activeTab} className={theme.tab_content}
                    children={tab.content} />
            )}
        </div>
    )
}
Tabs.defaults = {
    theme: {
        root: componentID,
        label_wrapper: componentID + '_label_wrapper',
        tab_label: componentID + '_tab_label',
        tab_label__active: componentID + '_tab_label__active',
        tab_content: componentID + '_tab_content',
        tab_content__empty: componentID + '_tab_content__empty'
    }
}
Tabs.ID = componentID;


export * from './types'
export { componentID }
export default Tabs