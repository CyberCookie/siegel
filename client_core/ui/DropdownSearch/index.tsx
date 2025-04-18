//TODO?: add multi select
//TODO?: detect options position to handle options overflow

import React, { useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import getInputLabeled from '../_internals/label'
import handleKeyboardSelect, {
    Store as HandleKeyboardSelectStore
} from '../_internals/handle_keyboard_selection'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import getSearchOptionsElements from './helpers/get_search_options_elements'

import type { DivTagAttributes } from '../_internals/types'
import type { DefaultProps, Component, State, Option, Props, onSelectInner } from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-dropdown_search'

const getDefaultState: () => State = () => ({
    searchString: _undef,
    arrowSelectIndex: _undef
})

const DropdownSearch = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _with_suggestions: _undef,
            _disabled: _undef,
            _focused: _undef,
            _error: _undef,
            reset: _undef,
            input_wrapper: _undef,
            label_wrapper: _undef,
            label_text: _undef,
            options: _undef,
            option: _undef,
            option__selected: _undef,
            option__disabled: _undef
        },
        listDisabledOptions: true,
        minInputLength: 3
    },
    props => {

        const {
            onChange, onSearch, onBlur, onFocus, onKeyDown, onRootBlur,
            minInputLength, theme, className, showOnFocus, inputStore, selected, errorMsg,
            searchOptions, rootTagAttributes, disabled, store, label, resetIcon, children,
            inputTheme, resetIconKeepChildren, autofocus, placeholder, inputTagAttributes,
            mask, debounceMs, inputMemoDeps, inputRootTagAttributes, inputClassName, regexp
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

        function resetSelected(e: Parameters<onSelectInner>[1]) {
            setState( getDefaultState() )
            onChange(_undef, e)
        }


        const _inputStore = inputStore || useState( getDefaultInputStoreState() )
        const { isFocused } = _inputStore[0]

        const isShowOptions = isFocused
            && (showOnFocus || (searchString ? searchString.length : 0) >= minInputLength)

        let optionsElement: React.JSX.Element | undefined
        let selectedOption: Option | undefined
        let selectedOptionIndex: number | undefined
        if (isShowOptions) {
            ({
                selectedOption, optionsElement, selectedOptionIndex
            } = getSearchOptionsElements(props, state, onSelect))

        } else if (selected) {
            selectedOption = searchOptions.find(({ value }) => value == selected)
        }


        let dropdownSearchRootProps: DivTagAttributes = {
            onKeyDown,
            className: applyClassName(className, [
                [ theme._with_suggestions, optionsElement ],
                [ theme._focused, isFocused ],
                [ theme._error, isExists(errorMsg) ],
                [ theme._disabled, disabled ]
            ]),
            onBlur(e) {
                onRootBlur?.(e)

                if (!e.defaultPrevented && e.relatedTarget !== e.currentTarget) {
                    if (searchString == '') onChange(_undef, e)
                    else setState( getDefaultState() )
                }
            }
        }
        isFocused && (dropdownSearchRootProps.onKeyDown = e => {
            onKeyDown?.(e)

            e.defaultPrevented || handleKeyboardSelect(
                {
                    selectStore: innerStore as unknown as HandleKeyboardSelectStore,
                    keyCode: e.key,
                    options: searchOptions,
                    selectedOptionIndex
                },
                {
                    onDelete() { resetSelected(e) },
                    onEnter() { onSelect(searchOptions[arrowSelectIndex!], e) }
                }
            )
        })
        applyRefApi(dropdownSearchRootProps, props)
        dropdownSearchRootProps = resolveTagAttributes(dropdownSearchRootProps, rootTagAttributes)


        const inputInnerProps: InputProps = {
            children, disabled, mask, regexp, placeholder, errorMsg,
            debounceMs, autofocus, onBlur, onFocus,
            theme: inputTheme,
            inputAttributes: inputTagAttributes,
            rootTagAttributes: inputRootTagAttributes,
            memoDeps: inputMemoDeps,
            store: _inputStore,
            className: styles.input,
            onChange(value, e) {
                onSearch?.(value, e)
                if (!e.defaultPrevented) {
                    state.searchString = value
                    setState({ ...state })
                }
            },
            value: isExists(searchString)
                ?   searchString
                :   selectedOption
                    ?   selectedOption.inputValue
                    :   ''
        }
        inputClassName && (inputInnerProps.className += ` ${inputClassName}`)

        if (resetIcon && selected) {
            const resetIconElem = (
                <div className={ theme.reset } children={ resetIcon }
                    onMouseDown={ resetSelected } />
            )

            inputInnerProps.children = resetIconKeepChildren
                ?   <>
                        { resetIconElem }
                        { children }
                    </>
                :   resetIconElem
        }

        const inputElement = <Input { ...inputInnerProps } />


        return (
            <div { ...dropdownSearchRootProps }>
                { label
                    ?   getInputLabeled(
                            <div className={ theme.input_wrapper }>
                                { inputElement }
                                { optionsElement }
                            </div>,
                            { className: theme.label_wrapper },
                            { className: theme.label_text, children: label }
                        )
                    :   <>
                            { inputElement }
                            { optionsElement }
                        </>
                }
            </div>
        )
    }
)


export default DropdownSearch
export { componentID, getDefaultState }
export type { Component, Props }