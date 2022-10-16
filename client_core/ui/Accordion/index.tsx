import React, { useState, useMemo } from 'react'

import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { List, BuilderList, Component, DefaultProps, Props } from './types'


const _undef = undefined
const componentID = '-ui-accordion'

const getStringPath = (key: string | number, prefix: string | number | undefined) => (
    isExists(prefix) ? `${prefix}.${key}` : key
)

function getExpandersPaths(list: List | BuilderList, pathPrefix?: string | number) {
    const tree: Indexable = {}
    list.forEach((item, i) => {
        const { id, children } = item

        if (children) {
            const key = getStringPath(id || i, pathPrefix)
            tree[key] = true

            Object.assign(tree, getExpandersPaths(children, key))
        }
    })


    return tree
}

const getDefaultState = (list?: List | BuilderList) => ({
    expandedPaths: list
        ?   useMemo(() => getExpandersPaths(list), [])
        :   {} as Indexable
})

const Accordion = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            item: _undef,
            item__empty: _undef,
            item__expanded: _undef,
            item_title_wrapper: _undef,
            item_title: _undef,
            nested_list: _undef
        }
    },
    props => {

        const {
            className, theme, list, builder, accordionIcon, soloOpen, rootTagAttributes,
            autoExpand, refApi, store
        } = props

        const [ state, setState ] = store || useState(
            getDefaultState( autoExpand ? list : _undef )
        )
        const { expandedPaths } = state


        function childrenMapper(
            listItem: (List | BuilderList)[number],
            i: number,
            prefix?: string | number,
            _acc?: any
        ) {

            const { children, id } = listItem

            const path = getStringPath(id || i, prefix)
            const isExpanded = expandedPaths[path]


            const listItemTheme: Parameters<NonNullable<Props['builder']>>[0]['listItemTheme'] = {
                item: theme.item,
                item__empty: theme.item__empty,
                item__expanded: theme.item__expanded,
                item_title_wrapper: theme.item_title_wrapper,
                item_title: theme.item_title,
                nested_list: theme.nested_list
            }


            let title: List[number]['title']
            if (builder) {
                const { elem, acc } = builder({
                    listItemTheme,
                    listItem: listItem as BuilderList[number],
                    index: i,
                    acc: _acc
                })

                _acc = acc
                title = elem

            } else title = listItem.title


            if (children) {
                const nestedChildrenElements = children.map((listItem, i) => (
                    childrenMapper(listItem as List[number], i, path, _acc)
                ))

                const itemClassName = applyClassName(listItemTheme.item, [[
                    listItemTheme.item__expanded, isExpanded
                ]])

                function onExpandToggle() {
                    if (isExpanded) {
                        for (const expandedPath in expandedPaths) {
                            if (expandedPath.startsWith(path as string)) {
                                delete expandedPaths[expandedPath]
                            }
                        }
                    } else {
                        if (soloOpen) {
                            for (const expandedPath in expandedPaths) {
                                if (!path.toString().startsWith(expandedPath)) {
                                    delete expandedPaths[expandedPath]
                                }
                            }
                        }
                        expandedPaths[path] = true
                    }

                    setState({ expandedPaths })
                }


                return (
                    <li key={ path } className={ itemClassName }>
                        <div className={ listItemTheme.item_title_wrapper } onMouseDown={ onExpandToggle }>
                            <div className={ listItemTheme.item_title } children={ title } />
                            { accordionIcon }
                        </div>

                        <ul className={ listItemTheme.nested_list } children={ nestedChildrenElements } />
                    </li>
                )

            } else return <li key={ path } className={ listItemTheme.item__empty } children={ title } />
        }


        let accordionRootProps = {
            className: applyClassName(theme.nested_list, [[ className, true ]]),
            children: list.map((listItem, i) => childrenMapper(listItem, i))
        }
        refApi && (applyRefApi(accordionRootProps, props))
        rootTagAttributes && (accordionRootProps = mergeTagAttributes(accordionRootProps, rootTagAttributes))


        return <ul { ...accordionRootProps } />
    }
)


export default Accordion
export { componentID, getDefaultState }
export type { List, BuilderList, Component, Props }