import React, { useState } from 'react'

import floatMath from '../../utils/math_float'
import isExists from '../../utils/is/exists'
import * as keyCodes from '../_internals/key_codes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import Input, {
    getDefaultState as getDefaultInputStoreState,
    Props as InputProps
} from '../Input/index'
import {
    buildInputRegexp, normalizeInputValue, stringToNumberValue, getValuePrecision,
    getStepButtons
} from './helpers'
import type { Component, MergedProps, OnNumberPickerChange, Props } from './types'

import styles from './styles.sass'


const componentID = '-ui-number_picker'

const NumberPicker: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, disabled, onChange, onFocus, step, precision, min, max, disabledInput, className,
        value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes,
        refApi, rootTagAttributes, inputRootAttributes, children, onBlur, autofocus, mask, inputTheme
    } = mergedProps


    const _inputStore = inputStore || useState( getDefaultInputStoreState() )
    const { isFocused } = _inputStore[0]

    const numberMask = regexp || buildInputRegexp(min, max, precision)
    const numberValue = stringToNumberValue(value, min, max)


    let numberpickerRootProps: Props['rootTagAttributes'] = { className }
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
    disabled && (numberpickerRootProps.className += ` ${theme._disabled_all}`)
    refApi && (applyRefApi(numberpickerRootProps, mergedProps))


    const onNumberPickerChange: OnNumberPickerChange = (event, isKeyboardArrowUp, step) => {
        if (event.type == 'blur') {
            onBlur?.(event as React.FocusEvent<HTMLDivElement>)
            if (!isExists(value) || value === '') return
        }

        let result: string | number
        if (step) {
            const stepPrecision = getValuePrecision(step)
            const indexOfNumberValuePrecision = getValuePrecision(numberValue)

            if (stepPrecision || indexOfNumberValuePrecision) {
                const presision = Math.max(stepPrecision, indexOfNumberValuePrecision)
                result = floatMath(presision, numberValue, step)

            } else result = numberValue + step
        } else result = numberValue

        result < min
            ?   (result = min)
            :   result > max && (result = max)

        precision && (result = result.toFixed(precision))

        result === value || onChange({
            value: `${result}`,
            event, isKeyboardArrowUp, payload
        })
    }


    theme.root = theme.input_root

    const inputFieldProps: InputProps = {
        label, errorMsg, placeholder, inputAttributes, onFocus, mask, autofocus,
        theme: inputTheme,
        rootTagAttributes: inputRootAttributes,
        regexp: numberMask,
        value: normalizeInputValue(value, precision, isFocused),
        store: _inputStore,
        disabled: disabled || disabledInput,
        onBlur: onNumberPickerChange,
        onChange(value, event) {
            onChange({
                event, payload,
                isKeyboardArrowUp: undefined,
                value: value.replace(',', '.')
            })
        }
    }


    let stepper
    if (step) {
        stepper = getStepButtons(mergedProps, numberValue, onNumberPickerChange)

        if (isFocused) {
            numberpickerRootProps.onKeyDown = event => {
                const keyCode = event.nativeEvent.key

                if (keyCode == keyCodes.DELETE) {
                    const newValue = inputFieldProps.disabled
                        ?   `${isFinite(min) ? min : 0}`
                        :   ''

                    onChange({
                        value: newValue,
                        isKeyboardArrowUp: undefined,
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


    return (
        <div { ...numberpickerRootProps }>
            <Input { ...inputFieldProps } />

            { stepper }

            { children && addChildren(children, theme) }
        </div>
    )
}
NumberPicker.defaults = {
    className: styles[`${componentID}_inner`],
    theme: {
        root: '',
        children: '',
        controls: '',
        button_minus: '',
        button_plus: '',
        input_root: '',
        _disabled_all: ''
    },
    minusIcon: '-',
    plusIcon: '+',
    min: -Infinity,
    max: Infinity
}
NumberPicker.ID = componentID


export { componentID }
export default NumberPicker
export * from './types'