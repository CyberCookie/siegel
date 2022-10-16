import React, { useState, useRef } from 'react'

import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import handleKeyboardSelect, {
    Store as HandleKeyboardSelectStore
} from '../_internals/handle_keyboard_selection'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getOptions from './helpers/get_options'

import type { ReactTagAttributes } from '../_internals/types'
import type { Component, Props, DefaultProps,  Store, OnSelect, RootRef } from './types'


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
            children: _undef,
            label: _undef,
            reset: _undef,
            title_wrapper: _undef,
            title_text: _undef,
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
            theme, rootTagAttributes, options, getDisplayValue, selected, dropdownIcon, label,
            disabled, placeholder, refApi, store, resetIcon, onChange, closeOnSelect, children,
            errorMsg, className
        } = props

        const selectStore = store || useState(getDefaultState())
        const [ state, setState ] = selectStore
        const { isActive, arrowSelectIndex } = state


        const onSelect: OnSelect = (value, e, payload) => {
            e.stopPropagation()
            e.preventDefault()

            onChange(value, e, payload)

            closeOnSelect && (selectRootProps.ref as RootRef).current.blur()
        }


        const isSelected = isExists(selected)

        let selectRootProps: ReactTagAttributes<HTMLDivElement> = {
            className: applyClassName(className, [
                [ theme._active, isActive ],
                [ theme._filled, isSelected ],
                [ theme._error, isExists(errorMsg) ],
                [ theme._disabled, disabled ]
            ]),
            ref: useRef() as RootRef
        }


        let optionsElement: JSX.Element
        let selectedOption: Props['options'][number] | undefined
        let selectedOptionIndex: number | undefined

        if (disabled) {
            isSelected && (selectedOption = options.find(option => option.value == selected))

        } else {
            ({
                optionsElement, selectedOption, selectedOptionIndex
            } = getOptions(props, onSelect, arrowSelectIndex))

            selectRootProps.tabIndex = 0

            selectRootProps.onFocus = () => {
                state.isActive = true
                setState({ ...state })
            }

            if (isActive) {
                selectRootProps.onBlur = () => {
                    setState( getDefaultState() )
                }

                selectRootProps.onKeyDown = e => {
                    const keyCode = e.nativeEvent.key
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

        refApi && (applyRefApi(selectRootProps, props))
        rootTagAttributes && (selectRootProps = mergeTagAttributes(selectRootProps, rootTagAttributes))


        const displayValue = selectedOption
            ?   getDisplayValue
                ?   getDisplayValue(selectedOption)
                :   selectedOption.title
            :   placeholder

        const selectInput = <>
            <div className={ theme.title_wrapper }
                onMouseDown={ e => {
                    if (isActive) {
                        e.preventDefault()
                        ;(selectRootProps.ref as RootRef).current.blur()
                    }
                } }>

                <div className={ theme.title_text } children={ displayValue } />

                { !disabled && resetIcon && (
                    <div children={ resetIcon } className={ theme.reset }
                        onMouseDown={ e => {
                            onSelect(_undef, e)
                        } } />
                )}

                { dropdownIcon }
            </div>

            { errorMsg && <div className={ theme.error_text } children={ errorMsg } /> }

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

                { children && addChildren(children, theme) }
            </div>
        )
    }
)


export default Select
export { componentID, getDefaultState }
export type { Props, Component }