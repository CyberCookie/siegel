import React, { useState } from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import isE from '../../../utils/is_exists'
import addInputFieldAttributes from '../input_field_attributes'
import getLabel from '../label'
import type { _DropdownSearch, MergedProps, Store, State } from './types'


const componentID = '-ui-dropdown_search'

function getSearchOptions({ onChange, searchOptions, theme }: MergedProps, store: Store) {
    const [{ searchString }, setState ] = store;
    const searchLower = searchString && searchString.toLowerCase()

    const options: JSX.Element[] = []
    for (const id in searchOptions) {
        const { title, value, className } = searchOptions[id]
        
        const canPush = !searchLower || value.toLowerCase().includes(searchLower)
        

        if (canPush) {
            let optionClassMame = theme.option;
            className && (optionClassMame += ` ${className}`)

            options.push(
                <div key={id} className={optionClassMame} children={title}
                    onMouseDown={e => {
                        setState({ searchString: undefined })
                        onChange(id, e)
                    }} />
            )
        }
    }


    return <div children={options} className={theme.options} />
}

const DropdownSearch: _DropdownSearch = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props)
        :   (props as _DropdownSearch['defaults'] & typeof props)

    const { theme, searchOptions, minInputLength, onSearch, disabled, label, payload,
        className, showOnFocus, selected, onChange } = mergedProps;
    
    const store = useState({ searchString: undefined } as State)
    const [ state, setState ] = store;
    const { searchString } = state;

    
    const dropdownSearchRootProps: ComponentAttributes = { className }
    const inputProps: NonNullable<typeof props.inputAttributes> = {
        disabled,
        className: theme.field,
        value: isE(searchString)
            ?   searchString
            :   selected
                ?   searchOptions[selected].value
                :   ''
    }


    const { isFocused } = addInputFieldAttributes(
        inputProps, dropdownSearchRootProps, mergedProps,
        (_, e) => {
            if (state.searchString == '') {
                onChange('', e)
            } else state.searchString = undefined
        }
    )[0]

    let options: JSX.Element | undefined
    if (!disabled) {
        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const searchValue = e.target.value;
            state.searchString = searchValue;
            setState({ ...state })
            
            onSearch && onSearch(searchValue, e, payload)
        }
        
        const searchLength = searchString ? searchString.length : 0;
        const isShowOptions = showOnFocus
            ?   isFocused
            :   searchLength >= minInputLength;

        if  (isShowOptions) {
            options = getSearchOptions(mergedProps, store)
            dropdownSearchRootProps.className +=  ` ${theme._with_suggestions}`
        }
    }



    let inputElement = <input {...inputProps} />
    label && (inputElement = getLabel(
        inputElement,
        { className: theme.label },
        { className: theme.label_text, children: label }
    ))

    
    return (
        <div {...dropdownSearchRootProps}>
            { inputElement }
            { options }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        field: componentID + '_search_field',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        options: componentID + '_options',
        option: componentID + '_option',
        _with_suggestions: componentID + '__with_suggestions',
        _disabled: componentID + '_disabled',
        _focused: componentID + '__focused',
        _touched: componentID + '__touched'
    },

    minInputLength: 3
}
DropdownSearch.ID = componentID;


export { componentID }
export default DropdownSearch