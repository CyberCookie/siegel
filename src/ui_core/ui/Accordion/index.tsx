import React from 'react'

import { extractProps } from '../ui_utils'
import type { ListElement, _Accordion } from './types'


const componentID = '-ui-accordion'

const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Accordion: _Accordion = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Accordion.defaults, props)
        :   (props as _Accordion['defaults'] & typeof props)
    
    const { className, theme, list, builder, accordionIcon, soloOpen, attributes, autoExpand } = mergedProps;


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            const { elem, parentClassName } = builder(title, children)
            title = elem;
            wrapperClass = parentClassName
        }

        return children
            ?   <details key={i} className={theme.item} open={autoExpand}
                    onClick={onClickHandler}
                    onMouseDown={onAccordionToggle}>

                    <summary className={`${theme.item_title} ${wrapperClass || ''}`}>
                        { title }
                        { accordionIcon }
                    </summary>

                    { children.map(childrenMapper) }
                </details>

            :   <div key={i} className={theme.item__empty}
                    children={title} />
    }

    function onAccordionToggle(e: React.MouseEvent<HTMLDetailsElement>) {
        e.stopPropagation()
        const accordionTitle = e.currentTarget;
        const curState = accordionTitle.open;

        if (soloOpen) {
            let sibling = accordionTitle.parentElement!.firstChild;

            while (sibling) {
                (sibling as HTMLDetailsElement).open = false;
                sibling = sibling.nextSibling
            }
        }
        
        accordionTitle.open = !curState
    }
    

    const accordionRootProps = {
        className,
        children: list.map(childrenMapper)
    }
    attributes && (Object.assign(accordionRootProps, attributes))


    return <div {...accordionRootProps} />
}
Accordion.defaults = {
    theme: {
        root: componentID,
        item: componentID + '_item',
        item__empty: componentID + '_item__empty',
        item_title: componentID + '_item_title'
    }
}
Accordion.ID = componentID;


export { componentID }
export default Accordion