//TODO: add formatter mode

import React, { useRef, useEffect, useState } from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import componentID from './id'
import type {
    Component, MergedProps, InnerInputAttributes,
    Props
} from './types'


type InputRef = React.MutableRefObject<HTMLInputElement>


const getDefaultState = () => ({
    isTouched: false,
    isFocused: false
})

//[email, password, search, tel, text, url, (textarea)]
const Input: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Input.defaults, props, false)
        :   (props as MergedProps)

    const {
        value = '',
        theme, label, errorMsg, type, disabled, onBlur, rootTagAttributes, inputAttributes,
        onChange, onFocus, payload, store, autofocus, placeholder, regexp, mask, refApi, children
    } = mergedProps

    const innerStore = store || useState(getDefaultState())
    const [ state, setState ] = innerStore
    const { isFocused, isTouched } = state


    let inputProps: InnerInputAttributes = {
        disabled, value, placeholder,
        className: theme.field
    }
    if (autofocus || mask) {
        inputProps.ref = useRef() as InputRef

        autofocus && useEffect(() => {
            disabled || (inputProps.ref as InputRef).current.focus()
        }, [ disabled ])
    }


    let className = mergedProps.className
    errorMsg && (className += ` ${theme._error}`)
    ;(value || mask?.pattern) && (className += ` ${theme._filled}`)
    isFocused && (className += ` ${theme._focused}`)
    isTouched && (className += ` ${theme._touched}`)

    let inputRootProps: Props['rootTagAttributes'] = {
        className,
        onBlur(e) {
            if (!isTouched || isFocused) {
                state.isTouched ||= true
                state.isFocused &&= false

                onBlur?.(e)
                setState({ ...state })
            }
        }
    }


    if (disabled) inputRootProps.className += ` ${theme._disabled}`
    else if (onChange) {
        inputRootProps.onFocus = e => {
            if (!isFocused) {
                state.isFocused = true

                onFocus?.(e)
                setState({ ...state })
            }
        }

        inputProps.onChange = e => {
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
    rootTagAttributes && (inputRootProps = mergeTagAttributes(inputRootProps, rootTagAttributes))

    inputAttributes && (inputProps = mergeTagAttributes(inputProps, inputAttributes))

    mask?.processor(mask, inputProps as Parameters<typeof mask['processor']>[1])

    let inputElement = <InputTag { ...inputProps } />
    label && (inputElement = getInputLabeled(
        inputElement,
        { className: theme.label },
        { className: theme.label_text, children: label }
    ))


    return (
        <div { ...inputRootProps }>
            { inputElement }

            { children && addChildren(children, theme) }

            { errorMsg && <div className={ theme.error_text } children={ errorMsg } /> }
        </div>
    )
}
Input.defaults = {
    theme: {
        root: '',
        _filled: '',
        _error: '',
        _disabled: '',
        _focused: '',
        _touched: '',
        _readonly: '',
        children: '',
        textarea: '',
        label: '',
        label_text: '',
        field: '',
        error_text: ''
    }
}
Input.ID = componentID


export default Input
export { componentID, getDefaultState }
export * from './types'