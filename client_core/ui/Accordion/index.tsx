import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type {
    ListElement, Component, MergedProps,
    Props
} from './types'


const componentID = '-ui-accordion'

const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Accordion: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Accordion.defaults, props, false)
        :   (props as MergedProps)

    const {
        className, theme, list, builder, accordionIcon, soloOpen, attributes, autoExpand, refApi
    } = mergedProps


    function childrenMapper(listItem: ListElement, i: number, _acc: any) {
        const { children } = listItem

        let { title } = listItem
        const listItemTheme: Parameters<NonNullable<MergedProps['builder']>>[0]['listItemTheme'] = {
            item: theme.item,
            item_title_wrapper: theme.item_title_wrapper,
            item_title: theme.item_title,
            children_wrapper: theme.children_wrapper
        }
        if (builder) {
            const { elem, acc } = builder({
                listItem, listItemTheme,
                index: i,
                acc: _acc
            })

            _acc = acc
            title = elem
        }

        return children
            ?   <details key={ i } className={ listItemTheme.item } open={ autoExpand }
                    onClick={ onClickHandler }>

                    <summary className={ listItemTheme.item_title_wrapper }
                        onMouseDown={ onAccordionToggle }>

                        <div className={ listItemTheme.item_title } children={ title } />
                        { accordionIcon }
                    </summary>

                    <div className={ listItemTheme.children_wrapper }
                        children={ children.map((listItem, i) => childrenMapper(listItem, i, _acc)) } />
                </details>

            :   <div key={ i } className={ theme.item__empty } children={ title } />
    }

    function onAccordionToggle(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        const parentDtailsEl = e.currentTarget.parentElement as HTMLDetailsElement

        if (soloOpen) {
            let sibling = parentDtailsEl.parentElement!.firstChild

            while (sibling) {
                if (sibling != parentDtailsEl) {
                    (sibling as HTMLDetailsElement).open = false
                }

                sibling = sibling.nextSibling
            }
        }

        parentDtailsEl.open = !parentDtailsEl.open
    }


    let _className = theme.children_wrapper
    className && (_className += ` ${className}`)

    const accordionRootProps = {
        className: _className,
        children: list.map(childrenMapper)
    }
    refApi && (applyRefApi(accordionRootProps, mergedProps))
    attributes && (Object.assign(accordionRootProps, attributes))


    return <div { ...accordionRootProps } />
}
Accordion.defaults = {
    theme: {
        root: '',
        item: '',
        item_title_wrapper: '',
        item_title: '',
        children_wrapper: '',
        item__empty: ''
    }
}
Accordion.ID = componentID


export { componentID }
export default Accordion
export type { Props }