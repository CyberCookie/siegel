import React, { useState, useRef } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import floatMath from '../../../common/math/floats_arifmetic'
import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import applyRefApi from '../_internals/ref_apply'
import getInputLabeled from '../_internals/label'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import {
    buildInputRegexp, getInputString, getValuePrecision, getStepButtons,
    adjustWithRanges, pretifyInputString, isValidNumberString
} from './helpers'

import type { DivTagAttributes } from '../_internals/types'
import type {
    ComponentFocusEventHandler, OnNumberPickerChange, Props, Component,
    DefaultProps
} from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-number_picker'

const NumberPicker = component<Props, DefaultProps>(
    componentID,
    {
        className: styles.root!,
        theme: {
            root: _undef,
            label_wrapper: _undef,
            label_text: _undef,
            controls: _undef,
            button_minus: _undef,
            button_plus: _undef,
            _error: _undef,
            _disabled_all: _undef,
            _focused: _undef
        },
        min: -Infinity,
        max: Infinity,
        precisionKeepZeroes: true
    },
    props => {

        const {
            theme, disabled, step, precision, disabledInput, className, precisionKeepZeroes,
            value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
            rootTagAttributes, inputRootAttributes, children, debounceMs, suffix, prefix,
            autofocus, mask, inputTheme, inputMemoDeps, inputClassName,
            onChange, onFocus, onBlur, onKeyDown
        } = props

        let { min, max } = props
        min > max && ([ min, max ] = [ max, min ])

        const numberValue = typeof value == 'number'
            ?   value
            :   parseFloat(value)

        const numberMask = buildInputRegexp(min, max, precision, regexp)


        const ref = useRef() as React.MutableRefObject<HTMLDivElement>

        const _inputStore = inputStore || useState(getDefaultInputStoreState())
        const [{ isFocused }, setInputState ] = _inputStore

        const editStore = useState({
            prevValidNumer: isValidNumberString(value, numberValue)
                ?   numberValue
                :   undefined
        })
        const editState = editStore[0]
        const { prevValidNumer } = editState


        const _onBlur: ComponentFocusEventHandler = e => {
            e.stopPropagation()

            const { relatedTarget } = e.nativeEvent
            if (!relatedTarget || !(ref.current.contains(relatedTarget as Node))) {

                onBlur?.(e)
                e.defaultPrevented || setInputState({
                    isFocused: false,
                    isTouched: true
                })
            }
        }
        const _onFocus: ComponentFocusEventHandler = e => {
            e.stopPropagation()
            onFocus?.(e)
            e.defaultPrevented || setInputState({
                isFocused: true,
                isTouched: true
            })
        }


        let onPickerFocus: ComponentFocusEventHandler | undefined
        let onPickerBlur: ComponentFocusEventHandler | undefined
        if (!disabled) {
            isFocused
                ?   (onPickerBlur = _onBlur)
                :   (onPickerFocus = _onFocus)
        }


        let numberpickerRootProps: DivTagAttributes = {
            ref, onKeyDown,
            onFocus: onPickerFocus,
            onBlur: onPickerBlur,
            className: applyClassName(className, [
                [ theme._disabled_all, disabled ],
                [ theme._focused, isFocused ],
                [ theme._error, isExists(errorMsg) ]
            ])
        }
        if (disabledInput && !disabled) {
            numberpickerRootProps.tabIndex = 0

            isFocused
                ?   (numberpickerRootProps.onBlur = _onBlur)
                :   (numberpickerRootProps.onFocus = _onFocus)
        }

        applyRefApi(numberpickerRootProps, props)


        const onStepChange: OnNumberPickerChange = (event, isKeyboardArrowUp, step) => {
            let result: number | string
            if (isNaN(numberValue)) {
                result = step < 0
                    ?   isFinite(max)
                        ?   max
                        :   isFinite(min) ? min : 0
                    :   isFinite(min)
                        ?   min
                        :   isFinite(max) ? max : 0

            } else {
                const stepPrecision = getValuePrecision(step)
                const numberValuePrecision = getValuePrecision(numberValue)

                if (stepPrecision || numberValuePrecision) {
                    const presision = Math.max(stepPrecision, numberValuePrecision)
                    result = floatMath(presision, numberValue, step)

                } else result = numberValue + step

                result = adjustWithRanges(result, min, max)
            }

            isExists(precision) && (result = result.toFixed(precision))

            const newNumberValue = +result
            editState.prevValidNumer = newNumberValue

            onChange({
                value: `${precisionKeepZeroes ? result : newNumberValue}`,
                isValidNumberString: true,
                numberValue: newNumberValue,
                event, isKeyboardArrowUp, payload, prevValidNumer
            })
        }


        const inputValue = getInputString({ props, numberValue, numberMask, isFocused })

        const inputFieldProps: InputProps = {
            children, errorMsg, placeholder, inputAttributes, mask, suffix,
            prefix, debounceMs, autofocus,
            theme: inputTheme,
            memoDeps: inputMemoDeps,
            className: inputClassName,
            rootTagAttributes: inputRootAttributes,
            regexp: numberMask,
            value: inputValue,
            store: _inputStore,
            disabled: disabled || disabledInput,
            onBlur(event) {
                const { relatedTarget } = event.nativeEvent
                if (!relatedTarget || !ref.current.contains(relatedTarget as Node)) {
                    if (!event.defaultPrevented) {

                        let newStringValue: string | undefined
                        let newNumberValue: number | undefined
                        let shouldTriggerOnChange = true

                        if (isValidNumberString(value, numberValue)) {
                            const newNumberValueRangeLimited = adjustWithRanges(numberValue, min, max)
                            if (newNumberValueRangeLimited != numberValue) {
                                newStringValue = `${newNumberValueRangeLimited}`
                                newNumberValue = newNumberValueRangeLimited

                            } else shouldTriggerOnChange = false

                        } else {
                            newNumberValue = min <= 0 && 0 <= max
                                ?   0
                                :   Math.abs(min) > Math.abs(max) ? max : min
                            newStringValue = `${newNumberValue}`
                        }

                        if (shouldTriggerOnChange) {
                            editState.prevValidNumer = newNumberValue!

                            onChange({
                                event, payload, prevValidNumer,
                                isValidNumberString: true,
                                numberValue: newNumberValue!,
                                value: newStringValue!
                            })
                        }
                    }

                } else {
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            onChange(value, event) {
                const newValueString = pretifyInputString(value)
                if (inputValue != newValueString) {

                    const newNumberValue = parseFloat(value)

                    const isValidNewNumberString = isValidNumberString(newValueString, newNumberValue)
                        &&  newNumberValue == adjustWithRanges(newNumberValue, min, max)

                    isValidNewNumberString && (editState.prevValidNumer = newNumberValue)

                    onChange({
                        event, payload, prevValidNumer,
                        numberValue: newNumberValue,
                        isValidNumberString: isValidNewNumberString,
                        value: newValueString
                    })
                }
            }
        }


        let stepper
        if (!disabled && step) {
            const {
                isDisabledDown, isDisabledUp, stepperElement
            } = getStepButtons({
                props, min, max,
                numberValue, onStepChange, onPickerBlur, onPickerFocus
            })

            stepper = stepperElement

            isFocused && (numberpickerRootProps.onKeyDown = event => {
                onKeyDown?.(event)

                if (!event.defaultPrevented) {
                    const keyCode = event.key

                    if (keyCode == keyCodes.DELETE) {
                        onChange({
                            numberValue: NaN,
                            value: '',
                            isValidNumberString: false,
                            event, payload, prevValidNumer
                        })

                    } else {
                        const isKeyUp = keyCode == keyCodes.UP
                        const isKeyDown = keyCode == keyCodes.DOWN

                        const isAllowedAction = isKeyUp && !isDisabledUp
                            ||  (isKeyDown && !isDisabledDown)

                        if (isAllowedAction) {
                            event.preventDefault()

                            let _step = step
                            isKeyUp || (_step *= -1)

                            onStepChange(event, isKeyUp, _step)
                        }
                    }
                }
            })
        }

        numberpickerRootProps = resolveTagAttributes(numberpickerRootProps, rootTagAttributes)

        const inputElement = <Input { ...inputFieldProps } />


        return (
            <div { ...numberpickerRootProps }>
                { label
                    ?   getInputLabeled(
                            <div className={ theme.input_wrapper }>
                                { inputElement }
                                { stepper }
                            </div>,
                            { className: theme.label_wrapper },
                            { className: theme.label_text, children: label }
                        )
                    :   <>
                            { inputElement }
                            { stepper }
                        </>
                }
            </div>
        )
    }
)


export default NumberPicker
export { componentID }
export type { Component, Props }