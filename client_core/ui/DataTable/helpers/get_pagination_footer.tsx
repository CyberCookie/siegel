import React from 'react'

import type { MergedProps } from '../types'


type GetPaginationFnProps = {
    withFooter: NonNullable<MergedProps['withFooter']>
} & MergedProps


function getPaginationFooter(props: GetPaginationFnProps, resultIDs: string[]) {
    const {
        theme, store,
        withFooter: { displayQuantity, select, pagination }
    } = props


    let showPerPageSelectEl, paginationEl
    if (select || pagination) {
        const [ state, setState ] = store!
        const showPerPage = state.showPerPage


        if (select) {
            const { props: selectProps, component: Select } = select

            const dataTableSelectProps = Object.assign({
                selected: showPerPage,
                onChange(value: number) {
                    state.showPerPage = value
                    setState({ ...state })
                }
            }, selectProps)

            showPerPageSelectEl = <Select { ...dataTableSelectProps } />
        }

        if (pagination) {
            const { props: paginationProps, component: Pagination } = pagination

            const dataTablePaginationProps = {
                showPerPage,
                listLength: resultIDs.length,
                curPage: state.currentPage,
                onChange(value: number) {
                    state.currentPage = value
                    setState({ ...state })
                }
            }
            paginationProps && Object.assign(dataTablePaginationProps, paginationProps)

            paginationEl = <Pagination { ...dataTablePaginationProps } />
        }
    }


    return (
        <div className={ theme.pagination_wrapper }>
            { displayQuantity?.(resultIDs.length) }
            { showPerPageSelectEl }
            { paginationEl }
        </div>
    )
}


export { getPaginationFooter }
export type { GetPaginationFnProps }