import React, { useState, useRef, useEffect,
    ReactChild } from 'react'

import cx from 'core-utils/cx'

interface Props {
    theme?: UITheme,
    className?: string,
    searchPlaceholder?: string,
    minInputLength?: number,
    closeIcon?: ReactChild,
    searchIcon?: ReactChild,
    autofocus?: boolean,
    optionBuilder: (searchOption: any) => ReactChild,
    onSearch: (searchValue: string) => void,
    searchOptions: any[]
}

interface DefaultProps {
    theme: UITheme,
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

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)

const DropdownSearch = (props: Props) => {
    const clearInput = () => setState({ searchValue: '' })

    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;
    
    let mergedProps = Object.assign({}, defaults, props)
    let { className, searchPlaceholder, searchOptions, minInputLength, onSearch, closeIcon, searchIcon,
        optionBuilder, autofocus } = mergedProps;

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

    let wrapeprClassName = cx(theme.search_dropdown, {
        [theme.search_dropdown__with_suggestions]: showOptions,
        [theme.search_dropdown__filled_field]: searchLength
    })
    className && (wrapeprClassName += ` ${className}`)

    
    return (
        <div className={wrapeprClassName}>
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