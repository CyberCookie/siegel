import React, { useState } from 'react'
import { initDataGridStore } from 'siegel-ui/DataTable'
import { Props, SearchByFieldText, SearchByFieldDate, SearchByFieldSet } from 'siegel-ui/DataTable/types'

import { icons, Pagination, Select, Checkbox, Input, Calendar,
    paginationTheme, selectTheme, checkboxTheme, inputTheme } from 'app/components'

import styles from './styles.sass'


type PostProcessState = {
    selected: Set<ID>,
    activeCol: number
}
type PostProcessStore = [ PostProcessState, React.Dispatch<React.SetStateAction<PostProcessState>> ]


const dataTableSelectTheme = {
    ...selectTheme,
    root: `${selectTheme.root} ${styles.paginator_select}`,
    title: `${selectTheme.title} ${styles.paginator_select_title}`,
    label: `${selectTheme.label} ${styles.paginator_select_label}`,
    input_wrapper: styles.paginator_select_input_wrapper,
    options: `${selectTheme.options} ${styles.paginator_select_options}`,
    _active: `${selectTheme._active} ${styles.paginator_select__active}`
}

const paginatorSelectOptions = ([1,2,3]).map(num => {
    const value = num * 10
    return { value, title: value }
})

const nowTimestamp = Date.now()

function getHeadLabelMenuTableCell<T extends Parameters<NonNullable<Props['postProcessHeadCell']>>>(
{ cell, config, index, dataGridHookStore, postProcessStore, entities }:
{
    cell: T[0]
    config: T[1]
    index: T[2]
    entities: Props['entities']
    dataGridHookStore: NonNullable<Props['hookStore']>
    postProcessStore: PostProcessStore
}) {
    
    const [ dataGridHookState, setDataGridHookState ] = dataGridHookStore;

    const [ postProcessData, setPostprocessData ] = postProcessStore;
    const activeCol = postProcessData.activeCol;

    const isActiveLabelMenu = activeCol == index;
    
    function onLabelMenuOpen() {
        if (isActiveLabelMenu) {
            postProcessData.activeCol = -1;
        } else postProcessData.activeCol = index;
        
        setPostprocessData({ ...postProcessData })
    }
    
    const getActiveLabelMenu = () => {
        function onSort(e: React.MouseEvent) {
            e.stopPropagation()
            const { sortvalue, sortindex } = (e.currentTarget as HTMLDivElement).dataset;
    
            const { value: curValue, index: curIndex } = dataGridHookState.sortByField;
            const intIndex = +sortindex!;
            const intValue = (+sortvalue! as SortReturnValue);
    
            let index, value: SortReturnValue;
            curIndex == intIndex && curValue == intValue
                ?   (index = value = 0)
                :   (index = intIndex, value = intValue)
            dataGridHookState.sortByField = { index, value }
    
            setDataGridHookState({ ...dataGridHookState })
        }

        function getSearch() {
            const searchByField = dataGridHookState.searchByField;
            const { type, entityFieldPath, showValue } = config;
            let searchElement;
            
            if (type == 'set') {
                const resultCheckbox: JSX.Element[] = []
                const searchSet = (searchByField[index] as SearchByFieldSet) || new Set();
                const uniqValues: SearchByFieldSet = new Set()
                
                entities.each((entity, i) => {
                    const setValue = entity[entityFieldPath as string]
                    if (!uniqValues.has(setValue)) {
                        uniqValues.add(setValue)

                        resultCheckbox.push(
                            <Checkbox key={setValue} theme={checkboxTheme} value={!searchSet.has(setValue)}
                                className={styles.set_checkbox} label={showValue ? showValue(entity, i) : setValue}
                                icon={icons.check}
                                onChange={(checkboxValue, e) => {
                                    e.stopPropagation()
        
                                    checkboxValue ? searchSet.delete(setValue) : searchSet.add(setValue)
                                    searchByField[index] = searchSet;
        
                                    setDataGridHookState({ ...dataGridHookState })
                                }} />
                        )
                    }
                })


                searchElement = <>{resultCheckbox}</>
            } else if (type == 'date') {
                const { dateStart, dateEnd } = (searchByField[index] as SearchByFieldDate) || {}
                const rangeDateStart = dateStart || nowTimestamp;

                searchElement = (
                    <Calendar rangePick triggerOnlyWhenFinished={false}
                        initDate={{
                            rangeDateStart,
                            rangeDateEnd: dateEnd || rangeDateStart
                        }}
                        onChange={({ rangeDateStart: dateStart, rangeDateEnd: dateEnd }) => {
                            searchByField[index] = {
                                dateStart,
                                dateEnd: dateEnd || dateStart
                            }
                            setDataGridHookState({ ...dataGridHookState })
                        }} />
                )
            } else {
                searchElement = (
                    <Input theme={inputTheme} value={(searchByField[index] as SearchByFieldText) || ''} autofocus
                        className={styles.search_input}
                        onChange={value => {
                            (searchByField[index] as SearchByFieldText) = value;
                            setDataGridHookState({ ...dataGridHookState })
                        }} />
                )
            }

            
            return <div className={styles.search_wrapper} children={searchElement} />
        }


        return (
            <div className={styles.grid_col_menu} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.grid_col_menu_sort} onMouseDown={onSort}
                    data-sortvalue='-1' data-sortindex={index}>

                    {icons.chevron} ASC
                </div>

                <div className={styles.grid_col_menu_sort} onMouseDown={onSort}
                    data-sortvalue='1' data-sortindex={index}>

                    {icons.chevron} DESC
                </div>

                <div className={styles.grid_col_search} children={getSearch()} />
            </div>
        )
    }


    return {
        value: (
            <div className={styles.grid_col_label}>
                { cell.value }

                <div className={styles.grid_col_menu_toggle}>
                    { icons.moreVert }

                    { isActiveLabelMenu && getActiveLabelMenu() }
                </div>
            </div>
        ),
        attributes: { onMouseDown: onLabelMenuOpen }
    }
}

