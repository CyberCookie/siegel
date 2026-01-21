//TODO: add grouping
//TODO: options attributes
//TODO?: detect options position to handle options overflow

import React, { useState, useRef } from 'react'

import isExists from '../../../common/is/exists'
import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import handleKeyboardSelect, {
    Store as HandleKeyboardSelectStore,
    SelectedOptionIndex
} from '../_internals/handle_keyboard_selection'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getOptions from './helpers/get_options'

import type { DivTagAttributes } from '../_internals/types'
import type {
    Component, Props, DefaultProps,  Store,
    OnSelect, RootRef, SelectedOption, Option
} from './types'


const _undef = undefined
const componentID = '-ui-select'

const getDefaultState = () => ({
    isActive: false,
    arrowSelectIndex: _undef
} as Store[0])

const Select = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _filled: _undef,
            _active: _undef,
            _disabled: _undef,
            _error: _undef,
            _multiselect: _undef,
            children: _undef,
            label: _undef,
            reset: _undef,
            title_wrapper: _undef,
            title_text: _undef,
            title_text__placeholder: _undef,
            multiselect_title_option: _undef,
            error_text: _undef,
            input_wrapper: _undef,
            options: _undef,
            option: _undef,
            option__active: _undef,
            option__disabled: _undef
        },
        closeOnSelect: true,
        listDisabledOptions: true
    },
    props => {

        const {
            theme, rootTagAttributes, options, getDisplayValue, selected, dropdownIcon,
            disabled, placeholder, store, resetIcon, closeOnSelect, children, label,
            errorMsg, className, multiselect,
            onChange, onFocus, onBlur, onKeyDown
        } = props

        const selectStore = store || useState(getDefaultState())
        const [ state, setState ] = selectStore
        const { isActive, arrowSelectIndex } = state


        const onSelect: OnSelect = (value, e, payload) => {
            e.stopPropagation()
            e.preventDefault()

            let newVaue
            if (multiselect) {
                selected.has(value)
                    ?   selected.delete(value)
                    :   selected.add(value)

                newVaue = selected

            } else newVaue = value

            onChange(newVaue, e, payload)

            closeOnSelect && (selectRootProps.ref as RootRef).current!.blur()
        }


        const isSelectionExists = isExists(selected)
        const isError = isExists(errorMsg)

        let selectRootProps: DivTagAttributes = {
            className: applyClassName(className, [
                [ theme._active, isActive ],
                [ theme._filled, isSelectionExists ],
                [ theme._error, isError ],
                [ theme._disabled, disabled ],
                [ theme._multiselect, multiselect ]
            ]),
            ref: useRef(null)
        }


        let optionsElement: React.JSX.Element
        let selectedOption: SelectedOption
        let selectedOptionIndex: SelectedOptionIndex

        if (disabled) {
            isSelectionExists && (selectedOption = options.find(option => option.value == selected))

        } else {
            ({
                optionsElement, selectedOption, selectedOptionIndex
            } = getOptions(props, onSelect, arrowSelectIndex))

            selectRootProps.tabIndex = 0

            selectRootProps.onFocus = e => {
                onFocus?.(e)
                if (!e.defaultPrevented) {
                    state.isActive = true
                    setState({ ...state })
                }
            }

            if (isActive) {
                selectRootProps.onBlur = e => {
                    onBlur?.(e)
                    e.defaultPrevented || setState( getDefaultState() )
                }

                selectRootProps.onKeyDown = e => {
                    onKeyDown?.(e)

                    if (!e.defaultPrevented) {
                        const keyCode = e.key
                        if (keyCode != keyCodes.TAB) {
                            e.preventDefault()

                            handleKeyboardSelect(
                                {
                                    selectStore: selectStore as unknown as HandleKeyboardSelectStore,
                                    keyCode, options, selectedOptionIndex
                                },
                                {
                                    onDelete() { onSelect(_undef, e) },
                                    onEnter() {
                                        const { value, payload } = options[arrowSelectIndex!]
                                        onSelect(value, e, payload)
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }

        applyRefApi(selectRootProps, props)
        selectRootProps = resolveTagAttributes(selectRootProps, rootTagAttributes)


        let displayValue: React.ReactNode
        let isPlaceholder = false
        if (selectedOption) {
            if (getDisplayValue) {
                displayValue = multiselect
                    ?   getDisplayValue(selectedOption as Option[])
                    :   getDisplayValue(selectedOption as Option)

            } else {
                if (multiselect) {
                    if ((selectedOption as Option[]).length) {
                        displayValue = (selectedOption as Option[]).map(({ title, value }) => (
                            <div key={ value } className={ theme.multiselect_title_option }
                                children={ title } />
                        ))

                    } else {
                        displayValue = placeholder
                        isPlaceholder = true
                    }

                } else displayValue = (selectedOption as Option).title
            }

        } else {
            displayValue = placeholder
            isPlaceholder = true
        }

        const selectInput = <>
            <div className={ theme.title_wrapper }
                onMouseDown={ e => {
                    if (isActive) {
                        e.preventDefault()
                        ;(selectRootProps.ref as RootRef).current!.blur()
                    }
                } }>

                <div className={ applyClassName(theme.title_text, [[ theme.title_text__placeholder!, isPlaceholder ]]) }
                    children={ displayValue } />

                { !disabled && resetIcon && (
                    <div children={ resetIcon } className={ theme.reset }
                        onMouseDown={ e => {
                            onSelect(multiselect ? new Set() : _undef, e)
                        } } />
                )}

                { dropdownIcon }
            </div>

            { isError && <div className={ theme.error_text } children={ errorMsg } /> }

            { optionsElement! }
        </>


        return (
            <div { ...selectRootProps }>
                { label
                    ?   <>
                            <div className={ theme.label } children={ label } />
                            <div className={ theme.input_wrapper } children={ selectInput } />
                        </>

                    :   selectInput
                }

                { addChildren(children, theme) }
            </div>
        )
    }
)


export default Select
export { componentID, getDefaultState }
export type { Props, Component }