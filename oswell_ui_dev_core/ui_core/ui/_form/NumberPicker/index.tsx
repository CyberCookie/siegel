import React from 'react'

import { extractProps, ComponentAttributes } from '../../ui_utils'
import isExists from '../../../utils/is_exists'
import { _NumberPicker } from './types'


const componentID = '-ui-number-picker'

const getIntSize = (value: number) => (Math.abs(parseInt(value)) + '').length;

function getRegExp(min?: number, max?: number, precision?: number): string {
    const minLimit = Math.min((min as number), (max as number))
    let regexpTemplate = '^'

    minLimit < 0 && (regexpTemplate += '-?')
    regexpTemplate += '\\d'

    const floatRegExp = '\\.?\\d'
    
    const isFiniteMin = isFinite(min)
    const isFiniteMax = isFinite(max)
    if (isFiniteMax || isFiniteMin) {
        const sizeMin = isFiniteMin ? getIntSize(min!) : 0;
        const sizeMax = isFiniteMax ? getIntSize(max!) : 0;
        regexpTemplate += `{0,${Math.max(sizeMin, sizeMax)}}`
    } else {
        regexpTemplate += '*'
    }

    if (precision === undefined) {
        regexpTemplate += `${floatRegExp}*`
    } else if (precision != 0) {
        regexpTemplate += `${floatRegExp}{0,${precision}}`
    }

    regexpTemplate += '$'


    return regexpTemplate
}

const NumberPicker: _NumberPicker = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _NumberPicker['defaults'] & typeof props)
        :   extractProps(NumberPicker.defaults, props)
    
    const {
        theme, value, disabled, onChange, step, minusIcon, plusIcon, label, payload,
        disableInput, attributes, inputAttributes, placeholder, precision, regexp
    } = mergedProps;
    let { min, max } = mergedProps;

    let className = mergedProps.className;
    disabled && (className += ` ${theme.number_picker__disabled}`)

    isExists(min) || (min = -Infinity)
    isExists(max) || (max = Infinity)

    const numberpickerRootProps = { className }
    attributes && (Object.assign({}, attributes, numberpickerRootProps))


    const numberValue = parseFloat(value as string) || 0;
    const regexpString = regexp || getRegExp(min, max, precision)
    const numberMask = new RegExp(regexpString)

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        e.persist()
        onNumberPickerChange(parseFloat(e.target.value) || 0, e)
    }

    function onNumberPickerChange(value: number, e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>, isButtonClick?: boolean) {
        if (!disabled || isButtonClick) {
            value < min! && (value = (min as number))
            value > max! && (value = (max as number))

            onChange(value, e, payload)
        }
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!disabled) {
            const value = e.target.value;
            numberMask.test(value) && onChange(value, e, payload)
        }
    }
    
    const inputFieldAttributes: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>> = {
        value, onBlur,
        onChange: onInputChange,
        className: theme.field,
        disabled: disableInput || disabled,
    }
    placeholder && (inputFieldAttributes.placeholder = placeholder)
    inputAttributes && (Object.assign(inputFieldAttributes, inputAttributes))

    let inputElement = <input {...inputFieldAttributes} />
    label && (inputElement = (
        <label className={theme.label_wrapper}>
            <span className={theme.label} children={label} />

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
        number_picker__disabled: componentID + '__disabled',
        controls: componentID + '_controls',
        button_minus: componentID + '_minus',
        button_plus: componentID + '_plus',
        label_wrapper: componentID + '_label_wrapper',
        label: componentID + '_label',
        field: componentID + '_field'
    },

    minusIcon: '-',
    plusIcon: '+'
}
NumberPicker.ID = componentID;


export * from './types'
export { componentID }
export default NumberPicker