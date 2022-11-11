//TODO?: resize with %


import React, { useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import applyRefApi from '../_internals/ref_apply'
import Table from '../Table/index'
import componentID from './id'
import {
    getBody, getHead, getPaginationFooter, applyVirtualization,
    GetPaginationFnProps
} from './helpers'

import type { DivTagAttributes } from '../_internals/types'
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
            theme, className, rootTagAttributes, withFooter, tableAttributes,
            virtualization, children, store, onScroll
        } = props

        const [ hookState ] = store || useState( getDefaultState() )

        let rootAttributes: DivTagAttributes = {
            onScroll,
            className: applyClassName(className, [[ theme._with_footer, withFooter ]])
        }

        if (withFooter && !hookState.showPerPage && withFooter.select) {
            hookState.showPerPage = withFooter.select.props.options[0].value
        }


        let virtualizationParams
        if (virtualization) {
            virtualizationParams = applyVirtualization({ hookState, rootAttributes, props })
            rootAttributes.onScroll = virtualizationParams.onScrollHandler
        }

        applyRefApi(rootAttributes, props)
        rootAttributes = resolveTagAttributes(rootAttributes, rootTagAttributes)


        const {
            body, resultIDs, from, to
        } = getBody(props, hookState, virtualizationParams?.slideWindowRange)

        virtualizationParams?.useVirtualizationScrolling(
            Math.min(virtualizationParams.maxItemsCount, resultIDs.length)
        )


        let dataTableTableProps: DataTableTableProps = {
            body,
            head: getHead(props, hookState, resultIDs, from, to),
            className: applyClassName(
                styles.table!,
                [[ theme.table, true ]]
            )!
        }
        withFooter && (dataTableTableProps.foot = [{
            children: [{
                value: getPaginationFooter(props as GetPaginationFnProps, resultIDs),
                attributes: { colSpan: 100 }
            }]
        }])
        dataTableTableProps = resolveTagAttributes(dataTableTableProps, tableAttributes)


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
export type { Component, Props, ColumnsConfig, SortState }