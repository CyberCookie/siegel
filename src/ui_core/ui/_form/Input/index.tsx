//TODO: masks

import React from 'react'

import { extractProps } from '../../ui_utils'
import addInputFieldAttributes from '../input_field_attributes'
import getInputLabeled from '../label'
import componentID from './id'
import type { _Input } from './types'


//[email, password, search, tel, text, url, (textarea)]
const Input: _Input = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Input.defaults, props)
        :   (props as _Input['defaults'] & typeof props)
    
    const { theme, label, value, errorMsg, type, disabled, onBlur,
        onChange, onFocus, payload } = mergedProps;
    

    let className = mergedProps.className;
    errorMsg && (className += ` ${theme._error}`)
    value && (className += ` ${theme._filled}`)
    
    const inputRootProps: typeof props.inputAttributes = { className }
    const inputProps: NonNullable<typeof props.inputAttributes> = {
        disabled, value,
        className: theme.field
    }
    if (!disabled) {
        onFocus && (inputProps.onFocus = onFocus)
        onBlur && (inputProps.onBlur = onBlur)
        if (onChange) {
            inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e, payload)
        } else {
            inputProps.readOnly = true
        }
    }
    
    
    let InputTag = 'input'
    if (type) {
        if (type == 'textarea') {
            InputTag = type
            inputRootProps.className += ` ${theme.textarea}`
        } else {
            inputProps.type = type
        }
    }
    
    addInputFieldAttributes(inputProps, inputRootProps, mergedProps)

    let inputElement = <InputTag {...inputProps} />
    label && (inputElement = getInputLabeled(
        inputElement,
        { className: theme.label },
        { className: theme.label_text, children: label }
    ))


    return (
        <div {...inputRootProps}>
            { inputElement }

            { inputRootProps.children && (
                <div className={theme.extra} children={inputRootProps.children} />
            )}
            
            { errorMsg && <div className={theme.error_text} children={errorMsg} /> }
        </div>
    )
}
Input.defaults = {
    theme: {
        root: componentID,
        field: componentID + '_field',
        textarea: componentID + '_textarea',
        extra: componentID + '_extra',
        error_text: componentID + '_error_text',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        _error: componentID + '__error',
        _filled: componentID + '__filled',
        _focused: componentID + '__focused',
        _touched: componentID + '__touched',
        _disabled: componentID + '__disabled'
    }
}
Input.ID = componentID;


export { componentID }
export default Input