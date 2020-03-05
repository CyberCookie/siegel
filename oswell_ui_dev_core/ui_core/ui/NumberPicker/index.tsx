import React from 'react'

import { extractProps } from '../ui_utils'
import { _NumberPicker } from './types'


const componentID = '-ui-number-picker'

const validSymbolSeqRegExp = /^\-?(\d*\.?)?\d*$/;

const NumberPicker: _NumberPicker = (props, withDefaults) => {
    let {
        theme, className, value, disabled, onChange, step, min, max, minusIcon, plusIcon, label, payload,
        disableInput, attributes, inputAttributes
    } = withDefaults
        ?   (props as _NumberPicker['defaults'] & typeof props)
        :   extractProps(NumberPicker.defaults, props)

    className += ` ${theme.number_picker}`
    disabled && (className += ` ${theme.number_picker__disabled}`)

    let numberpickerRootProps = { className }
    attributes && (Object.assign({}, attributes, numberpickerRootProps))


    let numberValue = parseFloat(value as string) || 0;

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        e.persist()
        onNumberPickerChange(parseFloat(e.target.value) || 0, e)
    }

    function onNumberPickerChange(value: number, e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) {
        disabled || onChange(value, e, payload)
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!disabled) {
            let value = e.target.value;
            let numberValue = +value;

            if (value === ''
                || (isNaN(numberValue) && validSymbolSeqRegExp.test(value))
                || (numberValue >= min && numberValue <= max)
            ) {
                onChange(value, e, payload)
            }
        }
    }
    
    let inputFieldAttributes = {
        value, onBlur,
        onChange: onInputChange,
        className: theme.field,
        disabled: disableInput || disabled,
    }
    inputAttributes && (Object.assign({}, inputAttributes, inputFieldAttributes))

    let inputElement = <input {...inputFieldAttributes} />
    label && (inputElement = (
        <label className={theme.label_wrapper}>
            <span className={theme.label} children={label} />

            { inputElement }
        </label>
    ))

    return (
        <div {...numberpickerRootProps}>
            <div className={theme.controls}>
                <button className={theme.button_minus} children={minusIcon}
                    disabled={((disabled || (min && numberValue <= min)) as boolean )}
                    onMouseDown={e => onNumberPickerChange(numberValue - step, e)} />

                <button className={theme.button_plus} children={plusIcon}
                    disabled={((disabled || (max && numberValue >= max)) as boolean )}
                    onMouseDown={e => onNumberPickerChange(numberValue + step, e)} />
            </div>

            { inputElement }
        </div>
    )
}
NumberPicker.defaults = {
    theme: {
        number_picker: componentID,
        number_picker__disabled: componentID + '__disabled',
        controls: componentID + '_controls',
        button_minus: componentID + '_minus',
        button_plus: componentID + '_plus',
        label_wrapper: componentID + '_label_wrapper',
        label: componentID + '_label',
        field: componentID + '_field'
    },

    step: 1,
    min: 0,
    max: Infinity,
    minusIcon: '-',
    plusIcon: '+'
}
NumberPicker.ID = componentID;


export { componentID }
export default NumberPicker