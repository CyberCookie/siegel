import React, { useState } from 'react'

import Table from '../Table'
import { extractProps } from '../ui_utils'
import tableHeadRows from './head'
import tableBodyRows from './body'
import { _DataTable, DataTableTableProps } from './types'

import s from './styles.sass'


const componentID = '-ui-data_grid'

const initDataGridStore = () => useState({
    headData: {
        sortByField: {
            index: 0,
            value: 0
        },
        searchByField: {}
    },

    bodyData: {
        showPerPage: 15,
        currentPage: 1
    }
})

const DataTable: _DataTable = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DataTable.defaults, props)
        :   (props as _DataTable['defaults'] & typeof props)

    const { className, theme, attributes, hookState, entities, withPagination, tableAttributes } = mergedProps;

    const rootAttributes = { className }
    attributes && (Object.assign(rootAttributes, attributes))

    const [ state, setState ] = hookState;
    const { showPerPage, currentPage } = state.bodyData;

    
    function getPagination() {
        const { displayQuantity, select, pagination } = withPagination as NonNullable<typeof withPagination>;
        const { props: selectProps, component: Select } = select;
        const { props: paginationProps, component: Pagination } = pagination;

        const maxPages = Math.ceil(entities.sorted.length / showPerPage)
        currentPage > maxPages && (state.bodyData.currentPage = 1)

        const dataTableSelectProps = Object.assign({
            displayValue: showPerPage,
            onChange(value: number) {
                state.bodyData.showPerPage = value;
        
                const maxPages = Math.ceil(entities.sorted.length / value)
                if (currentPage > maxPages) {
                    state.bodyData.currentPage = maxPages
                }
        
                setState({ ...state })
            }
        }, selectProps)

        const dataTablePaginationProps = {
            showPerPage,
            listLength: resultIDs.length,
            curPage: currentPage,
            onChange(value: number) {
                state.bodyData.currentPage = value;
                setState({ ...state })
            }
        }
        paginationProps && Object.assign(dataTablePaginationProps, paginationProps)

        
        
        return (
            <div className={s.pagination_wrapper}>
                { displayQuantity && displayQuantity(resultIDs.length) }

                <Select {...dataTableSelectProps} />

                <Pagination {...dataTablePaginationProps} />
            </div>
        )
    }


    const { body, resultIDs } = tableBodyRows(mergedProps, state)
    const head = tableHeadRows(mergedProps, resultIDs)
    
    const dataTableTableProps: DataTableTableProps = {
        head, body,
        className: `${s.table} ${theme.table}`
    }
    tableAttributes && (dataTableTableProps.attributes = tableAttributes)


    return (
        <div {...rootAttributes}>
            <Table {...dataTableTableProps} />
            
            { withPagination && getPagination() }
        </div>
    )
}
DataTable.defaults = {
    theme: {
        root: componentID,
        table: componentID + '_table',
        table_resizer: componentID + '_table_resizer',
        pagination_wrapper: componentID + '_pagination_wrapper'
    }
}
DataTable.ID = componentID;


export { initDataGridStore, componentID }
export default DataTable