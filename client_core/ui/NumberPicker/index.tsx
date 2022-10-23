import React, { useState, useRef } from 'react'

import floatMath from '../../../common/math/floats_arifmetic'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import applyRefApi from '../_internals/ref_apply'
import getInputLabeled from '../_internals/label'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import {
    buildInputRegexp, getInputString, getValuePrecision, getStepButtons,
    adjustWithRanges, pretifyInputString, isValidNumberString
} from './helpers'

import type {
    OnFocusEventHandler, OnNumberPickerChange, Props, Component, DefaultProps
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
            _disabled_all: _undef,
            _focused: _undef
        },
        minusIcon: '-',
        plusIcon: '+',
        min: -Infinity,
        max: Infinity
    },
    props => {

        const {
            theme, disabled, onChange, onFocus, step, precision, disabledInput, className,
            value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
            refApi, rootTagAttributes, inputRootAttributes, children, onBlur, debounceMs,
            autofocus, mask, inputTheme, inputMemoDeps, inputClassName
        } = props

        let { min, max } = props
        min > max && ([ min, max ] = [ max, min ])

        const numberValue = typeof value == 'number'
            ?   value
            :   parseFloat(value)

        const numberMask = regexp || buildInputRegexp(min, max, precision)


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



        let onPickerFocus: OnFocusEventHandler | undefined
        let onPickerBlur: OnFocusEventHandler | undefined
        if (!disabled) {
            isFocused
                ?   (onPickerBlur = e => {
                        const { relatedTarget } = e.nativeEvent
                        if (!relatedTarget || !(ref.current.contains(relatedTarget as Node))) {
                            setInputState({
                                isFocused: false,
                                isTouched: true
                            })
                        }
                    })

                :   (onPickerFocus = () => {
                        setInputState({
                            isFocused: true,
                            isTouched: true
                        })
                    })
        }


        let numberpickerRootProps: Props['rootTagAttributes'] = {
            ref,
            onFocus: onPickerFocus,
            onBlur: onPickerBlur,
            className: applyClassName(className, [
                [ theme._disabled_all, disabled ],
                [ theme._focused, isFocused ]
            ])
        }
        if (disabledInput && !disabled) {
            numberpickerRootProps.tabIndex = 0

            isFocused
                ?   (numberpickerRootProps.onBlur = e => {
                        const { relatedTarget } = e.nativeEvent
                        if (!relatedTarget || !(ref.current.contains(relatedTarget as Node))) {
                            setInputState({
                                isFocused: false,
                                isTouched: true
                            })
                        }
                    })

                :   (numberpickerRootProps.onFocus = () => {
                        setInputState({
                            isFocused: true,
                            isTouched: true
                        })
                    })
        }

        refApi && (applyRefApi(numberpickerRootProps, props))


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

            precision && (result = result.toFixed(precision))

            const newNumberValue = +result
            editState.prevValidNumer = newNumberValue

            onChange({
                value: `${result}`,
                isValidNumberString: true,
                numberValue: newNumberValue,
                event, isKeyboardArrowUp, payload, prevValidNumer
            })
        }


        const inputValue = getInputString({ props, numberValue, numberMask, isFocused })

        const inputFieldProps: InputProps = {
            children, errorMsg, placeholder, inputAttributes, onFocus, mask,
            debounceMs, autofocus,
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

                    onBlur?.(event)
                    if (!event.defaultPrevented) {

                        let newValueString: string | undefined, newNumberValue: number | undefined
                        let shouldTriggerOnChange = true

                        if (isValidNumberString(value, numberValue)) {
                            const newNumberValueRangeLimited = adjustWithRanges(numberValue, min, max)
                            if (newNumberValueRangeLimited != numberValue) {
                                newValueString = `${newNumberValueRangeLimited}`
                                newNumberValue = newNumberValueRangeLimited

                            } else shouldTriggerOnChange = false

                        } else {
                            newNumberValue = min <= 0 && 0 <= max
                                ?   0
                                :   Math.abs(min) > Math.abs(max) ? max : min
                            newValueString = `${newNumberValue}`
                        }

                        if (shouldTriggerOnChange) {
                            editState.prevValidNumer = newNumberValue!

                            onChange({
                                event, payload, prevValidNumer,
                                isValidNumberString: true,
                                numberValue: newNumberValue!,
                                value: newValueString!
                            })
                        }
                    }

                } else {
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            onChange(value, event) {
                let newValueString = pretifyInputString(value)
                if (inputValue != newValueString) {
                    let newNumberValue = parseFloat(value)

                    const isValidNewNumberString = isValidNumberString(newValueString, newNumberValue)
                    if (isValidNewNumberString) {
                        const newNumberValueRangeLimited = adjustWithRanges(newNumberValue, min, max)
                        if (newNumberValueRangeLimited != newNumberValue) {
                            newValueString = `${newNumberValueRangeLimited}`
                            newNumberValue = newNumberValueRangeLimited
                        }

                        editState.prevValidNumer = newNumberValue
                    }

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
        if (step) {
            const {
                isDisabledDown, isDisabledUp, stepperElement
            } = getStepButtons({
                props, min, max,
                numberValue, onStepChange, onPickerBlur, onPickerFocus
            })

            stepper = stepperElement

            if (isFocused) {
                numberpickerRootProps.onKeyDown = event => {
                    const keyCode = event.nativeEvent.key

                    if (keyCode == keyCodes.DELETE) {
                        inputFieldProps.disabled || onChange({
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
            }
        }

        if (rootTagAttributes) {
            numberpickerRootProps = mergeTagAttributes(numberpickerRootProps, rootTagAttributes)
        }

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