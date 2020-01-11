import React from 'react'

import { setDefaultProps, extractProps, PropsComponentThemed } from '../ui_utils'
import './styles'

type TabData = {
    id: ID,
    content: React.ReactNode,
    label: React.ReactNode
}

type Props = {
    attributes?: React.Attributes,
    data: TabData[],
    onTabClick: (id: ID) => void,
    activeTab: ID
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<PropsComponentThemed['theme']>
}


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
    function getLabel({ id, label }: TabData) {
        let labelClassName = theme.tab_label;
        activeTab == id && (labelClassName += ` ${theme.tab_label__active}`)

        return (
            <div key={id} className={labelClassName} children={label}
                onMouseDown={() => onTabClick(id)} />
        )
    }


    return <div className={theme.label_wrapper} children={data.map(getLabel)} />
}

const Tabs = (props: Props) => {
    let mergedProps = extractProps(defaults, props)
    let { theme, data, activeTab, attributes, className = '' } = mergedProps;
    
    let tab = data.find((tab: TabData) => tab.id == activeTab)

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