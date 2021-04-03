//TODO: apply arrow controls when focused

import React, { useState } from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import addChildren from '../../children'
import isE from '../../../utils/is_exists'
import Input, { getDefaultInputStoreState } from '../Input'
import type { _DropdownSearch, MergedProps, Store, State, Props } from './types'
import type { Props as InputProps } from '../Input/types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

const innerInputRootClassName = styles[componentID + '_inner_input']

function getSearchOptions({ showAll, onChange, searchOptions, theme, selected }: MergedProps, store: Store) {
    const [{ searchString }, setState ] = store;
    const searchLower = searchString && searchString.toLowerCase()

    const options: JSX.Element[] = []
    let selectedOption;
    searchOptions.forEach(option => {
        const { title, inputValue, value, className, payload } = option;
        
        const isSelected = value == selected;
        isSelected && (selectedOption = option)

        const canPush = showAll || (!searchLower || inputValue.toLowerCase().includes(searchLower))
        if (canPush) {
            let optionClassMame = theme.option;
            className && (optionClassMame += ` ${className}`)

            options.push(
                <div key={value} className={optionClassMame} children={title || inputValue}
                    onMouseDown={e => {
                        if (!isSelected) {
                            setState({ searchString: undefined })
                            onChange(value, e, payload)
                        }
                    }} />
            )
        }
    })


    return {
        selectedOption,
        optionsElement: <div children={options} className={theme.options} />
    }
}


const DropdownSearch: _DropdownSearch = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, minInputLength, onSearch, className, showOnFocus, onChange, inputProps, refApi,
        selected, searchOptions, attributes, disabled
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
                if (searchString == '') onChange('', e)
                else state.searchString = undefined
            }
        }
    }
    refApi && applyRefApi(dropdownSearchRootProps, mergedProps)

    
    const isShowOptions = showOnFocus
        ?   isFocused
        :   (searchString ? searchString.length : 0) >= minInputLength;
    
    let options: JSX.Element | undefined;
    let optionSelected: Props['searchOptions'][number] | undefined;
    if (isShowOptions) {
        const { selectedOption, optionsElement } = getSearchOptions(mergedProps, store)
        options = optionsElement;
        optionSelected = selectedOption;
        
        dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
    } else  if (selected) {
        optionSelected = searchOptions.find(({ value }) => value == selected)
    }
    

    const inputInnerProps: InputProps = {
        inputStore, disabled,
        attributes: {
            tabIndex: 0
        },
        className: innerInputRootClassName,
        onChange(value, e) {
            state.searchString = value;
            setState({ ...state })

            onSearch && onSearch(value, e)
        },
        value: isE(searchString)
            ?   searchString
            :   optionSelected
                ?   optionSelected.inputValue
                :   ''
    }
    inputProps && Object.assign(inputInnerProps, inputProps)


    disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)
    attributes && Object.assign(dropdownSearchRootProps, attributes)

    
    return (
        <div { ...dropdownSearchRootProps }>
            <Input { ...inputInnerProps } />
            { options }
            
            { addChildren(dropdownSearchRootProps, theme) }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        children: componentID + '_children',
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