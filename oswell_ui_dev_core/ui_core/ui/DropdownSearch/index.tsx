import React, { useState, useRef, useEffect } from 'react'

import { setDefaultProps, extractProps, PropsComponentThemed } from '../ui_utils'
import cx from '../../utils/cx'

type Props = {
    searchPlaceholder?: string,
    minInputLength?: number,
    closeIcon?: React.ReactChild,
    searchIcon?: React.ReactChild,
    autofocus?: boolean,
    optionBuilder: (searchOption: any) => React.ReactChild,
    onSearch: (searchValue: string) => void,
    searchOptions: any[]
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<PropsComponentThemed['theme']>,
    minInputLength: number
}


const componentID = '-ui-search-dropdown'

const defaults: DefaultProps = {
    theme: {
        search_dropdown: componentID,
        search_dropdown__with_suggestions: `${componentID}__with_suggestions`,
        search_dropdown__filled_field: `${componentID}__filled_field`,
        search_field: `${componentID}_search_field`,
        options: `${componentID}_options`
    },

    minInputLength: 3
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

const DropdownSearch = (props: Props) => {
    let mergedProps = extractProps(defaults, props)
    let { className = '', theme, searchPlaceholder, searchOptions, minInputLength, onSearch,
        closeIcon, searchIcon, optionBuilder, autofocus } = mergedProps;

    let [ state, setState ] = useState({
        searchValue: ''
    })
    
    let inputProps: React.HTMLProps<HTMLInputElement> = {
        className: theme.search_field,
        placeholder: searchPlaceholder,
        value: state.searchValue,
        onChange(e: React.ChangeEvent<HTMLInputElement>) {
            let searchValue = e.target.value;
            setState({ searchValue })
            
            searchValue.length >= minInputLength && onSearch(searchValue)
        }
    }
    
    if (autofocus) {
        inputProps.ref = useRef<HTMLInputElement>(null)
        
        useEffect(() => {
            (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()    
        }, [])
    }
    
    let searchLength = state.searchValue.length;
    let showOptions = searchOptions.length && searchLength >= minInputLength;
    
    className += cx(` ${theme.search_dropdown}`, {
        [theme.search_dropdown__with_suggestions]: showOptions,
        [theme.search_dropdown__filled_field]: searchLength
    })
        
    const clearInput = () => setState({ searchValue: '' })
    

    return (
        <div className={className}>
            <input {...inputProps} />
            
            { !!showOptions && (
                <div children={searchOptions.map(optionBuilder)}
                    className={theme.options} />
            )}

            { searchLength
                ?   closeIcon && (<div children={closeIcon} onMouseDown={clearInput} />)
                :   searchIcon
            }
        </div>
    )
}


export { setDefaults }
export default DropdownSearch