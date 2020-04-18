import React from 'react'

import { extractProps } from '../ui_utils'
import { ListElement, _Dropdown } from './types'


const componentID = '-ui-dropdown'

const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Dropdown: _Dropdown = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Dropdown['defaults'] & typeof props)
        :   extractProps(Dropdown.defaults, props)
    
    const { className, theme, list, builder, dropdownIcon, soloOpen, attributes } = mergedProps;


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            const { elem, className } = builder(title, children)
            title = elem;
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
        item_with_child: componentID + '_item_with_child',
        item_title: componentID + '_item_title',
        item_without_child: componentID + '_item_without_child'
    }
}
Dropdown.ID = componentID;


export * from './types'
export { componentID }
export default Dropdown