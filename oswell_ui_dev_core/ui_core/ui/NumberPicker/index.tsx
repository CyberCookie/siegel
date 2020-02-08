import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'

const componentID = '-ui-number-picker'

const defaults = {
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

const setDefaults = (customDefaults: DefaultProps) => {
    setDefaultProps(defaults, customDefaults)
}

const validSymbolSeqRegExp = /^\-?(\d*\.?)?\d*$/;

const NumberPicker = (props: Props) => {
    let {
        theme, className, value, disabled, onChange, step, min, max, minusIcon, plusIcon, label, payload
    } = extractProps(defaults, props);

    className += ` ${theme.number_picker}`;
    disabled && (className += ` ${theme.number_picker__disabled}`)

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
    
    let inputElement = (
        <input className={theme.field} disabled={disabled} value={value}
            onChange={onInputChange} 
            onBlur={onBlur} />
    )
    label && (inputElement = (
        <label className={theme.label_wrapper}>
            <span className={theme.label} children={label} />

            { inputElement }
        </label>
    ))

    return (
        <div className={className}>
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


export { setDefaults }
export default NumberPicker