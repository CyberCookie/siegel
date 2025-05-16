//TODO?: resize with %
//TODO?: virtualization handle dynamic height


import React, { useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'
import Table from '../Table/index'
import {
    getBody, getHead, getPaginationFooter, applyVirtualization,
    GetPaginationFnProps
} from './helpers'

import type { DivTagAttributes } from '../_internals/types'
import type {
    Component, DataTableTableProps, State, Props, DefaultProps,
    ColumnsConfig, StateSortValues
} from './types'

import styles from './styles.sass'


const componentID = '-ui-data_grid'

const _undef = undefined

const getDefaultState: () => State = () => ({
    sortByField: {
        ID: _undef,
        value: 1
    },
    searchByField: {},
    toggledColumns: new Set(),
    showPerPage: 0,
    currentPage: 1,
    __resultIDs: []
})

const DataTable = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _with_footer: _undef,
            children: _undef,
            table: _undef,
            table_resizer: _undef,
            pagination_wrapper: _undef,
            pagination_single_page: _undef
        }
    },
    props => {

        const {
            theme, className, rootTagAttributes, withFooter, tableAttributes,
            virtualization, children, store, onScroll
        } = props

        const innerStore = store || useState( getDefaultState() )
        const [ state ] = innerStore

        let rootAttributes: DivTagAttributes = {
            onScroll,
            className: applyClassName(className, [[ theme._with_footer, withFooter ]])
        }

        if (withFooter && !state.showPerPage) {
            state.showPerPage = withFooter.defaultShowPerPage
        }


        let virtualizationParams
        if (virtualization) {
            virtualizationParams = applyVirtualization({ state, rootAttributes, props })
            rootAttributes.onScroll = virtualizationParams.onScrollHandler
        }

        applyRefApi(rootAttributes, props)
        rootAttributes = resolveTagAttributes(rootAttributes, rootTagAttributes)


        const {
            body, resultIDs, from, to
        } = getBody(props, state, virtualizationParams?.slideWindowRange)

        virtualizationParams?.useVirtualizationScrolling(
            Math.min(virtualizationParams.maxItemsCount, resultIDs.length)
        )


        let dataTableTableProps: DataTableTableProps = {
            body,
            head: getHead(props, state, resultIDs, from, to),
            className: applyClassName(
                styles.table,
                [[ theme.table, true ]]
            )!
        }
        withFooter && (dataTableTableProps.foot = [{
            children: [{
                value: getPaginationFooter(props as GetPaginationFnProps, innerStore, resultIDs),
                attributes: { colSpan: 100 }
            }]
        }])
        dataTableTableProps = resolveTagAttributes(dataTableTableProps, tableAttributes)


        state.__resultIDs = resultIDs


        return (
            <div { ...rootAttributes }>
                <Table { ...dataTableTableProps } />

                { addChildren(children, theme) }
            </div>
        )
    }
)


export default DataTable
export { getDefaultState, componentID }
export type { Component, Props, State, ColumnsConfig, StateSortValues }