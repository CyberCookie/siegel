//TODO?: onchange isValid flag

import React, { useState } from 'react'

import isExists from '../../../utils/is_exists'
import floatMath from '../../../utils/math_float'
import { extractProps } from '../../ui_utils'
import Input, { getDefaultInputStoreState } from '../Input'
import type { _NumberPicker, MergedProps, BtnClickEv, BtnProps, OnNumberPickerChange } from './types'
import type { ComponentAttributes } from '../../ui_utils'
import type { Props as InputProps } from '../Input/types' 

import styles from './styles.sass'


const componentID = '-ui-number_picker'

const keyDown = 'ArrowDown', keyUp = 'ArrowUp', deleteCode = 'Delete';

function getRegExp(min: MergedProps['min'], max: MergedProps['max'], precision: MergedProps['precision']): RegExp {
    const minLimit = Math.min(min, max)
    let regexpTemplate = '^'

    minLimit < 0 && (regexpTemplate += '-?')
    regexpTemplate += '\\d*[.,]?\\d'

    if (precision === undefined) {
        regexpTemplate += '*'
    } else if (precision !== 0) {
        regexpTemplate += `{0,${precision}}`
    }

    regexpTemplate += '$'


    return new RegExp(regexpTemplate)
}

function getNumberValue(value: MergedProps['value'], min: MergedProps['min'], max: MergedProps['max']) {
    const numberFloat = parseFloat(value as string)

    return isNaN(numberFloat)
        ?   isFinite(min)
            ?   min
            :   isFinite(max) ? max : 0
        :   numberFloat
}

const zero = '0'
function getNormalizedStringValue(value?: string, precision?: number) {
    if (!isExists(value)) return value;


    let indexOfDot = value.indexOf('.') || value.length;
    indexOfDot < 0 && (indexOfDot = value.length)

    let zeroesCount = 0;
    for (let i = 0, l = indexOfDot - 1; i < l; i++) {
        if (value[i] == zero) zeroesCount++
        else if (zeroesCount) break
    }
    zeroesCount && (value = value.replace(zero.repeat(zeroesCount), ''))

    if (precision) {
        const maxLength = indexOfDot + precision + 1;
        value.length > maxLength && (value = value.substr(0, maxLength))
    }

    return value
}

const getPrecision = (_num: number) => {
    const stringNum = _num+''
    const indexOfDot = stringNum.indexOf('.')

    return indexOfDot >= 0 ? stringNum.length - indexOfDot - 1 : 0
}

function getStepper(props: MergedProps, numberValue: number, onNumberPickerChange: OnNumberPickerChange) {
    const { theme, disabled, step, plusIcon, minusIcon, min, max } = props;

    const plusProps: BtnProps = {
        className: theme.button_plus,
        children: plusIcon
    }
    if (disabled || (numberValue >= max)) {
        plusProps.disabled = true
    } else {
        plusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, true, step)
        }
    }
    
    const minusProps: BtnProps = {
        className: theme.button_minus,
        children: minusIcon
    }

    if (disabled || (numberValue <= min)) {
        minusProps.disabled = true
    } else {
        minusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, false, -step!)
        }
    }

    minusProps.tabIndex = plusProps.tabIndex = -1;

    
    return (
        <div className={theme.controls}>
            <button {...minusProps} />
            <button {...plusProps} />
        </div>
    )
}

const NumberPicker: _NumberPicker = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props)
        :   (props as _NumberPicker['defaults'] & typeof props)
    
    const {
        theme, disabled, onChange, step, precision, min, max, disabledInput, keyboardControls, className, 
        value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes
    } = mergedProps;


    const _inputStore = inputStore || useState(getDefaultInputStoreState())
    const { isFocused } = _inputStore[0]

    const numberMask = regexp || getRegExp(min, max, precision)
    const numberValue = getNumberValue(value, min, max)

    
    const numberpickerRootProps: ComponentAttributes = { className }
    if (disabledInput && !disabled) {
        const [ inputState, setInputState ] = _inputStore;

        numberpickerRootProps.tabIndex = 0
        numberpickerRootProps.onFocus = () => {
            setInputState({
                isFocused: true,
                isTouched: true
            })
        }
        isFocused && (numberpickerRootProps.onBlur = () => {
            inputState.isFocused = false;
            setInputState({ ...inputState })
        })
    }

    const inputFieldProps: InputProps = {
        theme, label, errorMsg, placeholder, inputAttributes,
        regexp: numberMask,
        value: getNormalizedStringValue(value),
        inputStore: _inputStore,
        disabled: disabled || disabledInput,
        onBlur(e) { onNumberPickerChange(e) },
        onChange(_value, e) {
            const value = _value.replace(',', '.')
            onChange(value, e, undefined, payload)
        }
    }
    disabled && (numberpickerRootProps.className += ` ${theme._disabled_all}`)


    const onNumberPickerChange: OnNumberPickerChange = (e, arrowValue, step) => {
        let result: string | number | undefined;
        if (step) {
            const stepPrecision = getPrecision(step)
            const indexOfNumberValuePrecision = getPrecision(numberValue)
            if (stepPrecision || indexOfNumberValuePrecision) {
                const presision = Math.max(stepPrecision, indexOfNumberValuePrecision)
                
                result = floatMath(presision, numberValue, step)
            } else result = numberValue + step
        } else result = numberValue;

        result < min
            ?   (result = min)
            :   result > max && (result = max)

        precision && (result = result.toFixed(precision))
        
        result == value || onChange(result+'', e, arrowValue, payload)
    }
    
    let stepper;
    if (step) {
        if (keyboardControls && isFocused) {
            numberpickerRootProps.onKeyDown = e => {
                const keyCode = e.nativeEvent.key;

                if (keyCode == deleteCode) {
                    const newValue = inputFieldProps.disabled
                        ?   (isFinite(min) ? min : 0)+''
                        :   ''
                    
                    onChange(newValue, e, payload)
                } else {
                    const isKeyUp = keyCode == keyUp;

                    if (isKeyUp || keyCode == keyDown) {
                        e.preventDefault()

                        let _step = step;
                        isKeyUp || (_step *= -1)
            
                        onNumberPickerChange(e, isKeyUp, _step)
                    }
                }
            }
        }

        stepper = getStepper(mergedProps, numberValue, onNumberPickerChange)
    } 
    

    return (
        <div { ...numberpickerRootProps }>
            <Input { ...inputFieldProps } />
            { stepper }
        </div>
    )
}
NumberPicker.defaults = {
    className: styles[componentID + '__inner'],
    theme: {
        root: componentID,
        controls: componentID + '_controls',
        button_minus: componentID + '_minus',
        button_plus: componentID + '_plus',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        error_text: componentID + '_error_text',
        field: componentID + '_field',
        _disabled_all: componentID + '__disabled_all',
        _disabled: componentID + '__disabled',
        _focused: componentID + '__focused',
        _touched: componentID + '__touched',
        _filled: componentID + '__filled',
        _error: componentID + '__error',
    },

    minusIcon: '-',
    plusIcon: '+',
    min: -Infinity,
    max: Infinity,
    keyboardControls: true
}
NumberPicker.ID = componentID;


export { componentID }
export default NumberPicker