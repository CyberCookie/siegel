import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type { ListElement, _Accordion, Props } from './types'


const componentID = '-ui-accordion'

const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Accordion: _Accordion = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Accordion.defaults, props, false)
        :   (props as _Accordion['defaults'] & Props)
    
    const {
        className, theme, list, builder, accordionIcon, soloOpen, attributes, autoExpand, refApi
    } = mergedProps;


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            const { elem, parentClassName } = builder(title, children)
            title = elem;
            wrapperClass = parentClassName
        }

        return children
            ?   <details key={i} className={theme.item} open={autoExpand}
                    onClick={onClickHandler}>

                    <summary className={`${theme.item_title_wrapper} ${wrapperClass || ''}`}
                        onMouseDown={onAccordionToggle}>

                        <div className={theme.item_title} children={title} />
                        { accordionIcon }
                    </summary>

                    <div className={theme.children_wrapper} children={children.map(childrenMapper)} />
                </details>

            :   <div key={i} className={theme.item__empty} children={title} />
    }

    function onAccordionToggle(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        const parentDtailsEl = e.currentTarget.parentElement as HTMLDetailsElement;

        if (soloOpen) {
            let sibling = parentDtailsEl.parentElement!.firstChild;

            while (sibling) {
                (sibling as HTMLDetailsElement).open = false;
                sibling = sibling.nextSibling
            }
        }
        
        parentDtailsEl.open = !parentDtailsEl.open
    }
    

    let _className = theme.children_wrapper;
    className && (_className += ` ${className}`)

    const accordionRootProps = {
        className: _className,
        children: list.map(childrenMapper)
    }
    refApi && (applyRefApi(accordionRootProps, mergedProps))
    attributes && (Object.assign(accordionRootProps, attributes))


    return <div {...accordionRootProps} />
}
Accordion.defaults = {
    theme: {
        root: componentID,
        item: componentID + '_item',
        item_title_wrapper: componentID + '_item_title_wrapper',
        item_title: componentID + '_item_title',
        children_wrapper: componentID + '_children_wrapper',
        item__empty: componentID + '_item__empty'
    }
}
Accordion.ID = componentID;


export { componentID }
export default Accordion