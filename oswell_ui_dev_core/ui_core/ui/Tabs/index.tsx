import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'
import './styles'


const componentID = `-ui-tabs`

const defaults: DefaultProps = {
    theme: {
        tabs: componentID,
        label_wrapper: componentID + '_label_wrapper',
        tab_label: componentID + '_tab_label',
        tab_label__active: componentID + '_tab_label__active',
        tab_content: componentID + '_tab_content',
        tab_content__empty: componentID + '_tab_content__empty'
    }
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


function getLabels({ data, activeTab, onTabClick, theme }: Props & DefaultProps) {
    let labels = data.map(({ label, id }) => {
        let labelClassName = theme.tab_label;
        activeTab == id && (labelClassName += ` ${theme.tab_label__active}`)
    
        return (
            <div key={id} className={labelClassName} children={label}
                onMouseDown={e => onTabClick(id, e)} />
        )
    })

    return <div className={theme.label_wrapper} children={labels} />
}

const Tabs = (props: Props) => {
    let mergedProps = extractProps(defaults, props)
    let { theme, data, activeTab, attributes, className = '' } = mergedProps;
    
    let tab = data.find(tab => tab.id === activeTab)

    className += ` ${theme.tabs}`;
    (tab && tab.content) || (className += ` ${theme.tab_content__empty}`)

    let wrapperAttr = Object.assign({}, attributes, { className })

    
    return (
        <div {...wrapperAttr}>
            { getLabels(mergedProps) }

            { tab && (
                <div data-value={activeTab} className={theme.tab_content}
                    children={tab.content} />
            )}
        </div>
    )
}


export { setDefaults }
export default Tabs