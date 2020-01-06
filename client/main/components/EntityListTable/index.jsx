import React, { useState, useEffect } from 'react'

import { Table, Select, Pagination } from 'app/components/theme'

import tableHeadRows from './head'
import tableBodyRows from './body'

import iconStyles from 'app/styles/icons'
import styles from './styles'


const selectTheme = {
    select: styles.select,
    label: styles.select_label,
    options: styles.select_options,
    option: styles.select_option,
    title: styles.select_title
}

const showPerPageOptions = {
    16: { title: 16 },
    30: { title: 30 },
    60: { title: 60 },
    90: { title: 90 }
}

export default ({ entities, configuration, rowActions, className }) => {
    let [ state, setState ] = useState({
        headData: {
            sortByField: {
                index: '',
                value: ''
            },
            searchByField: {},
            isAllSelected: false,
            showFieldCalendar: '',
        },
    
        bodyData: {
            // updatedFieldsByID: {},
            // selectedToEdit: {
            //     id: '',
            //     fieldName: ''
            // },
            selected: new Set(),
            showPerPage: 16,
            currentPage: 1
        }
    })

    let { showPerPage, currentPage } = state.bodyData;

    // console.log(state)

    useEffect(() => {
        function listener() {
            // let selectedToEditID = state.bodyData.selectedToEdit.id;
            let showCalendar = state.headData.showCalendar;
    
            if (/*selectedToEditID || */showCalendar) {
                // state.bodyData.selectedToEdit.id = '';
                state.headData.showCalendar = ''
                
                setState({ ...state })
            }
        }

        window.addEventListener('mousedown', listener, { passive: true })

        return () => {
            window.removeEventListener('mousedown', listener, { passive: true })
        }
    }, [])

    function onShowPerPageChange(value) {
        state.bodyData.showPerPage = value;
        setState({ ...state })
    }

    function onPaginationChange(value) {
        state.bodyData.currentPage = value;
        setState({ ...state })
    }


    let rowData = { state, setState, entities, configuration, rowActions }
    let head = tableHeadRows(rowData)
    let { body, allBodyLength } = tableBodyRows(rowData)
    // let allBodyLength = 500
    // let body = []
    // let head = []
    
    
    return (
        <div>
            <Table className={`${className} ${styles.table}`}
                head={head} body={body} />
            
            <div className={styles.pagination_wrapper}>
                <div className={styles.quantity}><span children={allBodyLength} /> Results</div>

                <Select label='Show' options={showPerPageOptions}
                    theme={selectTheme}
                    value={{ title: showPerPage }}
                    dropdownIcon={<i className={iconStyles.dropdown} />}
                    onSelect={onShowPerPageChange} />

                <Pagination showPerPage={showPerPage}
                    listLength={allBodyLength}
                    curPage={currentPage}
                    onPageClick={onPaginationChange} />
            </div>
        </div>
    )
}