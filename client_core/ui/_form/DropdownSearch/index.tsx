//TODO: apply arrow controls when focused
//TODO: add reset selection

import React, { useState } from 'react'

import isE from '../../../utils/is_exists'
import { extractProps, applyRefApi, ComponentAttributes } from '../../ui_utils'
import addChildren from '../../children'
import Input, { getDefaultInputStoreState, Props as InputProps } from '../Input'
import type {
    Component, MergedProps, Store,
    Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

const innerInputRootClassName = styles[componentID + '_inner_input']

function getSearchOptions({ showAll, onChange, searchOptions, theme, selected }: MergedProps, store: Store) {
    const [{ searchString }, setState ] = store
    const searchLower = searchString && searchString.toLowerCase()

    const options: JSX.Element[] = []
    let selectedOption
    searchOptions.forEach(option => {
        const { title, inputValue, value, className, payload, disabled, alwaysVisible } = option

        const isSelected = value == selected
        isSelected && (selectedOption = option)

        const canPush = alwaysVisible || showAll || (!searchLower || inputValue.toLowerCase().includes(searchLower))
        if (canPush) {
            const optionProps: ComponentAttributes<HTMLDivElement> = {
                className: theme.option,
                children: title || inputValue
            }
            className && (optionProps.className += ` ${className}`)
            disabled || (optionProps.onMouseDown = e => {
                if (!isSelected) {
                    setState({ searchString: undefined })
                    onChange(value, e, payload)
                }
            })


            options.push( <div { ...optionProps } key={value} /> )
        }
    })


    return {
        selectedOption,
        optionsElement: <div children={options} className={theme.options} />
    }
}


const DropdownSearch: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, minInputLength, onSearch, className, showOnFocus, onChange, inputProps, refApi,
        selected, searchOptions, attributes, disabled, innerStore
    } = mergedProps

    const store = ((innerStore || useState({ searchString: undefined })) as Store)
    const [ state, setState ] = store
    const { searchString } = state


    const inputStore = inputProps?.innerStore || useState(getDefaultInputStoreState())
    const { isFocused } = inputStore[0]

    const dropdownSearchRootProps: Props['attributes'] = {
        className,
        onBlur(e) {
            if (e.relatedTarget !== e.currentTarget) {
                if (searchString == '') onChange(undefined, e)
                else state.searchString = undefined
            }
        }
    }
    refApi && applyRefApi(dropdownSearchRootProps, mergedProps)


    const isShowOptions = showOnFocus
        ?   isFocused
        :   (searchString ? searchString.length : 0) >= minInputLength

    let options: JSX.Element | undefined
    let optionSelected: Props['searchOptions'][number] | undefined
    if (isShowOptions) {
        const { selectedOption, optionsElement } = getSearchOptions(mergedProps, store)
        options = optionsElement
        optionSelected = selectedOption

        dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
    } else  if (selected) {
        optionSelected = searchOptions.find(({ value }) => value == selected)
    }


    const inputInnerProps: InputProps = {
        disabled,
        innerStore: inputStore,
        attributes: {
            tabIndex: 0
        },
        className: innerInputRootClassName,
        onChange(value, e) {
            state.searchString = value
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
DropdownSearch.ID = componentID


export { componentID }
export default DropdownSearch
export type { Props }