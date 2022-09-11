import React, { useState } from 'react'

import isExists from '../../../common/is/exists'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import handleKeyboardSelect, {
    Store as HandleKeyboardSelectStore
} from '../_internals/handle_keyboard_selection'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import getSearchOptionsElements from './helpers/get_search_options_elements'

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
            option__selected: '',
            option__disabled: ''
        },
        listDisabledOptions: true,
        minInputLength: 3
    },
    props => {

        const {
            theme, minInputLength, onSearch, className, showOnFocus, onChange, refApi, inputStore,
            selected, searchOptions, rootTagAttributes, disabled, store, label, resetIcon, children,
            inputTheme, inputChildren, autofocus, placeholder, inputTagAttributes, errorMsg, regexp,
            mask, debounceMs, onBlur, onFocus, inputMemoDeps
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
                    else setState( getDefaultState() )
                }
            }
        }


        const isShowOptions = isFocused
            && (showOnFocus || (searchString ? searchString.length : 0) >= minInputLength)

        let optionsElement: JSX.Element | undefined
        let selectedOption: Option | undefined
        let selectedOptionIndex: number | undefined
        if (isShowOptions) {
            ({
                selectedOption, optionsElement, selectedOptionIndex
            } = getSearchOptionsElements(props, state, onSelect))

            if (optionsElement) {
                dropdownSearchRootProps.className += ` ${theme._with_suggestions}`
            }

        } else if (selected) {
            selectedOption = searchOptions.find(({ value }) => value == selected)
        }

        if (isFocused) {
            dropdownSearchRootProps.className += ` ${theme._focused}`
            dropdownSearchRootProps.onKeyDown = e => {
                handleKeyboardSelect(
                    {
                        selectStore: innerStore as unknown as HandleKeyboardSelectStore,
                        keyCode: e.nativeEvent.key,
                        options: searchOptions,
                        selectedOptionIndex
                    },
                    {
                        onDelete() { resetSelected(e) },
                        onEnter() { onSelect(searchOptions[arrowSelectIndex!], e) }
                    }
                )
            }
        }

        errorMsg && (dropdownSearchRootProps.className += ` ${theme._error}`)
        disabled && (dropdownSearchRootProps.className += ` ${theme._disabled}`)

        refApi && applyRefApi(dropdownSearchRootProps, props)
        rootTagAttributes && (dropdownSearchRootProps = mergeTagAttributes(dropdownSearchRootProps, rootTagAttributes))


        const inputInnerProps: InputProps = {
            disabled, label, mask, regexp, placeholder, errorMsg,
            debounceMs, autofocus, onBlur, onFocus,
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