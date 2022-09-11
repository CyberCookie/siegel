import React, { useState } from 'react'
import { getDefaultState, SortState } from 'siegel-ui/DataTable'

import {
    icons, Pagination, Select, Checkbox, Input, Calendar,
    paginationTheme, selectTheme, checkboxTheme, inputTheme
} from 'app/components'

import type { DemoDataTableProps } from './types'

import styles from './styles.sass'


type PostProcessState = {
    selected: Set<string>,
    activeColID: string
}
type PostProcessStore = ReactStore<PostProcessState>


const dataTableSelectTheme = Object.assign({}, selectTheme, {
    root: `${selectTheme!.root} ${styles.paginator_select}`,
    title: `${selectTheme!.title_text} ${styles.paginator_select_title}`,
    label: `${selectTheme!.label} ${styles.paginator_select_label}`,
    input_wrapper: styles.paginator_select_input_wrapper,
    options: `${selectTheme!.options} ${styles.paginator_select_options}`,
    _active: `${selectTheme!._active} ${styles.paginator_select__active}`
})

const dataTablePaginationTheme = Object.assign({}, paginationTheme, {
    _single: styles.pagination_single_page
})

const paginatorSelectOptions = ([1,2,3, 30]).map(num => {
    const value = num * 10
    return { value, title: value }
})

const nowTimestamp = Date.now()

function getHeadLabelMenuTableCell<T extends Parameters<NonNullable<DemoDataTableProps['postProcessHeadCell']>>>(
{ headCell, config, dataGridHookStore, postProcessStore, entities }:
{
    headCell: T[0]
    config: T[1]
    index: T[2]
    entities: DemoDataTableProps['entities']
    dataGridHookStore: NonNullable<DemoDataTableProps['store']>
    postProcessStore: PostProcessStore
}) {

    const [ dataGridHookState, setDataGridHookState ] = dataGridHookStore

    const [ postProcessData, setPostprocessData ] = postProcessStore
    const { activeColID } = postProcessData

    const { label, customParams, ID } = config
    const isActiveLabelMenu = activeColID == ID
    const { type, valuePath } = customParams!


    function onLabelMenuOpen() {
        postProcessData.activeColID = isActiveLabelMenu ? '' : ID
        setPostprocessData({ ...postProcessData })
    }

    const getActiveLabelMenu = () => {
        function onSort(e: React.MouseEvent) {
            e.stopPropagation()
            const { sortvalue, sortid } = (e.currentTarget as HTMLDivElement).dataset

            const { value: value, ID: curID } = dataGridHookState.sortByField as SortState
            const intValue = +sortvalue!

            dataGridHookState.sortByField = curID == sortid && value == intValue
                ?   {}
                :   {
                        ID: sortid,
                        value: sortvalue
                    }

            setDataGridHookState({ ...dataGridHookState })
        }

        function getSearch() {
            const searchByField = dataGridHookState.searchByField
            let searchElement

            if (type == 'set') {
                const resultCheckbox: JSX.Element[] = []
                const searchSet = searchByField[ID] || new Set()
                const uniqValues = new Set()

                entities.each((entity, i) => {
                    const setValue = entity[valuePath]
                    if (!uniqValues.has(setValue)) {
                        uniqValues.add(setValue)

                        resultCheckbox.push(
                            <Checkbox key={ setValue as string } theme={ checkboxTheme } value={ !searchSet.has(setValue) }
                                className={ styles.set_checkbox } label={ `${config.showValue!(entity, i).value}` }
                                icon={ icons.check }
                                onChange={ (checkboxValue, e) => {
                                    e.stopPropagation()

                                    checkboxValue ? searchSet.delete(setValue) : searchSet.add(setValue)
                                    searchByField[ID] = searchSet

                                    setDataGridHookState({ ...dataGridHookState })
                                } } />
                        )
                    }
                })


                searchElement = <>{resultCheckbox}</>
            } else if (type == 'date') {
                const { dateStart, dateEnd } = searchByField[ID] || {}
                const rangeDateStart = dateStart || nowTimestamp

                searchElement = (
                    <Calendar rangePick triggerOnlyWhenFinished={ false }
                        initDate={{
                            rangeDateStart,
                            rangeDateEnd: dateEnd || rangeDateStart
                        }}
                        onChange={ ({ rangeDateStart: dateStart, rangeDateEnd: dateEnd }) => {
                            searchByField[ID] = {
                                dateStart,
                                dateEnd: dateEnd || dateStart
                            }
                            setDataGridHookState({ ...dataGridHookState })
                        } } />
                )
            } else {
                searchElement = (
                    <Input theme={ inputTheme } value={ searchByField[ID] || '' } autofocus
                        className={ styles.search_input }
                        onChange={ value => {
                            searchByField[ID] = value
                            setDataGridHookState({ ...dataGridHookState })
                        } } />
                )
            }


            return <div className={ styles.search_wrapper } children={ searchElement } />
        }


        return (
            <div className={ styles.grid_col_menu } onMouseDown={ e => e.stopPropagation() }>
                <div className={ styles.grid_col_menu_sort } onMouseDown={ onSort }
                    data-sortvalue='-1' data-sortid={ ID }>

                    { icons.chevron } ASC
                </div>

                <div className={ styles.grid_col_menu_sort } onMouseDown={ onSort }
                    data-sortvalue='1' data-sortid={ ID }>

                    { icons.chevron } DESC
                </div>

                <div className={ styles.grid_col_search } children={ getSearch() } />
            </div>
        )
    }


    headCell.value = (
        <div className={ styles.grid_col_label }>
            { label }

            <div className={ styles.grid_col_menu_toggle }>
                { icons.more_vert }

                { isActiveLabelMenu && getActiveLabelMenu() }
            </div>
        </div>
    )
    headCell.attributes = {
        onMouseDown: onLabelMenuOpen,
        className: customParams!.className
    }
}

