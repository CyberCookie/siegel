//TODO: arrow controlls when focues

import React, { useState } from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import isE from '../../../utils/is_exists'
import Input, { getDefaultInputStoreState } from '../Input'
import type { _DropdownSearch, MergedProps, Store, State } from './types'
import type { Props as InputProps } from '../Input/types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

function getSearchOptions({ onChange, searchOptions, theme, selected }: MergedProps, store: Store) {
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
                        if (id !== selected) {
                            setState({ searchString: undefined })
                            onChange(id, e)
                        }
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

    const { theme, searchOptions, minInputLength, onSearch, payload, className, showOnFocus, selected, onChange, 
        disabled, label, inputStore, errorMsg, placeholder, inputAttributes, autofocus, regexp } = mergedProps;
    
    const store = useState({ searchString: undefined } as State)
    const [ state, setState ] = store;
    const { searchString } = state;

    
    const _inputStore = inputStore || useState(getDefaultInputStoreState())
    const { isFocused } = _inputStore[0]

    const dropdownSearchRootProps: ComponentAttributes = {
        className,
        onBlur(e) {
            if (e.relatedTarget !== e.currentTarget) {
                if (state.searchString == '') {
                    onChange('', e)
                } else state.searchString = undefined
            }
        }
    }
    const inputProps: InputProps = {
        disabled, label, errorMsg, theme, placeholder, inputAttributes, autofocus, regexp,
        inputStore: _inputStore,
        attributes: {
            tabIndex: 0
        },
        className: styles[componentID + '__input_inner'],
        onChange(value, e) {
            state.searchString = value;
            setState({ ...state })
            
            onSearch && onSearch(value, e, payload)
        },
        value: isE(searchString)
            ?   searchString
            :   selected
                ?   searchOptions[selected].value
                :   ''
    }

    
    const searchLength = searchString ? searchString.length : 0;
    const isShowOptions = showOnFocus
        ?   isFocused
        :   searchLength >= minInputLength;
    
    let options: JSX.Element | undefined
    if (isShowOptions) {
        options = getSearchOptions(mergedProps, store)
        dropdownSearchRootProps.className +=  ` ${theme._with_suggestions}`
    }

    
    return (
        <div {...dropdownSearchRootProps}>
            <Input { ...inputProps } />
            { options }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        options: componentID + '_options',
        option: componentID + '_option',
        error_text: componentID + '_error_text',
        field: componentID + '_search_field',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        _with_suggestions: componentID + '__with_suggestions',
        _filled: componentID + '__filled',
        _error: componentID + '__error',
        _disabled: componentID + '_disabled',
        _focused: componentID + '__focused',
        _touched: componentID + '__touched'
    },

    minInputLength: 3
}
DropdownSearch.ID = componentID;


export { componentID }
export default DropdownSearch