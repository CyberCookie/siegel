//TODO: rename

import React from 'react'

import { extractProps } from '../ui_utils'
import type { ListElement, _Dropdown } from './types'


const componentID = '-ui-dropdown'

const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Dropdown: _Dropdown = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Dropdown.defaults, props)
        :   (props as _Dropdown['defaults'] & typeof props)
    
    const { className, theme, list, builder, dropdownIcon, soloOpen, attributes } = mergedProps;


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            const { elem, parentClassName } = builder(title, children)
            title = elem;
            wrapperClass = parentClassName
        }

        return children
            ?   <details key={i} className={theme.item}
                    onClick={onClickHandler}
                    onMouseDown={onDropdownToggle}>

                    <summary className={`${theme.item_title} ${wrapperClass || ''}`}>
                        { title }
                        { dropdownIcon }
                    </summary>

                    { children.map(childrenMapper) }
                </details>

            :   <div key={i} className={theme.item__empty}
                    children={title} />
    }

    function onDropdownToggle(e: React.MouseEvent<HTMLDetailsElement>) {
        e.stopPropagation()
        const dropdownTitle = e.currentTarget;
        const curState = dropdownTitle.open;

        if (soloOpen) {
            let sibling = dropdownTitle.parentElement!.firstChild;

            while (sibling) {
                (sibling as HTMLDetailsElement).open = false;
                sibling = sibling.nextSibling
            }
        }
        
        dropdownTitle.open = !curState
    }
    

    const dropdownRootProps = {
        className,
        children: list.map(childrenMapper)
    }
    attributes && (Object.assign(dropdownRootProps, attributes))


    return <div {...dropdownRootProps} />
}
Dropdown.defaults = {
    theme: {
        root: componentID,
        item: componentID + '_item',
        item__empty: componentID + '_item__empty',
        item_title: componentID + '_item_title'
    }
}
Dropdown.ID = componentID;


export { componentID }
export default Dropdown