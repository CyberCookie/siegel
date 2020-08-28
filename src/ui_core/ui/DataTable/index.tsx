import React, { useState } from 'react'

import Table from '../Table'
import { extractProps } from '../ui_utils'
import tableHeadRows from './head'
import tableBodyRows from './body'
import { _DataTable, DataTableTableProps, State, MergedProps } from './types'

import s from './styles.sass'


const componentID = '-ui-data_grid'

const initDataGridStore = () => useState({
    sortByField: {
        index: 0,
        value: 0
    },
    searchByField: {},
    showPerPage: 0,
    currentPage: 1
} as State)

function getPagination(props: MergedProps, resultIDs: ReturnType<typeof tableBodyRows>['resultIDs']) {
    const { withPagination, theme, hookStore } = props;

    const [ state, setState ] = hookStore!;
    const showPerPage = state.showPerPage;

    const { displayQuantity, select, pagination } = withPagination!;
    const { props: selectProps, component: Select } = select;
    const { props: paginationProps, component: Pagination } = pagination;

    const dataTableSelectProps = Object.assign({
        displayValue: showPerPage,
        onChange(value: number) {
            state.showPerPage = value;
            setState({ ...state })
        }
    }, selectProps)

    const dataTablePaginationProps = {
        showPerPage,
        listLength: resultIDs.length,
        curPage: state.currentPage,
        onChange(value: number) {
            state.currentPage = value;
            setState({ ...state })
        }
    }
    paginationProps && Object.assign(dataTablePaginationProps, paginationProps)

    
    return (
        <div className={theme.pagination_wrapper}>
            { displayQuantity && displayQuantity(resultIDs.length) }

            <Select {...dataTableSelectProps} />

            <Pagination {...dataTablePaginationProps} />
        </div>
    )
}

const DataTable: _DataTable = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DataTable.defaults, props)
        :   (props as _DataTable['defaults'] & typeof props)

    const { theme, className, attributes, withPagination, tableAttributes } = mergedProps;
    mergedProps.hookStore || (mergedProps.hookStore = initDataGridStore())

    const hookState = mergedProps.hookStore[0]
    
    const rootAttributes = { className }
    attributes && (Object.assign(rootAttributes, attributes))
    
    if (withPagination) {
        hookState.showPerPage || (hookState.showPerPage = withPagination.select.props.options[0].value)
        rootAttributes.className += ` ${theme._with_pagination}`
    }

    const { body, resultIDs, from, to } = tableBodyRows(mergedProps, hookState)
    const head = tableHeadRows(mergedProps, resultIDs, from, to)
    
    const dataTableTableProps: DataTableTableProps = {
        head, body,
        className: `${s.table} ${theme.table}`
    }
    withPagination && (dataTableTableProps.foot = [{
        children: [{
            value: getPagination(mergedProps, resultIDs),
            attributes: { colSpan: 100 }
        }]
    }])
    tableAttributes && (dataTableTableProps.attributes = tableAttributes)


    return <div {...rootAttributes} children={ <Table {...dataTableTableProps} /> } />
}
DataTable.defaults = {
    theme: {
        root: componentID,
        table: componentID + '_table',
        table_resizer: componentID + '_table_resizer',
        pagination_wrapper: componentID + '_pagination_wrapper',
        _with_pagination: componentID + '__with_pagination'
    }
}
DataTable.ID = componentID;


export { initDataGridStore, componentID }
export default DataTable