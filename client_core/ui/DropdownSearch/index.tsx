import React, { useState } from 'react'

import isExists from 'siegel-utils/is/exists'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import * as keyCodes from '../_internals/key_codes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import { getSearchOptionsElements } from './helpers'
import type { Component, State, Option, Props, onSelectInner } from './types'

import styles from './styles.sass'


const componentID = '-ui-dropdown_search'

const getDefaultState: () => State = () => ({
    searchString: undefined,
    arrowSelectIndex: undefined
})

const DropdownSearch: Component = component(
    componentID,
    {
        theme: {
            root: '',
            _with_suggestions: '',
            _disabled: '',
            _focused: '',
            _error: '',
            reset: '',
            children: '',
            options: '',
            option: '',
            option__selected: ''
        },
        minInputLength: 3
    },
    props => {

        const {
            theme, minInputLength, onSearch, className, showOnFocus, onChange, refApi, inputStore,
            selected, searchOptions, rootTagAttributes, disabled, store, label, resetIcon, children,
            inputTheme, inputChildren, autofocus, placeholder, inputTagAttributes, errorMsg, regexp, mask,
            onBlur, onFocus, inputMemoDeps
        } = props

        const innerStore = store || useState( getDefaultState() )
        const [ state, setState ] = innerStore
        const { searchString, arrowSelectIndex } = state


        const onSelect: onSelectInner = (option, e) => {
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

        refApi && applyRefApi(dropdownSearchRootProps, props)


        const isShowOptions = isFocused
            && (showOnFocus || (searchString ? searchString.length : 0) >= minInputLength)


        let optionsElement: JSX.Element | undefined
        let selectedOption: Option | undefined
        if (isShowOptions) {
            ({ selectedOption, optionsElement } = getSearchOptionsElements(props, state, onSelect))

            dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
        } else  if (selected) {
            selectedOption = searchOptions.find(({ value }) => value == selected)
        }

        errorMsg && (dropdownSearchRootProps.className += ` ${theme._error}`)
        disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)
        rootTagAttributes && (dropdownSearchRootProps = mergeTagAttributes(dropdownSearchRootProps, rootTagAttributes))


        const inputInnerProps: InputProps = {
            disabled, label, mask, regexp, placeholder, errorMsg,
            autofocus, onBlur, onFocus,
            theme: inputTheme,
            inputAttributes: inputTagAttributes,
            memoDeps: inputMemoDeps,
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
)


export default DropdownSearch
export { componentID, getDefaultState }
export type { Component, Props }