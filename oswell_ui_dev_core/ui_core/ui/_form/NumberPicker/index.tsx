//TODO: masks
//TODO: add precision to onBlur and input value
//TODO: truncate zeroes left
import React, { useState } from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import isExists from '../../../utils/is_exists'
import { _NumberPicker, Props, DefaultProps } from './types'


type MergedProps = Props & DefaultProps
type BtnClickEv = React.MouseEvent<HTMLButtonElement>
type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
type InputFieldProps = ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
type OnNumberPickerChange = (
    value: number,
    e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
    isButtonClick?: boolean
) => void


const componentID = '-ui-number_picker'

function getRegExp(min: MergedProps['min'], max: MergedProps['max'], precision: MergedProps['precision']): RegExp {
    const minLimit = Math.min(min, max)
    let regexpTemplate = '^'

    minLimit < 0 && (regexpTemplate += '-?')
    regexpTemplate += '\\d*\\.?\\d'

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

function getStepper(props: MergedProps, numberValue: number, onNumberPickerChange: OnNumberPickerChange) {
    const { theme, disabled, step, plusIcon, minusIcon, min, max } = props;

    const plusProps: BtnProps = {
        className: theme.button_plus,
        children: plusIcon
    }
    if (disabled || (max && numberValue >= max)) {
        plusProps.disabled = true
    } else {
        plusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(numberValue + step!, e, true)
        }
    }
    
    const minusProps: BtnProps = {
        className: theme.button_minus,
        children: minusIcon
    }
    if (disabled || (min && numberValue <= min)) {
        minusProps.disabled = true
    } else {
        minusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(numberValue - step!, e, true)
        }
    }


    return (
        <div className={theme.controls}>
            <button {...minusProps} />
            <button {...plusProps} />
        </div>
    )
}

function getInputField(inputFieldProps: InputFieldProps, theme: MergedProps['theme'], label: MergedProps['label']) {
    let inputElement = <input {...inputFieldProps} />
    label && (inputElement = (
        <label className={theme.label_wrapper}>
            <div className={theme.label} children={label} />

            { inputElement }
        </label>
    ))


    return inputElement
}

const NumberPicker: _NumberPicker = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props)
        :   (props as _NumberPicker['defaults'] & typeof props)
    
    const {
        theme, value, disabled, onChange, step, label, payload, disableInput, attributes, inputAttributes,
        placeholder, precision, regexp, min, max
    } = mergedProps;

    const [ focused, setFocused ] = useState(false)


    let className = mergedProps.className;
    focused && (className += ` ${theme._focused}`)

    const numberMask = regexp || getRegExp(min, max, precision)
    const numberValue = getNumberValue(value, min, max)


    const numberpickerRootProps: ComponentAttributes = { className }

    const inputFieldProps: InputFieldProps = {
        value,
        className: theme.field,
        disabled: disableInput || disabled,
    }
    placeholder && (inputFieldProps.placeholder = placeholder)

    if (disabled) {
        numberpickerRootProps.className += ` ${theme._disabled}`
    } else {
        numberpickerRootProps.onFocus = () => { focused || setFocused(true) }
        numberpickerRootProps.onBlur = () => { focused && setFocused(false) }

        inputFieldProps.onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            e.persist()
            onNumberPickerChange(numberValue, e)
        }
        inputFieldProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            numberMask.test(value) && onChange(value, e, payload)
        }
    }

    attributes && (Object.assign(numberpickerRootProps, attributes))
    inputAttributes && (Object.assign(inputFieldProps, inputAttributes))


    const onNumberPickerChange: OnNumberPickerChange = (value, e, isButtonClick) => {
        value < min && (value = min)
        value > max && (value = max)

        let result = value;

        if (isButtonClick && (step! % 1 > 0)) {
            let _precision = precision;
            if (!_precision) {
                const stringStep = ''+step;
                _precision = stringStep.length - stringStep.lastIndexOf('.') - 1
            }

            result = parseFloat(value.toFixed(_precision))
        }

        onChange(''+result, e, payload)
    }


    return (
        <div {...numberpickerRootProps}>
            { isExists(step) && getStepper(mergedProps, numberValue, onNumberPickerChange) }
            { getInputField(inputFieldProps, theme, label) }
        </div>
    )
}
NumberPicker.defaults = {
    theme: {
        root: componentID,
        controls: componentID + '_controls',
        button_minus: componentID + '_minus',
        button_plus: componentID + '_plus',
        label_wrapper: componentID + '_label_wrapper',
        label: componentID + '_label',
        field: componentID + '_field',
        _disabled: componentID + '__disabled',
        _focused: componentID + '__focused'
    },

    minusIcon: '-',
    plusIcon: '+',
    min: -Infinity,
    max: Infinity
}
NumberPicker.ID = componentID;


export { componentID }
export default NumberPicker