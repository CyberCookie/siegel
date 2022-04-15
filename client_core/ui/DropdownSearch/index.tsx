import React, { useState } from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import isExists from '../../utils/is/exists'
import * as keyCodes from '../_internals/key_codes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import { getSearchOptionsElements } from './helpers'
import type {
    Component, MergedProps, State, Option, Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

const getDefaultState: () => State = () => ({
    searchString: undefined,
    arrowSelectIndex: undefined
})

const DropdownSearch: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(DropdownSearch.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, minInputLength, onSearch, className, showOnFocus, onChange, refApi, inputStore,
        selected, searchOptions, rootTagAttributes, disabled, store, label, resetIcon, children,
        inputTheme, inputChildren, autofocus, placeholder, inputTagAttributes, errorMsg, regexp, mask,
        onBlur, onFocus
    } = mergedProps

    const innerStore = store || useState( getDefaultState() )
    const [ state, setState ] = innerStore
    const { searchString, arrowSelectIndex } = state


    function onSelect(option: Option, e: React.KeyboardEvent) {
        const { value } = option
        if (value != selected) {
            setState( getDefaultState() )
            onChange(value, e)
        }
    }

    function resetSelected(e: React.KeyboardEvent | React.MouseEvent) {
        setState( getDefaultState() )
        onChange(undefined, e)
    }


    const _inputStore = inputStore || useState( getDefaultInputStoreState() )
    const { isFocused } = _inputStore[0]

    let dropdownSearchRootProps: Props['rootTagAttributes'] = {
        className,
        onBlur(e) {
            if (e.relatedTarget !== e.currentTarget) {
                if (searchString == '') onChange(undefined, e)
                else innerStore[0] = getDefaultState()
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

            } else if (keyCode == keyCodes.DELETE) {
                resetSelected(e)

            } else if (isArrowIndexExists && keyCode == keyCodes.ENTER) {
                onSelect(searchOptions[arrowSelectIndex], e)
            }
        }
    }

    refApi && applyRefApi(dropdownSearchRootProps, mergedProps)


    const isShowOptions = showOnFocus
        ?   isFocused
        :   (searchString ? searchString.length : 0) >= minInputLength

    let optionsElement: JSX.Element | undefined
    let selectedOption: Option | undefined
    if (isShowOptions) {
        ({ selectedOption, optionsElement } = getSearchOptionsElements(mergedProps, state, onSelect))

        dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
    } else  if (selected) {
        selectedOption = searchOptions.find(({ value }) => value == selected)
    }

    disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)
    rootTagAttributes && (dropdownSearchRootProps = mergeTagAttributes(dropdownSearchRootProps, rootTagAttributes))



    const inputInnerProps: InputProps = {
        disabled, label, mask, regexp, placeholder, errorMsg,
        autofocus, onBlur, onFocus,
        theme: inputTheme,
        inputAttributes: inputTagAttributes,
        children: inputChildren,
        store: _inputStore,
        className: styles.input,
        onChange(value, e) {
            state.searchString = value
            setState({ ...state })

            onSearch?.(value, e)
        },
        value: isExists(searchString)
            ?   searchString
            :   selectedOption
                ?   selectedOption.inputValue
                :   ''
    }
    resetIcon && selected && (inputInnerProps.rootTagAttributes = {
        children: (
            <div className={ theme.reset } children={ resetIcon }
                onMouseDown={ resetSelected } />
        )
    })


    return (
        <div { ...dropdownSearchRootProps }>
            <Input { ...inputInnerProps } />

            { optionsElement }

            { children && addChildren(children, theme) }
        </div>
    )
}
DropdownSearch.defaults = {
    theme: {
        root: '',
        reset: '',
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
DropdownSearch.ID = componentID


export { componentID, getDefaultState }
export default DropdownSearch
export * from './types'