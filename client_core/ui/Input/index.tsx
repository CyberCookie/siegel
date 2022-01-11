//TODO: add formatter mode

import React, { useRef, useEffect, useState } from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import componentID from './id'
import type { PropsComponentThemed } from '../_internals/types'
import type {
    Component, MergedProps, InputFieldThemeKeysArray, InputElementAttributes,
    Props
} from './types'


const getDefaultInputStoreState = () => ({
    isTouched: false,
    isFocused: false
})

const inputFieldThemeKeys: InputFieldThemeKeysArray = [
    'label', 'label_text', 'field', 'error_text',
    '_filled', '_error', '_disabled', '_focused', '_touched', '_readonly'
]
const updateThemeWithInputFieldTheme =<T extends PropsComponentThemed['theme']>(theme: T) => {
    inputFieldThemeKeys.forEach(key => {
        (theme as Indexable)[key] = ''
    })

    return theme as T & Record<InputFieldThemeKeysArray[number], string>
}

//[email, password, search, tel, text, url, (textarea)]
const Input: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Input.defaults, props, false)
        :   (props as MergedProps)

    const {
        value = '',
        theme, label, errorMsg, type, disabled, onBlur, attributes, inputAttributes,
        onChange, onFocus, payload, innerStore, autofocus, placeholder, regexp, mask, refApi
    } = mergedProps

    const store = innerStore || useState(getDefaultInputStoreState())
    const [ state, setState ] = store
    const { isFocused, isTouched } = state


    const inputProps: InputElementAttributes = {
        disabled, value, placeholder,
        className: theme.field
    }
    if (autofocus || mask) {
        inputProps.ref = useRef<HTMLInputElement>(null)

        autofocus && useEffect(() => {
            disabled || (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()
        }, [ disabled ])
    }


    let className = mergedProps.className
    errorMsg && (className += ` ${theme._error}`)
    ;(value || mask?.pattern) && (className += ` ${theme._filled}`)
    isFocused && (className += ` ${theme._focused}`)
    isTouched && (className += ` ${theme._touched}`)

    const inputRootProps: Props['attributes'] = {
        className,
        onBlur(e) {
            if (!isTouched || isFocused) {
                state.isTouched ||= true
                state.isFocused &&= false

                onBlur && onBlur(e)
                setState({ ...state })
            }
        }
    }


    if (disabled) inputRootProps.className += ` ${theme._disabled}`
    else if (onChange) {
        inputRootProps.onFocus = e => {
            if (!isFocused) {
                state.isFocused = true

                onFocus && onFocus(e)
                setState({ ...state })
            }
        }

        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = (e.target as HTMLInputElement).value
            ;(!regexp || regexp.test(value)) && onChange(value, e, payload)
        }
    } else {
        inputRootProps.className += ` ${theme._readonly}`
        inputProps.readOnly = true
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

    mask && mask.processor(mask, inputProps as Parameters<typeof mask['processor']>[1])

    let inputElement = <InputTag { ...inputProps } />
    label && (inputElement = getInputLabeled(
        inputElement,
        { className: theme.label },
        { className: theme.label_text, children: label }
    ))


    return (
        <div { ...inputRootProps }>
            { inputElement }

            { addChildren(inputRootProps, theme) }

            { errorMsg && <div className={ theme.error_text } children={ errorMsg } /> }
        </div>
    )
}
Input.defaults = {
    theme: updateThemeWithInputFieldTheme({
        root: '',
        children: '',
        textarea: ''
    })
}
Input.ID = componentID


export { componentID, getDefaultInputStoreState, updateThemeWithInputFieldTheme }
export default Input
export type { Props }