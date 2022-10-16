//TODO?: recursive merge select and pagination props
//TODO?: resize with %


import React, { useState } from 'react'

import applyClassName from '../_internals/apply_classname'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'
import Table from '../Table/index'
import componentID from './id'
import {
    getBody, getHead, getPaginationFooter, applyVirtualization,
    GetPaginationFnProps
} from './helpers'

import type { ReactTagAttributes } from '../_internals/types'
import type {
    Component, DataTableTableProps, State, Props, DefaultProps,
    ColumnsConfig, SortState
} from './types'

import styles from './styles.sass'


const _undef = undefined

const getDefaultState: () => State = () => ({
    sortByField: {},
    searchByField: {},
    toggledColumns: new Set(),
    showPerPage: 0,
    currentPage: 1
})

const DataTable = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            children: _undef,
            table: _undef,
            table_resizer: _undef,
            pagination_wrapper: _undef,
            _with_footer: _undef
        }
    },
    props => {

        const {
            theme, className, rootTagAttributes, withFooter, tableAttributes, refApi,
            virtualization, children, store
        } = props

        const [ hookState ] = store || useState( getDefaultState() )

        let rootAttributes: ReactTagAttributes<HTMLDivElement> = { className }

        if (withFooter) {
            if (!hookState.showPerPage && withFooter.select) {
                hookState.showPerPage = withFooter.select.props.options[0].value
            }

            rootAttributes.className = applyClassName(
                rootAttributes.className,
                [[ theme._with_footer, true ]]
            )
        }


        let virtualizationParams
        if (virtualization) {
            virtualizationParams = applyVirtualization({ hookState, rootAttributes, props })
            rootAttributes.onScroll = virtualizationParams.onScrollHandler
        }


        refApi && (applyRefApi(rootAttributes, props))
        rootTagAttributes && (rootAttributes = mergeTagAttributes(rootAttributes, rootTagAttributes))


        const {
            body, resultIDs, from, to
        } = getBody(props, hookState, virtualizationParams?.slideWindowRange)

        virtualizationParams?.useVirtualizationScrolling(
            Math.min(virtualizationParams.maxItemsCount, resultIDs.length)
        )


        let tableRootClassName = styles.table!
        theme.table && (tableRootClassName += ` ${theme.table}`)

        const dataTableTableProps: DataTableTableProps = {
            body,
            head: getHead(props, hookState, resultIDs, from, to),
            className: tableRootClassName
        }
        withFooter && (dataTableTableProps.foot = [{
            children: [{
                value: getPaginationFooter(props as GetPaginationFnProps, resultIDs),
                attributes: { colSpan: 100 }
            }]
        }])
        tableAttributes && (dataTableTableProps.rootTagAttributes = tableAttributes)


        return (
            <div { ...rootAttributes }>
                <Table { ...dataTableTableProps } />

                { children && addChildren(children, theme) }
            </div>
        )
    }
)


export default DataTable
export { getDefaultState, componentID }
export type { Component, Props, ColumnsConfig, SortState }