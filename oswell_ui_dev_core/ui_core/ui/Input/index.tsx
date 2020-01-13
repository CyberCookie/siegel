import React, { useRef, useEffect } from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps, DefaultWrapperAttributes, ComponentInputAttributes } from './types'


const componentID = '-ui-input'

const defaults: DefaultProps = {
    theme: {
        input: componentID,
        field: componentID + '_field',
        textarea: componentID + '_textarea',
        extra: componentID + '_extra',
        error_text: componentID + '_error_text',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        focus: componentID + '__focus'
    },

    wrapperAttr: {}
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

//[email, password, search, tel, text, url, (textarea)]
const Input = (props: Props) => {
    let { theme, className = '', wrapperAttr, inputAttr, label, placeholder, value, errorMsg,
        type, disabled, autofocus, onBlur, onChange, onFocus } = extractProps(defaults, props)

    className += ` ${theme.input}`;
    wrapperAttr.className = className;
    (wrapperAttr as DefaultWrapperAttributes).error = errorMsg ? '' : null;
    (wrapperAttr as DefaultWrapperAttributes).filled = value ? '' : null;
    
    let _inputAttr: ComponentInputAttributes = Object.assign({}, inputAttr, {
        className: theme.field,
        placeholder, onFocus, onBlur, disabled
    })
    
    if (onChange) {
        _inputAttr.onChange = e => onChange!(e.target.value, e)
        _inputAttr.value = value
    } else {
        _inputAttr.defaultValue = value
    }
    

    if (autofocus) {
        _inputAttr.ref = useRef<HTMLInputElement>(null)

        useEffect(() => {
            (_inputAttr.ref as React.MutableRefObject<HTMLInputElement>).current.focus()
        }, [])
    }

    let InputTag = 'input'
    if (type) {
        if (type == 'textarea') {
            InputTag = type
            className += ` ${theme.textarea}`
        } else {
            _inputAttr.type = type
        }
    }
    
    let inputElement = <InputTag {..._inputAttr} />;
    
    label && (inputElement = (
        <label className={theme.label}>
            <span className={theme.label_text} children={label} />

            { inputElement }
        </label>
    ))
    

    return (
        <div {...wrapperAttr}
            onFocus={e => e.currentTarget.classList.add(theme.focus)}
            onBlur={e => e.currentTarget.classList.remove(theme.focus)}>

            { inputElement }

            { wrapperAttr.children && (
                <span className={theme.extra} children={wrapperAttr.children} />
            )}
            
            { errorMsg && <span className={theme.error_text} children={errorMsg} /> }
        </div>
    )
}
Input.id = componentID


export { setDefaults }
export default Input