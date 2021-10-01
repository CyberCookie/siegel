import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type {
    List, BuilderList, Component, MergedProps,
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


    function childrenMapper(listItem: (List | BuilderList)[number], i: number, _acc?: any) {
        const { children } = listItem
        const listItemTheme: Parameters<NonNullable<MergedProps['builder']>>[0]['listItemTheme'] = {
            item: theme.item,
            item_title_wrapper: theme.item_title_wrapper,
            item_title: theme.item_title,
            children_wrapper: theme.children_wrapper,
            item__empty: theme.item__empty
        }

        let { title } = listItem as List[number]
        let isTitleAsItemEmpty
        if (builder) {
            const { elem, acc, replaceParentIfLast } = builder({
                listItemTheme,
                listItem: listItem as BuilderList[number],
                index: i,
                acc: _acc
            })

            _acc = acc
            title = elem
            isTitleAsItemEmpty = replaceParentIfLast

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
                        children={ children.map((listItem, i) => childrenMapper(listItem as List[number], i, _acc)) } />
                </details>

            :   isTitleAsItemEmpty
                ?   title
                :   <div key={ i } className={ listItemTheme.item__empty } children={ title } />
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
        children: list.map((listItem, i) => childrenMapper(listItem, i))
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