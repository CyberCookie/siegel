//TODO: masks
import React, { useRef, useEffect, useState } from 'react'

import { extractProps } from '../../ui_utils'
import { _Input } from './types'


const componentID = '-ui-input'

//[email, password, search, tel, text, url, (textarea)]
const Input: _Input = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Input.defaults, props)
        :   (props as _Input['defaults'] & typeof props)
    
    const { theme, attributes, inputAttr, label, placeholder, value, errorMsg,
        type, disabled, autofocus, onBlur, onChange, onFocus, payload } = mergedProps;
    
    const [ state, setState ] = useState({
        touched: false,
        focused: false
    })
    const { touched, focused } = state;

    let className = mergedProps.className;
    touched && (className += ` ${theme._touched}`)
    errorMsg && (className += ` ${theme._error}`)
    value && (className += ` ${theme._filled}`)
    focused && (className += ` ${theme._focused}`)
    
    let inputRootProps: typeof inputAttr = { className }

    let inputProps: NonNullable<typeof inputAttr> = {
        className: theme.field,
        placeholder, disabled, value
    }


    if (disabled) {
        inputRootProps.className += ` ${theme._disabled}`
    } else {
        inputRootProps.onFocus = () => {
            if (!focused) {
                state.focused = true;
                setState({ ...state })
            }
        }

        inputRootProps.onBlur = () => {
            if (!touched || focused) {
                touched || (state.touched = true)
                focused && (state.focused = false)
        
                setState({ ...state })
            }
        }

        onFocus && (inputProps.onFocus = onFocus)
        onBlur && (inputProps.onBlur = onBlur)
        if (onChange) {
            inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e, payload)
        } else {
            inputProps.readOnly = true
        }
    }

    
    if (autofocus) {
        inputProps.ref = useRef<HTMLInputElement>(null)
        
        useEffect(() => {
            disabled || (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()
        }, [])
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
    
    inputAttr && (inputProps = Object.assign(inputProps, inputAttr))

    let inputElement = <InputTag {...inputProps} />
    if (label) {
        inputElement = (
            <label className={theme.label}>
                <div className={theme.label_text} children={label} />

                { inputElement }
            </label>
        )
    }

    attributes && (inputRootProps = Object.assign(inputRootProps, attributes))


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
        _focused: componentID + '__focused',
        _filled: componentID + '__filled',
        _touched: componentID + '__touched',
        _disabled: componentID + '__disabled'
    }
}
Input.ID = componentID;


export { componentID }
export default Input