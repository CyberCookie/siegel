//TODO?: recursive merge select and pagination props
//TODO?: resize with %


import React, { useState } from 'react'

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

import type { ComponentAttributes } from '../_internals/types'
import type {
    Component, DataTableTableProps, State, Props,
    ColumnsConfig, SortState
} from './types'

import styles from './styles.sass'


const getDefaultState: () => State = () => ({
    sortByField: {},
    searchByField: {},
    toggledColumns: new Set(),
    showPerPage: 0,
    currentPage: 1
})

const DataTable: Component = component(
    componentID,
    {
        theme: {
            root: '',
            children: '',
            table: '',
            table_resizer: '',
            pagination_wrapper: '',
            _with_footer: ''
        }
    },
    props => {

        const {
            theme, className, rootTagAttributes, withFooter, tableAttributes, refApi,
            virtualization, children
        } = props
        props.store ||= useState( getDefaultState() )


        const hookState = props.store[0]

        let rootAttributes: ComponentAttributes<HTMLDivElement> = { className }

        if (withFooter) {
            if (!hookState.showPerPage && withFooter.select) {
                hookState.showPerPage = withFooter.select.props.options[0].value
            }

            rootAttributes.className += ` ${theme._with_footer}`
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


        const dataTableTableProps: DataTableTableProps = {
            body,
            head: getHead(props, hookState, resultIDs, from, to),
            className: `${styles.table} ${theme.table}`
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