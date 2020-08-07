import React, { useState } from 'react'

import { initDataGridStore } from 'core-ui/DataTable'
import { Props, SearchByFieldText, SearchByFieldDate, SearchByFieldSet } from 'core-ui/DataTable/types'
import Paginator from 'core-ui/Pagination'
import Select from 'core-ui/_form/Select'
import Checkbox from 'core-ui/_form/Checkbox'
import Input from 'core-ui/_form/Input'
import Calendar from 'core-ui/_form/Calendar'
import { theme as paginatorTheme } from '../Pagination'
import { theme as selectTheme } from '../Select'
import { theme as checkboxTheme } from '../Checkbox'
import { theme as inputTheme } from '../Input'
import { theme as calendarTheme } from '../Calendar'
import { chevron, check, moreVert } from '../../icons'

import s from './styles.sass'


type PostProcessState = {
    selected: Set<ID>,
    activeCol: number
}
type PostProcessStore = [ PostProcessState, React.Dispatch<React.SetStateAction<PostProcessState>> ]


const dataTableSelectTheme = {
    ...selectTheme,
    root: `${selectTheme.root} ${s.paginator_select}`,
    title: `${selectTheme.title} ${s.paginator_select_title}`,
    label: `${selectTheme.label} ${s.paginator_select_label}`,
    input_wrapper: s.paginator_select_input_wrapper,
    options: `${selectTheme.options} ${s.paginator_select_options}`,
    _active: `${selectTheme._active} ${s.paginator_select__active}`
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
            const type = config.type;
            let searchElement;

            if (type == 'set') {
                const resultCheckbox: JSX.Element[] = []
                const searchSet = (searchByField[index] as SearchByFieldSet) || new Set();
                const uniqValues: SearchByFieldSet = new Set()

                entities.each(entity => {
                    const setValue = entity[config.entityFieldPath as string]
                    if (!uniqValues.has(setValue)) {
                        uniqValues.add(setValue)

                        resultCheckbox.push(
                            <Checkbox key={setValue} theme={checkboxTheme} value={!searchSet.has(setValue)}
                                className={s.set_checkbox} label={setValue} icon={check}
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
                    <Calendar theme={calendarTheme} prevIcon={chevron} nextIcon={chevron}
                        rangePick triggerOnlyWhenFinished={false}
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
                        className={s.search_input}
                        onChange={value => {
                            (searchByField[index] as SearchByFieldText) = value;
                            setDataGridHookState({ ...dataGridHookState })
                        }} />
                )
            }

            
            return <div className={s.search_wrapper} children={searchElement} />
        }


        return (
            <div className={s.grid_col_menu} onMouseDown={e => e.stopPropagation()}>
                <div className={s.grid_col_menu_sort} onMouseDown={onSort}
                    data-sortvalue='-1' data-sortindex={index}>

                    {chevron} ASC
                </div>

                <div className={s.grid_col_menu_sort} onMouseDown={onSort}
                    data-sortvalue='1' data-sortindex={index}>

                    {chevron} DESC
                </div>

                <div className={s.grid_col_search} children={getSearch()} />
            </div>
        )
    }


    return {
        value: (
            <div className={s.grid_col_label}>
                { cell.value }

                <div className={s.grid_col_menu_toggle}>
                    { moreVert }

                    { isActiveLabelMenu && getActiveLabelMenu() }
                </div>
            </div>
        ),
        attributes: { onMouseDown: onLabelMenuOpen }
    }
}

const displayQuantity = (count: number) => <div className={s.paginator_count} children={'Total items: ' + count} />

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
    const { allPagesIDs, from, to } = displayedEntityIDs!;

    let checkboxValue = true;
    for (let i = from; i < to; i++) {
        if (!selected.has(allPagesIDs[i])) {
            checkboxValue = false;
            break
        }
    }

    row[0].children.unshift({
        value: (
            <Checkbox theme={checkboxTheme} icon={check}
                value={checkboxValue}
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
            <Checkbox theme={checkboxTheme} icon={check}
                value={value}
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
                component: Paginator,
                props: {
                    theme: {
                        ...paginatorTheme,
                        _single: s.pagination_single_page
                    },
                    controlIcon: chevron,
                    separator: '---'
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