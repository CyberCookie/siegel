import React, { useRef, useEffect, useState } from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import getInputLabeled from '../label'
import componentID from './id'
import type { _Input, Props/*, InputFieldThemeKeys*/ } from './types'


const getDefaultInputStoreState = () => ({
    isTouched: false,
    isFocused: false
})


//TODO:
// const inputFieldThemeKeys: InputFieldThemeKeys[] = [
//     'field', 'label', 'label_text', 'error_text',
//     '_error', '_filled', '_focused', '_touched', '_disabled'
// ]
// const updateThemeWithInputFieldTheme = (theme: Indexable<string>, componentID: ID) => {
//     inputFieldThemeKeys.forEach(key => {
//         theme[key] = componentID + '_' + key
//     })
// }

//[email, password, search, tel, text, url, (textarea)]
const Input: _Input = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Input.defaults, props, false)
        :   (props as _Input['defaults'] & Props)
    
    const {
        theme, label, value, errorMsg, type, disabled, onBlur, attributes, inputAttributes,
        onChange, onFocus, payload, inputStore, autofocus, placeholder, regexp, mask, refApi
    } = mergedProps;
    
    const store = inputStore || useState(getDefaultInputStoreState())
    const [ state, setState ] = store;
    const { isFocused, isTouched } = state;
    

    const inputProps: NonNullable<Props['inputAttributes']> = {
        disabled, value, placeholder,
        className: theme.field
    }
    if (autofocus || mask) {
        inputProps.ref = useRef<HTMLInputElement>(null)
        
        autofocus && useEffect(() => {
            disabled || ((inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus())
        }, [ disabled ])
    }
    
    
    let className = mergedProps.className;
    errorMsg && (className += ` ${theme._error}`)
    value && (className += ` ${theme._filled}`)
    isFocused && (className += ` ${theme._focused}`)
    isTouched && (className += ` ${theme._touched}`)
    
    const inputRootProps: Props['attributes'] = {
        className,
        onBlur(e) {
            if (!isTouched || isFocused) {
                state.isTouched ||= true;
                state.isFocused &&= false;
    
                onBlur && onBlur(e)
                setState({ ...state })
            }
        }
    }

    

    if (disabled) inputRootProps.className += ` ${theme._disabled}`
    else {
        inputRootProps.onFocus = e => {
            if (!isFocused) {
                state.isFocused = true;
                
                onFocus && onFocus(e)
                setState({ ...state })
            }
        }

        if (onChange) {
            inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = (e.target as HTMLInputElement).value;
                (!regexp || regexp.test(value)) && onChange(value, e, payload)
            }
        } else inputProps.readOnly = true
    }
    
    
    let InputTag = 'input'
    if (type) {
        if (type == 'textarea') {
            InputTag = type
            inputRootProps.className += ` ${theme.textarea}`
        } else inputProps.type = type
    }
    
    refApi && (applyRefApi(inputRootProps, mergedProps))
    attributes && Object.assign(inputRootProps, attributes)
    inputAttributes && Object.assign(inputProps, inputAttributes)

    mask && mask.processor(mask, inputProps)

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


export { componentID, getDefaultInputStoreState }
export default Input