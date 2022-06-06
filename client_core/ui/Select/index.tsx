import React, { useState, useRef } from 'react'

import isExists from '../../utils/is/exists'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import { getOptionWithKeyboard, getOptions } from './helpers'
import type { ComponentAttributes } from '../_internals/types'
import type { Component, Props, Store, OnSelect, RootRef } from './types'


const componentID = '-ui-select'

const getDefaultState = () => ({
    isActive: false,
    arrowSelectIndex: undefined
} as Store[0])

const Select: Component = component(
    componentID,
    {
        theme: {
            root: '',
            _filled: '',
            _active: '',
            _disabled: '',
            _error: '',
            children: '',
            label: '',
            reset: '',
            title_wrapper: '',
            title_text: '',
            error_text: '',
            input_wrapper: '',
            options: '',
            option: '',
            option__active: '',
            option__disabled: ''
        },
        closeOnSelect: true,
        filterSelected: true
    },
    props => {

        const {
            theme, rootTagAttributes, options, getDisplayValue, selected, dropdownIcon, label,
            disabled, placeholder, refApi, store, resetIcon, onChange, closeOnSelect, children,
            errorMsg
        } = props

        const [ state, setState ] = store || useState(getDefaultState())
        const { isActive, arrowSelectIndex } = state


        const onSelect: OnSelect = (value, e, payload) => {
            e.stopPropagation()
            e.preventDefault()

            onChange(value, e, payload)

            closeOnSelect && (selectRootProps.ref as RootRef).current.blur()
        }

        const isSelected = isExists(selected)

        let { className } = props
        isActive && (className += ` ${theme._active}`)
        isSelected && (className += ` ${theme._filled}`)

        let selectRootProps: ComponentAttributes<HTMLDivElement> = {
            className,
            ref: useRef() as RootRef
        }
        errorMsg && (selectRootProps.className += ` ${theme._error}`)

        let optionsElement, selectedOption
        if (disabled) {
            selectRootProps.className += ` ${theme._disabled}`

            if (isSelected) {
                selectedOption = options.find(option => option.value == selected)
            }
        } else {
            ({ optionsElement, selectedOption } = getOptions(props, onSelect, arrowSelectIndex))

            selectRootProps.tabIndex = 0

            selectRootProps.onFocus = () => {
                if (!isActive) {
                    state.isActive = true
                    setState({ ...state })
                }
            }

            if (isActive) {
                selectRootProps.onBlur = () => {
                    setState( getDefaultState() )
                }

                selectRootProps.onKeyDown = e => {
                    e.preventDefault()

                    const keyCode = e.nativeEvent.key
                    const isUp = keyCode == keyCodes.UP

                    const isArrowIndexExists = isExists(arrowSelectIndex)

                    if (isUp || keyCode == keyCodes.DOWN) {
                        state.arrowSelectIndex = isArrowIndexExists
                            ?   isUp
                                ?   getOptionWithKeyboard(options, arrowSelectIndex, -1)
                                :   getOptionWithKeyboard(options, arrowSelectIndex, 1)
                            :   getOptionWithKeyboard(options, 0, 1)

                        setState({ ...state })

                    } else if (keyCode == keyCodes.DELETE) {
                        onSelect(undefined, e)

                    } else if (keyCode == keyCodes.ENTER && isArrowIndexExists) {
                        const { value, payload } = options[arrowSelectIndex]
                        onSelect(value, e, payload)
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
            <div className={ theme.title_wrapper }>
                <div className={ theme.title_text } children={ displayValue } />

                { !disabled && resetIcon && (
                    <div children={ resetIcon } className={ theme.reset }
                        onMouseDown={ e => {
                            onSelect(undefined, e)
                        } } />
                )}

                { dropdownIcon }
            </div>

            { errorMsg && <div className={ theme.error_text } children={ errorMsg } /> }

            { optionsElement }
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