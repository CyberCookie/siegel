//TODO: option builder default?
import React from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import addInputFieldAttributes from '../input_field_attributes'
import getLabel from '../label'
import type { _DropdownSearch, MergedProps } from './types'


const componentID = '-ui-dropdown_search'

function getSearchOptions({ onSelect, searchOptions, theme, value }: MergedProps) {
    const options: JSX.Element[] = []
    for (let i = 0, l = searchOptions.length; i < l; i++) {
        const { id, title, className, filter } = searchOptions[i]
        
        const canPush = filter
            ?   typeof filter == 'string'
                ?   filter.toLocaleLowerCase().includes(value!)
                :   filter(value, id, i)
            :   true;
        

        if (canPush) {
            let optionClassMame = theme.option;
            className && (optionClassMame += ` ${className}`)

            options.push(
                <div key={id} className={optionClassMame} children={title}
                    onMouseDown={e => { onSelect(id, e) }} />
            )
        }
    }


    return <div children={options} className={theme.options} />
}

const DropdownSearch: _DropdownSearch = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props)
        :   (props as _DropdownSearch['defaults'] & typeof props)

    const { theme, searchOptions, minInputLength, onChange, disabled, value, label, payload, className } = mergedProps;

    
    const searchLength = value ? value.length : 0;

    const dropdownSearchRootProps: ComponentAttributes = { className }
    const inputProps: NonNullable<typeof props.inputAttributes> = {
        disabled,
        className: theme.field,
    }

    let options: JSX.Element | undefined

    if (!disabled) {
        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const searchValue = e.target.value;
            onChange(searchValue, e, payload)
        }

        if  (!!searchOptions.length && searchLength >= minInputLength) {
            options = getSearchOptions(mergedProps)
            dropdownSearchRootProps.className +=  ` ${theme._with_suggestions}`
        }
    }
    addInputFieldAttributes(inputProps, dropdownSearchRootProps, mergedProps)


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