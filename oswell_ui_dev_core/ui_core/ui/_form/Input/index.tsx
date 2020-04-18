import React, { useRef, useEffect } from 'react'

import { extractProps } from '../../ui_utils'
import { ComponentRootAttributes, _Input } from './types'


const componentID = '-ui-input'

//[email, password, search, tel, text, url, (textarea)]
const Input: _Input = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Input['defaults'] & typeof props)
        :   extractProps(Input.defaults, props)
    
    const { theme, attributes, inputAttr, label, placeholder, value, errorMsg,
        type, disabled, autofocus, onBlur, onChange, onFocus, payload } = mergedProps;
    
    let className = mergedProps.className;
    

    let inputRootAttributes: ComponentRootAttributes = {
        className,
        error: errorMsg ? '' : null,
        filled: value ? '' : null
    }
    attributes && (inputRootAttributes = Object.assign(inputRootAttributes, attributes))

    let inputFieldAttributes: NonNullable<typeof inputAttr> = {
        className: theme.field,
        placeholder, onFocus, onBlur, disabled
    }
    
    if (onChange) {
        inputFieldAttributes.onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e, payload)
        inputFieldAttributes.value = value
    } else {
        inputFieldAttributes.defaultValue = value
    }
    

    if (autofocus) {
        inputFieldAttributes.ref = useRef<HTMLInputElement>(null)

        useEffect(() => {
            (inputFieldAttributes.ref as React.MutableRefObject<HTMLInputElement>).current.focus()
        }, [])
    }

    let InputTag = 'input'
    if (type) {
        if (type == 'textarea') {
            InputTag = type
            className += ` ${theme.textarea}`
        } else {
            inputFieldAttributes.type = type
        }
    }

    inputAttr && (inputFieldAttributes = Object.assign(inputFieldAttributes, inputAttr))
    let inputElement = <InputTag {...inputFieldAttributes} />
    
    if (label) {
        inputElement = (
            <label className={theme.label}>
                <span className={theme.label_text} children={label} />

                { inputElement }
            </label>
        )
    }
    

    return (
        <div {...inputRootAttributes}
            onFocus={e => e.currentTarget.classList.add(theme.focus)}
            onBlur={e => e.currentTarget.classList.remove(theme.focus)}>

            { inputElement }

            { inputRootAttributes.children && (
                <span className={theme.extra} children={inputRootAttributes.children} />
            )}
            
            { errorMsg && <span className={theme.error_text} children={errorMsg} /> }
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
        focus: componentID + '__focus'
    }
}
Input.ID = componentID;


export * from './types'
export { componentID }
export default Input