import React, { useState, useRef, useEffect } from 'react'

import { extractProps } from '../../ui_utils'
import { _DropdownSearch } from './types'


const componentID = '-ui-search-dropdown'

const DropdownSearch: _DropdownSearch = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props)
        :   (props as _DropdownSearch['defaults'] & typeof props)

    const { theme, searchPlaceholder, searchOptions, minInputLength, onChange,
        closeIcon, searchIcon, optionBuilder, autofocus, payload, attributes, inputAttributes } = mergedProps;

    const [ state, setState ] = useState({
        searchValue: ''
    })
    
    const searchLength = state.searchValue.length;
    const showOptions = searchOptions.length && searchLength >= minInputLength;
    
    let className = mergedProps.className;
    showOptions && (className += ` ${theme.search_dropdown__with_suggestions}`)
    searchLength && (className += ` ${theme.search_dropdown__filled_field}`)

    const dropdownSearchRootProps = { className }
    attributes && (Object.assign(dropdownSearchRootProps, attributes))

    const inputProps: React.HTMLProps<HTMLInputElement> = {
        className: theme.search_field,
        placeholder: searchPlaceholder,
        value: state.searchValue,
        onChange(e: React.ChangeEvent<HTMLInputElement>) {
            const searchValue = e.target.value;
            setState({ searchValue })
            
            searchValue.length >= minInputLength && onChange(searchValue, e, payload)
        }
    }
    
    if (autofocus) {
        inputProps.ref = useRef<HTMLInputElement>(null)
        
        useEffect(() => {
            (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()    
        }, [])
    }
    
    inputAttributes && (Object.assign(inputProps, inputAttributes))
    

    return (
        <div {...dropdownSearchRootProps}>
            <input {...inputProps} />
            
            { !!showOptions && 
                <div children={searchOptions.map(optionBuilder)}
                    className={theme.options} />
            }

            { searchLength
                ?   closeIcon && <div children={closeIcon} onMouseDown={() => setState({ searchValue: '' })} />
                :   searchIcon
            }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        search_dropdown__with_suggestions: `${componentID}__with_suggestions`,
        search_dropdown__filled_field: `${componentID}__filled_field`,
        search_field: `${componentID}_search_field`,
        options: `${componentID}_options`
    },

    minInputLength: 3
}
DropdownSearch.ID = componentID;


export { componentID }
export default DropdownSearch