const displayQuantity = (count: number) => <div className={ styles.paginator_count } children={ 'Total items: ' + count } />

function getSelectAllCheckboxTableCell<T extends Parameters<NonNullable<DemoDataTableProps['postProcessHeadRow']>>>(
{ row, displayedEntityIDs, postProcessStore }:
{
    row: T[0]
    displayedEntityIDs: T[1]
    postProcessStore: PostProcessStore
}
) {

    const [ postProcessData, setPostprocessData ] = postProcessStore
    const selected = postProcessData.selected
    const { allPagesIDs, from, to } = displayedEntityIDs as NonNullable<typeof displayedEntityIDs>

    let checkboxValue = true
    for (let i = from; i < to; i++) {
        if (!selected.has(allPagesIDs[i])) {
            checkboxValue = false
            break
        }
    }

    row[0].children.unshift({
        value: (
            <Checkbox value={ checkboxValue }
                onChange={ value => {
                    if (value) {
                        for (let i = from; i < to; i++) {
                            selected.has(allPagesIDs[i]) || selected.add(allPagesIDs[i])
                        }
                    } else {
                        for (let i = from; i < to; i++) {
                            selected.has(allPagesIDs[i]) && selected.delete(allPagesIDs[i])
                        }
                    }

                    setPostprocessData({ ...postProcessData })
                } } />
        ),
        attributes: {
            className: styles.row_selector
        }
    })
}

function getSelectCheckboxTableCell<T extends Parameters<NonNullable<DemoDataTableProps['postProcessBodyRow']>>>(
{ row, entity, postProcessStore }:
{
    row: T[0]
    entity: T[1]
    postProcessStore: PostProcessStore
}
) {

    const [ postProcessData, setPostprocessData ] = postProcessStore
    const selected = postProcessData.selected

    const value = selected.has(entity.id)

    row[0].children.unshift({
        value: (
            <Checkbox value={ value }
                onChange={ () => {
                    value
                        ?   selected.delete(entity.id)
                        :   selected.add(entity.id)

                    setPostprocessData({ ...postProcessData })
                } } />
        ),
        attributes: {
            className: styles.row_selector
        }
    })
}

const gridDefaultState = getDefaultState()

function getExtendedDataTableProps(props: DemoDataTableProps) {
    const dataGridHookStore = useState(gridDefaultState)
    const postProcessStore: PostProcessStore = useState({
        selected: new Set(),
        activeColID: ''
    })

    const newProps: DemoDataTableProps = Object.assign({}, props, {
        store: dataGridHookStore,
        resizable: true,
        withFooter: {
            displayQuantity,
            select: {
                component: Select,
                props: {
                    options: paginatorSelectOptions,
                    theme: dataTableSelectTheme,
                    label: 'Show per page'
                }
            },
            pagination: {
                component: Pagination,
                props: {
                    theme: dataTablePaginationTheme
                }
            }
        },
        postProcessHeadCell: (headCell, config, index) => getHeadLabelMenuTableCell({
            headCell, config, index,
            dataGridHookStore, postProcessStore,
            entities: props.entities
        }),

        postProcessHeadRow: (row, displayedEntityIDs) =>
            getSelectAllCheckboxTableCell({ row, displayedEntityIDs, postProcessStore }),

        postProcessBodyRow: (row, entity) => getSelectCheckboxTableCell({ row, entity, postProcessStore })
    } as Partial<DemoDataTableProps>)


    return newProps
}


export default getExtendedDataTableProps