//TODO: add reset selection

import React, { useState } from 'react'

import isExists from '../../utils/is/exists'
import * as keyCodes from '../_internals/key_codes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import Input, { getDefaultInputStoreState, Props as InputProps } from '../Input/index'
import type { ComponentAttributes } from '../_internals/types'
import type {
    Component, MergedProps, State, Option,
    Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

const innerInputRootClassName = styles[`${componentID}_inner_input`]

function getSearchOptions(params: MergedProps, state: State, onSelect: any) {
    const { showAll, searchOptions, theme, selected } = params
    const { searchString, arrowSelectIndex } = state
    const searchLower = searchString?.toLowerCase()

    const options: JSX.Element[] = []
    let selectedOption
    searchOptions.forEach((option, i) => {
        const { title, inputValue, value, className, disabled, alwaysVisible } = option

        const isSelected = value == selected
        isSelected && (selectedOption = option)

        const canPush = alwaysVisible || showAll || (!searchLower || inputValue.toLowerCase().includes(searchLower))
        if (canPush) {
            const optionProps: ComponentAttributes<HTMLDivElement> = {
                className: theme.option,
                children: title || inputValue
            }
            className && (optionProps.className += ` ${className}`)
            if (isSelected || arrowSelectIndex == i) {
                optionProps.className += ` ${theme.option__selected}`
            }
            disabled || (optionProps.onMouseDown = e => {
                onSelect(option, e)
            })


            options.push( <div { ...optionProps } key={ value as string } /> )
        }
    })


    return {
        selectedOption,
        optionsElement: <div children={ options } className={ theme.options } />
    }
}

const getDefaultState = () => ({
    searchString: undefined,
    arrowSelectIndex: undefined
} as State)

const DropdownSearch: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, minInputLength, onSearch, className, showOnFocus, onChange, inputProps, refApi,
        selected, searchOptions, attributes, disabled, innerStore, label
    } = mergedProps

    const store = innerStore || useState(getDefaultState())
    const [ state, setState ] = store
    const { searchString, arrowSelectIndex } = state


    function onSelect(option: Option, e: React.KeyboardEvent) {
        const { value, payload } = option
        if (value != selected) {
            setState( getDefaultState() )
            onChange(value, e, payload)
        }
    }


    const inputStore = inputProps?.innerStore || useState(getDefaultInputStoreState())
    const { isFocused } = inputStore[0]

    const dropdownSearchRootProps: Props['attributes'] = {
        className,
        onBlur(e) {
            if (e.relatedTarget !== e.currentTarget) {
                if (searchString == '') onChange(undefined, e)
                else store[0] = getDefaultState()
            }
        }
    }
    if (isFocused) {
        dropdownSearchRootProps.className += ` ${theme._focused}`
        dropdownSearchRootProps.onKeyDown = e => {
            const keyCode = e.nativeEvent.key
            const isUp = keyCode == keyCodes.UP

            const isArrowIndexExists = isExists(arrowSelectIndex)

            if (isUp || keyCode == keyCodes.DOWN) {
                state.arrowSelectIndex = isArrowIndexExists
                    ?   isUp
                        ?   arrowSelectIndex <= 0
                                ?   searchOptions.length - 1
                                :   arrowSelectIndex - 1
                        :   arrowSelectIndex >= searchOptions.length - 1
                            ?   0
                            :   arrowSelectIndex + 1
                    :   0

                setState({ ...state })
            } else if (isArrowIndexExists && keyCode == keyCodes.ENTER) {
                onSelect(searchOptions[arrowSelectIndex], e)
            }
        }
    }

    refApi && applyRefApi(dropdownSearchRootProps, mergedProps)


    const isShowOptions = showOnFocus
        ?   isFocused
        :   (searchString ? searchString.length : 0) >= minInputLength

    let options: JSX.Element | undefined
    let optionSelected: Option | undefined
    if (isShowOptions) {
        const { selectedOption, optionsElement } = getSearchOptions(mergedProps, state, onSelect)
        options = optionsElement
        optionSelected = selectedOption

        dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
    } else  if (selected) {
        optionSelected = searchOptions.find(({ value }) => value == selected)
    }


    disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)
    attributes && Object.assign(dropdownSearchRootProps, attributes)



    const inputInnerProps: InputProps = {
        disabled, label,
        innerStore: inputStore,
        className: innerInputRootClassName,
        onChange(value, e) {
            state.searchString = value
            setState({ ...state })

            onSearch?.(value, e)
        },
        value: isExists(searchString)
            ?   searchString
            :   optionSelected
                ?   optionSelected.inputValue
                :   ''
    }
    inputProps && Object.assign(inputInnerProps, inputProps)



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
        root: '',
        children: '',
        options: '',
        option: '',
        option__selected: '',
        _with_suggestions: '',
        _disabled: '',
        _focused: ''
    },

    minInputLength: 3
}
DropdownSearch.recursiveMergeProps = ['inputProps']
DropdownSearch.ID = componentID


export { componentID, getDefaultState }
export default DropdownSearch
export type { Props }