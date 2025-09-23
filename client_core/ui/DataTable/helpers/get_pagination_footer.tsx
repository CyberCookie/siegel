import React from 'react'

import type { Props as PaginationProps } from '../../Pagination'
import type { Props as SelectProps } from '../../Select'
import type { Props } from '../types'
import type { GetPaginationFnProps } from './get_pagination_footer_types'


function getPaginationFooter(
    props: GetPaginationFnProps,
    store: NonNullable<Props['store']>,
    resultIDs: string[]
) {

    const {
        theme,
        withFooter: { displayQuantity, select, pagination }
    } = props

    const totalItems = resultIDs.length

    let className = theme.pagination_wrapper
    let showPerPageSelectEl, paginationEl
    if (select || pagination) {

        const [ state, setState ] = store
        const { showPerPage, currentPage } = state


        if (select) {
            const { props: selectProps, component: Select } = select

            const dataTableSelectProps = Object.assign({
                selected: showPerPage,
                multiselect: false,
                onChange(value: number) {
                    if (value > 0) {
                        state.showPerPage = value
                        setState({ ...state })
                    }
                }
            } satisfies Partial<SelectProps>, selectProps)

            showPerPageSelectEl = <Select { ...dataTableSelectProps } />
        }

        if (pagination) {
            const {
                props: paginationProps,
                component: Pagination,
                isRenderForSinglePage
            } = pagination

            if (isRenderForSinglePage || showPerPage < totalItems) {
                const dataTablePaginationProps: PaginationProps = {
                    showPerPage,
                    listLength: totalItems,
                    curPage: currentPage,
                    onChange(value) {
                        state.currentPage = value
                        setState({ ...state })
                    }
                }
                paginationProps && Object.assign(dataTablePaginationProps, paginationProps)

                paginationEl = <Pagination { ...dataTablePaginationProps } />
            }

        } else className += ` ${theme.pagination_single_page}`
    }


    return (
        <div className={ className }>
            { displayQuantity?.(totalItems) }
            { showPerPageSelectEl }
            { paginationEl }
        </div>
    )
}


export { getPaginationFooter }
export type { GetPaginationFnProps }