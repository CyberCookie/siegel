import React, { useState } from 'react'

import Table from '../Table'
import Select from '../_form/Select'
import Pagination from '../Pagination'
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
        showPerPage: 16,
        currentPage: 1
    }
})

const DataTable: _DataTable = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _DataTable['defaults'] & typeof props)
        :   extractProps(DataTable.defaults, props)

    const { theme, attributes, hookState, entities, pagination, tableAttributes } = mergedProps;

    const rootAttributes = {
        className: `${s.table} ${mergedProps.className} ${theme.data_table}`
    }
    attributes && (Object.assign(rootAttributes, attributes))

    const [ state, setState ] = hookState;
    const { showPerPage, currentPage } = state.bodyData;

    
    function getPagination() {
        const { displayQuantity, selectProps, paginationProps } = pagination as NonNullable<typeof pagination>;

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
        className: `${s.table} ${theme.data_table}`
    }
    tableAttributes && (dataTableTableProps.attributes = tableAttributes)


    return (
        <div {...rootAttributes}>
            <Table {...dataTableTableProps} />
            
            { pagination && getPagination() }
        </div>
    )
}
DataTable.defaults = {
    theme: {
        data_table: componentID,
        table: componentID + '_table',
        table_resizer: componentID + '_table_resizer',
        pagination_wrapper: componentID + '_pagination_wrapper'
    }
}
DataTable.ID = componentID;


export { initDataGridStore, componentID }
export default DataTable