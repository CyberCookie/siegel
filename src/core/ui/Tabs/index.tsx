import React,
    { ReactNode } from 'react'

import './styles'

type TabDataID = string | number

interface TabData {
    id: TabDataID,
    content: ReactNode,
    label: ReactNode
}

interface Props {
    theme?: UITheme,
    className?: string,
    attributes?: React.Attributes,
    data: TabData[],
    onTabClick: (id: TabDataID) => void,
    activeTab: string | number
}

interface DefaultProps {
    theme: UITheme
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

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


function getLabels({ data, activeTab, onTabClick }: DefaultProps & Props, theme: UITheme) {
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
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let mergedProps = Object.assign({}, defaults, props)


    let { data, activeTab, attributes, className } = mergedProps;

    const findActiveTab = (tab: TabData) => tab.id == activeTab;
    let tab = data.find(findActiveTab)

    let wrapperClassName = theme.tabs;
    (tab && tab.content) || (wrapperClassName += ` ${theme.tab_content__empty}`)
    className && (wrapperClassName += ` ${className}`)

    let wrapperAttr = Object.assign({}, attributes, {
        className: wrapperClassName
    })

    
    return (
        <div {...wrapperAttr}>
            { getLabels(mergedProps, theme) }

            { tab && (
                <div data-value={activeTab} className={theme.tab_content}
                    children={tab.content} />
            )}
        </div>
    )
}


export { setDefaults }
export default Tabs