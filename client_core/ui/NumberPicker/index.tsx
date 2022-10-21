import React, { useState } from 'react'

import floatMath from '../../../common/math/floats_arifmetic'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import applyRefApi from '../_internals/ref_apply'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import {
    buildInputRegexp, getInputString, getValuePrecision, getStepButtons,
    adjustWithRanges, pretifyInputString, isValidNumberString
} from './helpers'

import type { OnNumberPickerChange, Props, Component, DefaultProps } from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-number_picker'

const NumberPicker = component<Props, DefaultProps>(
    componentID,
    {
        className: styles.root!,
        theme: {
            root: _undef,
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
            theme, disabled, onChange, onFocus, step, precision, disabledInput, className, min, max,
            value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
            refApi, rootTagAttributes, inputRootAttributes, children, onBlur, debounceMs,
            autofocus, mask, inputTheme, inputMemoDeps, inputClassName
        } = props

        // let { min, max } = props
        // min > max && ([ min, max ] = [ max, min ])

        const numberValue = typeof value == 'number'
            ?   value
            :   parseFloat(value)


        const _inputStore = inputStore || useState(getDefaultInputStoreState())
        const { isFocused } = _inputStore[0]

        const editStore = useState({
            prevValidNumerString: isValidNumberString(value, numberValue)
                ?   `${numberValue}`
                :   undefined
        })
        const editState = editStore[0]
        const { prevValidNumerString } = editState

        const numberMask = regexp || buildInputRegexp(min, max, precision)



        let numberpickerRootProps: Props['rootTagAttributes'] = {
            className: applyClassName(className, [
                [ theme._disabled_all, disabled ],
                [ theme._focused, isFocused ]
            ])
        }
        if (disabledInput && !disabled) {
            const [ inputState, setInputState ] = _inputStore

            numberpickerRootProps.tabIndex = 0
            numberpickerRootProps.onFocus = () => {
                setInputState({
                    isFocused: true,
                    isTouched: true
                })
            }
            isFocused && (numberpickerRootProps.onBlur = () => {
                inputState.isFocused = false
                setInputState({ ...inputState })
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

            const newStringValue = `${result}`
            editState.prevValidNumerString = newStringValue

            onChange({
                value: newStringValue,
                isValidNumberString: true,
                numberValue: +result,
                event, isKeyboardArrowUp, payload, prevValidNumerString
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
                        editState.prevValidNumerString = newValueString!

                        onChange({
                            event, payload, prevValidNumerString,
                            isValidNumberString: true,
                            numberValue: newNumberValue!,
                            value: newValueString!
                        })
                    }
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
                    }

                    if (isValidNewNumberString) {
                        editState.prevValidNumerString = newValueString
                    }

                    onChange({
                        event, payload, numberValue, prevValidNumerString,
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
            } = getStepButtons(props, numberValue, onStepChange)

            stepper = stepperElement

            if (isFocused) {
                numberpickerRootProps.onKeyDown = event => {
                    const keyCode = event.nativeEvent.key

                    if (keyCode == keyCodes.DELETE) {
                        inputFieldProps.disabled || onChange({
                            numberValue: NaN,
                            value: '',
                            isValidNumberString: false,
                            event, payload, prevValidNumerString
                        })

                    } else {
                        const isKeyUp = keyCode == keyCodes.UP
                        const isKeyDown = keyCode == keyCodes.DOWN

                        const isAllowedACtion = isKeyUp && !isDisabledUp
                            ||  (isKeyDown && !isDisabledDown)

                        if (isAllowedACtion) {
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
                    ?   <>
                            <div className={ theme.label } children={ label } />
                            <div className={ theme.input_wrapper }>
                                { inputElement }
                                { stepper }
                            </div>
                        </>
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