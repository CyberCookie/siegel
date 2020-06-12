//TODO: option builder default?
import React, { useState, useRef, useEffect } from 'react'

import { extractProps } from '../../ui_utils'
import { _DropdownSearch } from './types'


const componentID = '-ui-dropdown_search'

const DropdownSearch: _DropdownSearch = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props)
        :   (props as _DropdownSearch['defaults'] & typeof props)

    const { theme, placeholder, searchOptions, minInputLength, onChange, disabled, value, label,
        closeIcon, searchIcon, optionBuilder, autofocus, payload, attributes, inputAttributes } = mergedProps;

    const [ state, setState ] = useState({
        isFocused: false,
        isTouched: false
    })
    const { isFocused, isTouched } = state;
    
    const searchLength = value.length;
    const showOptions = searchOptions.length && searchLength >= minInputLength;
    

    let className = mergedProps.className;
    showOptions && (className += ` ${theme.search_dropdown__with_suggestions}`)
    searchLength && (className += ` ${theme.search_dropdown__filled_field}`)

    const dropdownSearchRootProps = { className }
    attributes && (Object.assign(dropdownSearchRootProps, attributes))

    const inputProps: React.HTMLProps<HTMLInputElement> = {
        placeholder, value,
        className: theme.search_field,
    }
    
    if (disabled) {
        dropdownSearchRootProps.className += ` ${theme._disabled}`
        inputProps.disabled = true
    } else {
        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const searchValue = e.target.value;
            searchValue.length >= minInputLength && onChange(searchValue, e, payload)
        }

        inputProps.onFocus = () => {
            if (!isFocused) {
                state.isFocused = state.isTouched = true;
                setState({ ...state })
            }
        }

        inputProps.onBlur = () => {
            if (isFocused) {
                state.isTouched = false;
                setState({ ...state })
            }
        }
    }   


    if (autofocus) {
        inputProps.ref = useRef<HTMLInputElement>(null)
        
        useEffect(() => {
            (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()    
        }, [])
    }
    inputAttributes && (Object.assign(inputProps, inputAttributes))
    

    let inputElement = <input {...inputProps} />
    if (label) {
        inputElement = (
            <label className={theme.label}>
                <div className={theme.label_text} children={label} />

                { inputElement }
            </label>
        )
    }

    return (
        <div {...dropdownSearchRootProps}>
            { inputElement }
            
            { !!showOptions && 
                <div children={searchOptions.map(optionBuilder)} className={theme.options} />
            }

            { searchLength
                ?   closeIcon && <div children={closeIcon}
                        onMouseDown={(e: React.MouseEvent) => { onChange('', e, payload) }} />
                :   searchIcon
            }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: componentID,
        search_dropdown__with_suggestions: componentID + '__with_suggestions',
        search_dropdown__filled_field: componentID + '__filled_field',
        search_field: componentID + '_search_field',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        options: componentID + '_options',
        _disabled: componentID + '_disabled'
    },

    minInputLength: 3
}
DropdownSearch.ID = componentID;


export { componentID }
export default DropdownSearch