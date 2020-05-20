import React, { useState } from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import isExists from '../../../utils/is_exists'
import { _NumberPicker } from './types'


const componentID = '-ui-number_picker'

function getRegExp(min?: number, max?: number, precision?: number): RegExp {
    const minLimit = Math.min((min as number), (max as number))
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

function getNumberValue(value: string | number, min?: number, max?: number) {
    const numberFloat = parseFloat(value as string)

    return isNaN(numberFloat)
        ?   isFinite(min)
                ?   min!
                :   isFinite(max)
                        ?   max!
                        :   0

        :   numberFloat
}

const NumberPicker: _NumberPicker = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props)
        :   (props as _NumberPicker['defaults'] & typeof props)
    
    const {
        theme, value, disabled, onChange, step, minusIcon, plusIcon, label, payload,
        disableInput, attributes, inputAttributes, placeholder, precision, regexp
    } = mergedProps;

    const [ focused, setFocused ] = useState(false)


    let { min, max, className } = mergedProps;

    disabled && (className += ` ${theme._disabled}`)
    focused && (className += ` ${theme._focused}`)

    isExists(min) || (min = -Infinity)
    isExists(max) || (max = Infinity)

    const numberpickerRootProps = {
        className,
        onFocus() { focused || setFocused(true) },
        onBlur() { focused && setFocused(false) }
    }
    attributes && (Object.assign({}, attributes, numberpickerRootProps))


    const numberMask = regexp || getRegExp(min, max, precision)
    const numberValue = getNumberValue(value, min, max)


    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        e.persist()
        onNumberPickerChange(numberValue, e)
    }

    function onNumberPickerChange(value: number, e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>, isButtonClick?: boolean) {
        if (!disabled || isButtonClick) {
            value < min! && (value = (min as number))
            value > max! && (value = (max as number))

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
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!disabled) {
            const value = e.target.value;
            numberMask.test(value) && onChange(value, e, payload)
        }
    }

    const inputFieldAttributes: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>> = {
        onBlur, value,
        onChange: onInputChange,
        className: theme.field,
        disabled: disableInput || disabled,
    }
    placeholder && (inputFieldAttributes.placeholder = placeholder)
    inputAttributes && (Object.assign(inputFieldAttributes, inputAttributes))

    let inputElement = <input {...inputFieldAttributes} />
    label && (inputElement = (
        <label className={theme.label_wrapper}>
            <div className={theme.label} children={label} />

            { inputElement }
        </label>
    ))

    
    return (
        <div {...numberpickerRootProps}>
            { isExists(step) && (
                <div className={theme.controls}>
                    <button className={theme.button_minus} children={minusIcon}
                        disabled={((disabled || (min && numberValue <= min)) as boolean )}
                        onMouseDown={e => onNumberPickerChange(numberValue - step, e, true)} />

                    <button className={theme.button_plus} children={plusIcon}
                        disabled={((disabled || (max && numberValue >= max)) as boolean )}
                        onMouseDown={e => onNumberPickerChange(numberValue + step, e, true)} />
                </div>
            )}

            { inputElement }
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
    plusIcon: '+'
}
NumberPicker.ID = componentID;


export { componentID }
export default NumberPicker