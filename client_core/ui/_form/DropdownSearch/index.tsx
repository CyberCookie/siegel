//TODO: apply arrow controls when focused

import React, { useState } from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import isE from '../../../utils/is_exists'
import Input, { getDefaultInputStoreState } from '../Input'
import type { _DropdownSearch, MergedProps, Store, State, Props } from './types'
import type { Props as InputProps } from '../Input/types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

function getSearchOptions({ showAll, onChange, searchOptions, theme, selected }: MergedProps, store: Store) {
    const [{ searchString }, setState ] = store;
    const searchLower = searchString && searchString.toLowerCase()

    const options: JSX.Element[] = []
    for (const id in searchOptions) {
        const { title, value, className } = searchOptions[id]
        
        const canPush = showAll || (!searchLower || value.toLowerCase().includes(searchLower))
        

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
        ?   extractProps(DropdownSearch.defaults, props, false)
        :   (props as _DropdownSearch['defaults'] & Props)

    const {
        theme, searchOptions, minInputLength, onSearch, payload, className, showOnFocus, showAlways,
        selected, onChange, inputProps, refApi, attributes, disabled
    } = mergedProps;

    const store = useState({ searchString: undefined } as State)
    const [ state, setState ] = store;
    const { searchString } = state;

    
    const inputStore = inputProps?.inputStore || useState(getDefaultInputStoreState())
    const { isFocused } = inputStore[0]

    const dropdownSearchRootProps: Props['attributes'] = {
        className,
        onBlur(e) {
            if (e.relatedTarget !== e.currentTarget) {
                if (state.searchString == '') onChange('', e)
                else state.searchString = undefined
            }
        }
    }
    refApi && applyRefApi(dropdownSearchRootProps, mergedProps)

    const inputInnerProps: InputProps = {
        inputStore, disabled,
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
    inputProps && Object.assign(inputInnerProps, inputProps)


    const isShowOptions = showAlways || (
        showOnFocus
            ?   isFocused
            :   (searchString ? searchString.length : 0) >= minInputLength
    )
    
    let options: JSX.Element | undefined;
    if (isShowOptions) {
        options = getSearchOptions(mergedProps, store)
        dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
    }
    disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)
    attributes && Object.assign(dropdownSearchRootProps, attributes)

    
    return (
        <div {...dropdownSearchRootProps}>
            <Input { ...inputInnerProps } />
            { options }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        options: componentID + '_options',
        option: componentID + '_option',
        _with_suggestions: componentID + '__with_suggestions',
        _disabled: componentID + '__disabled',
        _focused: componentID + '__focused'
    },

    minInputLength: 3
}
DropdownSearch.recursiveMergeProps = ['inputProps']
DropdownSearch.ID = componentID;


export { componentID }
export default DropdownSearch