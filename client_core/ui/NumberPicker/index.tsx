import React, { useState, useRef } from 'react'

import useDidUpdate from '../../hooks/did_update'
import floatMath from '../../../common/math/floats_arifmetic'
import isExists from '../../../common/is/exists'
import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import * as keyCodes from '../_internals/key_codes'
import applyRefApi from '../_internals/ref_apply'
import getInputLabeled from '../_internals/label'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input'
import { setCaretPos } from '../Input/utils'
import {
    buildInputRegexp, getInputString, getValuePrecision, getStepButtons,
    adjustWithRanges, pretifyInputString, isValidNumberString, isValidNumberMissingDigits
} from './helpers'

import type { DivTagAttributes } from '../_internals/types'
import type {
    DefaultProps, Props, MergedProps, Component,
    ComponentFocusEventHandler, OnNumberPickerChange
} from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-number_picker'


function getValueState(
    props: MergedProps,
    numberValue: number,
    numberMask: RegExp,
    isFocused: boolean
) {
    const prevValidNumber = isValidNumberString(props.value) ? numberValue : undefined
    return {
        prevValidNumber,
        stringValue: getInputString({
            props, numberValue, numberMask, isFocused, prevValidNumber
        })
    }
}


const NumberPicker = component<Props, DefaultProps>(
    componentID,
    {
        className: styles.root,
        theme: {
            root: _undef,
            label_wrapper: _undef,
            label_text: _undef,
            controls: _undef,
            value_decrement_icon: _undef,
            value_increment_icon: _undef,
            button__disabled: _undef,
            _error: _undef,
            _disabled_all: _undef,
            _focused: _undef
        },
        inputTheme: {},
        min: -Infinity,
        max: Infinity
    },
    props => {
        const {
            theme, disabled, step, precision, disabledInput, className,
            value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
            rootTagAttributes, inputRootAttributes, children, debounceMs, suffix, prefix,
            autofocus, mask, inputTheme, inputMemoDeps, inputClassName,
            onChange, onFocus, onBlur, onKeyDown, onStringChange
        } = props

        let { min, max } = props
        min > max && ([ min, max ] = [ max, min ])

        const numberValue = typeof value == 'number'
            ?   value
            :   parseFloat(value)

        const isValueExists = isExists(value)

        const numberMask = buildInputRegexp(min, max, precision, regexp)


        const ref = useRef(null)

        const _inputStore = inputStore || useState(getDefaultInputStoreState())
        const [{ isFocused }, setInputState ] = _inputStore


        const editStore = useState(() => getValueState(props, numberValue, numberMask, isFocused))
        const [ editState, setEditState ] = editStore
        const { prevValidNumber, stringValue } = editState

        useDidUpdate(() => {
            setEditState(
                getValueState(props, numberValue, numberMask, isFocused)
            )
        }, [ value ])



        const _onBlur: ComponentFocusEventHandler = e => {
            e.stopPropagation()

            const { relatedTarget } = e.nativeEvent
            if (!relatedTarget || !((ref.current! as HTMLDivElement).contains(relatedTarget as Node))) {

                onBlur?.(e)
                e.defaultPrevented || setInputState({
                    isFocused: false,
                    isTouched: true
                })

                if (isValueExists) {
                    editState.stringValue = getInputString({
                        props, numberValue, numberMask, prevValidNumber,
                        isFocused: false
                    })
                }
            }
        }
        const _onFocus: ComponentFocusEventHandler = e => {
            e.stopPropagation()
            onFocus?.(e)
            e.defaultPrevented || setInputState({
                isFocused: true,
                isTouched: true
            })

            if (isValueExists) {
                editState.stringValue = getInputString({
                    props, numberValue, numberMask, prevValidNumber,
                    isFocused: true
                })
            }
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


            onChange({
                event, isKeyboardArrowUp, payload,
                numberValue: +result
            })

            editState.stringValue = `${result}`
            setEditState({ ...editState })
        }



        const inputFieldProps: InputProps = {
            children, errorMsg, placeholder, inputAttributes, mask, suffix,
            prefix, debounceMs, autofocus,
            theme: inputTheme,
            memoDeps: inputMemoDeps,
            className: inputClassName,
            rootTagAttributes: inputRootAttributes,
            regexp: numberMask,
            value: stringValue,
            store: _inputStore,
            disabled: disabled || disabledInput,
            onBlur(event) {
                const { relatedTarget } = event.nativeEvent
                if (!relatedTarget || !(ref.current! as HTMLDivElement).contains(relatedTarget as Node)) {
                    if (!event.defaultPrevented) {

                        let newNumberValue!: number
                        let shouldTriggerOnChange = true

                        if (!isNaN(numberValue)) {
                            const newNumberValueRangeLimited = adjustWithRanges(numberValue, min, max)

                            if ((newNumberValueRangeLimited != numberValue) || isValidNumberMissingDigits(stringValue)) {
                                newNumberValue = newNumberValueRangeLimited

                            } else shouldTriggerOnChange = false

                        } else if (isValueExists) {
                            newNumberValue = min <= 0 && 0 <= max
                                ?   0
                                :   Math.abs(min) > Math.abs(max) ? max : min
                        }

                        shouldTriggerOnChange && onChange({
                            event, payload,
                            numberValue: newNumberValue!
                        })
                    }

                } else {
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            onChange(value, event) {
                const newValueString = pretifyInputString(value)
                if (stringValue != newValueString) {

                    const newNumberValue = parseFloat(value)
                    const newNumberRangeAdjusted = adjustWithRanges(newNumberValue, min, max)
                    const isValidStringNumber = isValidNumberString(newValueString)

                    isValidStringNumber && newNumberRangeAdjusted == newNumberValue && onChange({
                        event, payload,
                        numberValue: newNumberValue
                    })


                    onStringChange?.({ value, event, isValidStringNumber, payload })

                    editState.stringValue = newValueString
                    setEditState({ ...editState })
                }
            }
        }


        let stepper
        if (!disabled && isExists(step)) {
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
                        editState.stringValue = ''
                        setEditState({ ...editState })

                        if (suffix) {
                            setCaretPos({
                                current: event.currentTarget.querySelector('input')!
                            }, prefix?.length || 0)
                        }

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