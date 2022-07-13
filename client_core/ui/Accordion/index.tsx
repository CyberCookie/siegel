import React from 'react'

import isExists from 'siegel-utils/is/exists'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { List, BuilderList, Component, Props } from './types'


const componentID = '-ui-accordion'

function onClickHandler(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
}

const Accordion: Component = component(
    componentID,
    {
        theme: {
            root: '',
            item: '',
            item__empty: '',
            item_title_wrapper: '',
            item_title: '',
            item_children_wrapper: ''
        }
    },
    props => {

        const {
            className, theme, list, builder, accordionIcon, soloOpen, rootTagAttributes, autoExpand, refApi
        } = props


        function childrenMapper(listItem: (List | BuilderList)[number], i: number, _acc?: any) {
            const { children, expanded } = listItem
            const listItemTheme: Parameters<NonNullable<Props['builder']>>[0]['listItemTheme'] = {
                item: theme.item,
                item_title_wrapper: theme.item_title_wrapper,
                item_title: theme.item_title,
                item_children_wrapper: theme.item_children_wrapper,
                item__empty: theme.item__empty
            }

            let isExpanded = expanded
            let { title } = listItem as List[number]
            let isTitleAsItemEmpty
            if (builder) {
                const { elem, acc, replaceParentIfLast, expanded } = builder({
                    listItemTheme,
                    listItem: listItem as BuilderList[number],
                    index: i,
                    acc: _acc
                })

                _acc = acc
                title = elem
                isTitleAsItemEmpty = replaceParentIfLast
                isExists(expanded) && (isExpanded = expanded)
            }

            return children
                ?   <details key={ i } className={ listItemTheme.item } open={ isExpanded || autoExpand }
                        onClick={ onClickHandler }>

                        <summary className={ listItemTheme.item_title_wrapper }
                            onMouseDown={ onAccordionToggle }>

                            <div className={ listItemTheme.item_title } children={ title } />
                            { accordionIcon }
                        </summary>

                        <div className={ listItemTheme.item_children_wrapper }
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


        let _className = theme.item_children_wrapper
        className && (_className += ` ${className}`)

        let accordionRootProps = {
            className: _className,
            children: list.map((listItem, i) => childrenMapper(listItem, i))
        }
        refApi && (applyRefApi(accordionRootProps, props))
        rootTagAttributes && (accordionRootProps = mergeTagAttributes(accordionRootProps, rootTagAttributes))


        return <div { ...accordionRootProps } />
    }
)


export default Accordion
export { componentID }
export type { List, BuilderList, Component, Props }