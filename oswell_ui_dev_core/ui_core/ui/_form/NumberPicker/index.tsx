//TODO: masks
//TODO: add precision to onBlur and input value
//TODO: truncate zeroes left
//TODO: autofocus
import React from 'react'

import isExists from '../../../utils/is_exists'
import { extractProps, ComponentAttributes } from '../../ui_utils'
import addInputFieldAttributes from '../autofocus'
import getLabel from '../label'
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
    const { theme, disabled: disabled, step, plusIcon, minusIcon, min, max } = props;

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


const NumberPicker: _NumberPicker = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NumberPicker.defaults, props)
        :   (props as _NumberPicker['defaults'] & typeof props)
    
    const {
        theme, value, disabled, onChange, step, label, payload, disabledInput,
        precision, regexp, min, max, className
    } = mergedProps;


    const numberMask = regexp || getRegExp(min, max, precision)
    const numberValue = getNumberValue(value, min, max)

    const numberpickerRootProps: ComponentAttributes = { className }
    const inputFieldProps: InputFieldProps = {
        className: theme.field,
        disabled: disabled || disabledInput,
    }
    if (disabled) {
        numberpickerRootProps.className += ` ${theme._disabled_all}`
    } else {
        inputFieldProps.onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            e.persist()
            onNumberPickerChange(numberValue, e)
        }
        inputFieldProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            numberMask.test(value) && onChange(value, e, payload)
        }
    }
    addInputFieldAttributes(inputFieldProps, numberpickerRootProps, mergedProps)


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

    let inputElement = <input {...inputFieldProps} />
    label && (inputElement = getLabel(
        inputElement,
        { className: theme.label_wrapper },
        { className: theme.label, children: label }
    ));


    return (
        <div {...numberpickerRootProps}>
            { isExists(step) && getStepper(mergedProps, numberValue, onNumberPickerChange) }

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
        _disabled_all: componentID + '__disabled_all',
        _disabled: componentID + '__disabled',
        _focused: componentID + '__focused',
        _touched: componentID + '__touched'
    },

    minusIcon: '-',
    plusIcon: '+',
    min: -Infinity,
    max: Infinity
}
NumberPicker.ID = componentID;


export { componentID }
export default NumberPicker