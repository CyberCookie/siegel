//TODO?: onchange isValid flag

import React, { useState } from 'react'

import floatMath from '../../../utils/math_float'
import isE from '../../../utils/is_exists'
import { extractProps, applyRefApi } from '../../ui_utils'
import addChildren from '../../children'
import Input, { getDefaultInputStoreState, updateThemeWithInputFieldTheme, Props as InputProps } from '../Input'
import type {
    Component, MergedProps, BtnClickEv, BtnProps, OnNumberPickerChange,
    Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-number_picker'

const keyDown = 'ArrowDown'
const keyUp = 'ArrowUp'
const deleteCode = 'Delete'
const CHAR_ZERO = '0'
const CHAR_DOT = '.'
const CHAR_MINUS = '-'

function getRegExp(min: MergedProps['min'], max: MergedProps['max'], precision: MergedProps['precision']): RegExp {
    let regexpTemplate = '^'

    if (min < 0) {
        regexpTemplate += CHAR_MINUS
        max >= 0 && (regexpTemplate += '?')
    }

    regexpTemplate += '(?!00)\\d'

    if (isFinite(min) || isFinite(max)) {
        const maxNumberAllowed = Math.max( Math.abs(min), Math.abs(max) )
        const regexpModificator = isFinite(maxNumberAllowed)
            ?   parseInt(maxNumberAllowed).toString().length
            :   ''

        regexpTemplate += `{0,${regexpModificator}}`
    } else regexpTemplate += '*'

    if (precision != 0) {
        regexpTemplate += '([.,]\\d'
            +   ( isE(precision) ? `{0,${precision}}` : '*' )
            +   ')?'
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

function getNormalizedStringValue(value: string | undefined, precision: number | undefined, isFocused: boolean) {
    if(!isE(value)) return

    const indexOfDot = value.indexOf(CHAR_DOT)

    const firstNumberPos = value[0] == CHAR_MINUS ? 1 : 0
    let zeroesCount = 0
    if (value.length > (firstNumberPos + 1) && value[firstNumberPos] == CHAR_ZERO) {
        for (let i = firstNumberPos, l = indexOfDot >= 0 ? indexOfDot : value.length; i < l; i++) {
            if (value[i] == CHAR_ZERO && value[i + 1] != CHAR_DOT) zeroesCount++
            else break
        }

        zeroesCount && (value = value.replace(CHAR_ZERO.repeat(zeroesCount), ''))
    }


    if (precision && indexOfDot > -1) {
        const maxLength = indexOfDot + precision + 1
        value = value.length > maxLength
            ?   value.substr(0, maxLength)
            :   value.length < maxLength && !isFocused
                ?   (+value).toFixed(precision)
                :   value
    }


    return value
}

const getPrecision = (_num: number) => {
    const stringNum = _num+''
    const indexOfDot = stringNum.indexOf(CHAR_DOT)

    return indexOfDot >= 0 ? stringNum.length - indexOfDot - 1 : 0
}

function getStepper(props: MergedProps, numberValue: number, onNumberPickerChange: OnNumberPickerChange) {
    const { theme, disabled, step, plusIcon, minusIcon, min, max } = props

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

    minusProps.tabIndex = plusProps.tabIndex = -1


    return (
        <div className={ theme.controls }>
            <button { ...minusProps } />
            <button { ...plusProps } />
        </div>
    )
}

const NumberPicker: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, disabled, onChange, onFocus, step, precision, min, max, disabledInput, keyboardControls, className,
        value, regexp, label, payload, inputStore, errorMsg, placeholder, inputAttributes, refApi, attributes,
        inputRootAttributes
    } = mergedProps


    const _inputStore = inputStore || useState(getDefaultInputStoreState())
    const { isFocused } = _inputStore[0]

    const numberMask = regexp || getRegExp(min, max, precision)
    const numberValue = getNumberValue(value, min, max)


    const numberpickerRootProps: Props['attributes'] = { className }
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
    refApi && (applyRefApi(numberpickerRootProps, mergedProps))
    attributes && Object.assign(numberpickerRootProps, attributes)


    const onNumberPickerChange: OnNumberPickerChange = (e, arrowValue, step) => {
        if ((!isE(value) || value === '') && e.type == 'blur') return

        let result: string | number | undefined
        if (step) {
            const stepPrecision = getPrecision(step)
            const indexOfNumberValuePrecision = getPrecision(numberValue)
            if (stepPrecision || indexOfNumberValuePrecision) {
                const presision = Math.max(stepPrecision, indexOfNumberValuePrecision)

                result = floatMath(presision, numberValue, step)
            } else result = numberValue + step
        } else result = numberValue

        result < min
            ?   (result = min)
            :   result > max && (result = max)

        precision && (result = result.toFixed(precision))

        result === value || onChange(result+'', e, arrowValue, payload)
    }


    theme.root = theme.input_root

    const inputFieldProps: InputProps = {
        theme, label, errorMsg, placeholder, inputAttributes, onFocus,
        attributes: inputRootAttributes,
        regexp: numberMask,
        value: getNormalizedStringValue(value, precision, isFocused),
        innerStore: _inputStore,
        disabled: disabled || disabledInput,
        onBlur: onNumberPickerChange,
        onChange(_value, e) {
            const value = _value.replace(',', CHAR_DOT)
            onChange(value, e, undefined, payload)
        }
    }
    disabled && (numberpickerRootProps.className += ` ${theme._disabled_all}`)


    let stepper
    if (step) {
        if (keyboardControls && isFocused) {
            numberpickerRootProps.onKeyDown = e => {
                const keyCode = e.nativeEvent.key

                if (keyCode == deleteCode) {
                    const newValue = inputFieldProps.disabled
                        ?   (isFinite(min) ? min : 0)+''
                        :   ''

                    onChange(newValue, e, undefined, payload)
                } else {
                    const isKeyUp = keyCode == keyUp

                    if (isKeyUp || keyCode == keyDown) {
                        e.preventDefault()

                        let _step = step
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

            { addChildren(numberpickerRootProps, theme) }
        </div>
    )
}
NumberPicker.defaults = {
    className: styles[componentID + '_inner'],
    theme: updateThemeWithInputFieldTheme({
        root: '',
        children: '',
        controls: '',
        button_minus: '',
        button_plus: '',
        input_root: '',
        _disabled_all: ''
    }),

    minusIcon: CHAR_MINUS,
    plusIcon: '+',
    min: -Infinity,
    max: Infinity,
    keyboardControls: true
}
NumberPicker.ID = componentID


export { componentID }
export default NumberPicker
export type { Props }