import React, { useState } from 'react'

import floatMath from '../../../common/math/floats_arifmetic'
import isExists from '../../../common/is/exists'
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
    checkRanges, pretifyInputString
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
            _disabled_all: _undef
        },
        minusIcon: '-',
        plusIcon: '+',
        min: -Infinity,
        max: Infinity
    },
    props => {

        const {
            theme, disabled, onChange, onFocus, step, precision, min, max, disabledInput, className,
            value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
            refApi, rootTagAttributes, inputRootAttributes, children, onBlur, debounceMs,
            autofocus, mask, inputTheme, inputMemoDeps, inputClassName
        } = props


        const _inputStore = inputStore || useState( getDefaultInputStoreState() )
        const { isFocused } = _inputStore[0]

        const numberMask = regexp || buildInputRegexp(min, max, precision)
        const numberValue = typeof value == 'number'
            ?   value
            :   parseFloat(value)


        let numberpickerRootProps: Props['rootTagAttributes'] = {
            className: applyClassName(className, [[ theme._disabled_all, disabled ]])
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


        const onNumberPickerChange: OnNumberPickerChange = (event, isKeyboardArrowUp, step) => {
            if (event.type == 'blur') {
                onBlur?.(event as React.FocusEvent<HTMLDivElement>)
                if (!isExists(value) || value === '') return
            }

            let result: string | number
            if (step) {
                if (isNaN(numberValue)) {
                    result = step < 0
                        ?   isFinite(max)
                            ?   max
                            :   isFinite(min) ? min : 0
                        :   isFinite(min)
                            ?   min
                            :   isFinite(max) ? max : 0

                } else {
                    result = checkRanges(numberValue, min, max)

                    const stepPrecision = getValuePrecision(step)
                    const indexOfNumberValuePrecision = getValuePrecision(numberValue)

                    if (stepPrecision || indexOfNumberValuePrecision) {
                        const presision = Math.max(stepPrecision, indexOfNumberValuePrecision)
                        result = floatMath(presision, numberValue, step)

                    } else result = numberValue + step
                }

            } else result = checkRanges(numberValue, min, max)


            precision && (result = result.toFixed(precision))

            result === value || onChange({
                value: `${result}`,
                isValid: true,
                numberValue: +result,
                event, isKeyboardArrowUp, payload
            })
        }


        const inputValue = getInputString({ value, precision, numberValue, numberMask, isFocused })

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
            onBlur: onNumberPickerChange,
            onChange(value, event) {
                const newValueString = pretifyInputString(value)
                const numberValue = parseFloat(value)

                inputValue != newValueString && onChange({
                    event, payload, numberValue,
                    value: newValueString,
                    isValid: !isNaN(numberValue) && numberValue == checkRanges(numberValue, min, max),
                    isKeyboardArrowUp: _undef
                })
            }
        }


        let stepper
        if (step) {
            stepper = getStepButtons(props, numberValue, onNumberPickerChange)

            if (isFocused) {
                numberpickerRootProps.onKeyDown = event => {
                    const keyCode = event.nativeEvent.key

                    if (keyCode == keyCodes.DELETE) {
                        inputFieldProps.disabled || onChange({
                            numberValue: NaN,
                            value: '',
                            isValid: false,
                            isKeyboardArrowUp: _undef,
                            event, payload
                        })

                    } else {
                        const isKeyUp = keyCode == keyCodes.UP

                        if (isKeyUp || keyCode == keyCodes.DOWN) {
                            event.preventDefault()

                            let _step = step
                            isKeyUp || (_step *= -1)

                            onNumberPickerChange(event, isKeyUp, _step)
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