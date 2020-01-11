import React from 'react'

import { setDefaultProps, extractProps, PropsComponentThemed } from '../ui_utils'

type ListElement = {
    title: React.ReactNode,
    children: ListElement[]
}

type Props = {
    soloOpen?: boolean,
    dropdownIcon: React.ReactNode,
    list: ListElement[],
    builder?: (title: React.ReactNode) => ({ className: string, elem: React.ReactNode })
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<PropsComponentThemed['theme']>
}


const componentID = '-ui-dropdown'

const defaults: DefaultProps = {
    theme: {
        dropdown: componentID,
        item_with_child: componentID + '_item_with_child',
        item_title: componentID + '_item_title',
        item_without_child: componentID + '_item_without_child'
    }
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Dropdown = (props: Props) => {
    let { theme, className = '', list, builder, dropdownIcon, soloOpen } = extractProps(defaults, props)

    className += ` ${theme.dropdown}`;


    function onDropdownToggle(e: React.MouseEvent<HTMLDetailsElement>) {
        e.stopPropagation()
        let dropdownTitle = e.currentTarget;
        let curState = dropdownTitle.open;

        if (soloOpen) {
            let sibling = dropdownTitle.parentElement!.firstChild;

            while (sibling) {
                (sibling as HTMLDetailsElement).open = false;
                sibling = sibling.nextSibling
            }
        }
        
        dropdownTitle.open = !curState
    }


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            let { elem, className } = builder(title)
            title = elem
            wrapperClass = className
        }

        return children
            ?   <details key={i} className={theme.item_with_child}
                    onClick={onClickHandler}
                    onMouseDown={onDropdownToggle}>

                    <summary className={`${theme.item_title} ${wrapperClass || ''}`}>
                        { title }
                        { dropdownIcon }
                    </summary>

                    { children.map(childrenMapper) }
                </details>

            :   <div key={i} className={theme.item_without_child}
                    children={title} />
    }


    return <div children={list.map(childrenMapper)} className={className} />
}


export { setDefaults }
export default Dropdown