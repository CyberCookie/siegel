import React, { useState, useEffect } from 'react'

import Table from '../Table'
import Select from '../Select'
import Pagination from '../Pagination'

import tableHeadRows from './head'
import tableBodyRows from './body'

import styles from './styles'


const selectTheme = {
    select: styles.select,
    label: styles.select_label,
    options: styles.select_options,
    option: styles.select_option,
    title: styles.select_title
}

const showPerPageOptions = [
    { title: 16, id: 16 },
    { title: 30, id: 30 },
    { title: 60, id: 60 },
    { title: 90, id: 90 }
]


const initDataGridState = () => useState({
    headData: {
        sortByField: {
            index: '',
            value: ''
        },
        searchByField: {},
        isAllSelected: false,
        showFieldCalendar: ''
    },

    bodyData: {
        selected: new Set(),
        showPerPage: 16,
        currentPage: 1
    }
})


const DataGrid = ({ entities, columnsConfig, rowActions = {}, className, hookState, withPagination }) => {
    let [ state, setState ] = hookState || initDataGridState()
    let { showPerPage, currentPage } = state.bodyData;

    useEffect(() => {
        let evOptions = { passive: true }
        function listener() {
            let showCalendar = state.headData.showCalendar;
            
            if (showCalendar) {
                state.headData.showCalendar = ''
                setState({ ...state })
            }
        }
        
        window.addEventListener('mousedown', listener, evOptions)
        
        return () => {
            window.removeEventListener('mousedown', listener, evOptions)
        }
    }, [])
    
    
    function getPagination() {
        function onShowPerPageChange(value) {
            state.bodyData.showPerPage = +value;
    
            let maxPages = Math.ceil(entities.sorted.length / +value)
            if (currentPage > maxPages) {
                state.bodyData.currentPage = maxPages
            }
    
            setState({ ...state })
        }
    
        function onPaginationChange(value) {
            state.bodyData.currentPage = value;
            setState({ ...state })
        }
        
        
        return (
            <div className={styles.pagination_wrapper}>
                <div className={styles.quantity}><span children={resultIDs.length} /> Results</div>

                <Select label='Событий на странице' options={showPerPageOptions}
                    theme={selectTheme}
                    displayValue={showPerPage}
                    onChange={onShowPerPageChange} />

                <Pagination showPerPage={showPerPage}
                    listLength={resultIDs.length}
                    curPage={currentPage}
                    onChange={onPaginationChange} />
            </div>
        )
    }

    let maxPages = Math.ceil(entities.sorted.length / showPerPage)
    currentPage > maxPages && (state.bodyData.currentPage = 1)


    let rowData = { state, setState, entities, columnsConfig, rowActions, withPagination }
    let { body, resultIDs } = tableBodyRows(rowData)
    let head = tableHeadRows(rowData, resultIDs)
    

    return (
        <div className={className || ''}>
            <Table className={styles.table} head={head} body={body} />
            
            { withPagination && getPagination() }
        </div>
    )
}


export { initDataGridState }
export default DataGrid