const displayQuantity = (count: number) => <div className={styles.paginator_count} children={'Total items: ' + count} />

function getSelectAllCheckboxTableCell<T extends Parameters<NonNullable<Props['postProcessHeadRow']>>>(
{ row, displayedEntityIDs, postProcessStore }:
{
    row: T[0]
    displayedEntityIDs: T[1]
    postProcessStore: PostProcessStore
}
) {
    
    const [ postProcessData, setPostprocessData ] = postProcessStore;
    const selected = postProcessData.selected;
    const { allPagesIDs, from, to } = displayedEntityIDs as NonNullable<typeof displayedEntityIDs>;

    let checkboxValue = true;
    for (let i = from; i < to; i++) {
        if (!selected.has(allPagesIDs[i])) {
            checkboxValue = false;
            break
        }
    }

    row[0].children.unshift({
        value: (
            <Checkbox value={checkboxValue}
                onChange={value => {
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
                }} />
        )
    })

    return row
}

function getSelectCheckboxTableCell<T extends Parameters<NonNullable<Props['postProcessBodyRow']>>>(
{ row, entity, postProcessStore }:
{
    row: T[0]
    entity: T[1]
    postProcessStore: PostProcessStore
}
) {

    const [ postProcessData, setPostprocessData ] = postProcessStore;
    const selected = postProcessData.selected;

    const value = selected.has(entity.id)
    
    row.children.unshift({
        value: (
            <Checkbox value={value}
                onChange={() => {
                    value
                        ?   selected.delete(entity.id)
                        :   selected.add(entity.id)

                    setPostprocessData({ ...postProcessData })
                }} />
        )
    })

    return row
}

export default (props: Props) => {
    const dataGridHookStore = initDataGridStore();
    const postProcessStore: PostProcessStore = useState({
        selected: new Set(),
        activeCol: -1
    })

    const result: Props = {
        ...props,
        hookStore: dataGridHookStore,
        resizable: true,
        withPagination: {
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
                    theme: {
                        ...paginationTheme,
                        _single: styles.pagination_single_page
                    }
                }
            }
        },
        postProcessHeadCell: (cell, config, index) => getHeadLabelMenuTableCell({
            cell, config, index, dataGridHookStore, postProcessStore,
            entities: props.entities
        }),
        
        postProcessHeadRow: (row, displayedEntityIDs) =>
            getSelectAllCheckboxTableCell({ row, displayedEntityIDs, postProcessStore }),

        postProcessBodyRow: (row, entity) => getSelectCheckboxTableCell({ row, entity, postProcessStore })
    }


    return result
}