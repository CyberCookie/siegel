//TODO? value through inputProps
import { useEffect, useRef, useState } from 'react'

import { ComponentAttributes } from '../ui_utils'


type InputTagProps = {
    theme: {
        field: string
        label: string
        label_text: string
        _disabled: string
        _focused: string
        _touched: string
    }
    value?: string
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    attributes?: ComponentAttributes
    inputStore?: InputStore
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
}

type InputState = {
    isTouched: boolean
    isFocused: boolean
}
type InputStore = [ InputState, React.Dispatch<React.SetStateAction<InputState>> ]

type AddInputFieldAttributes = (
    params: {
        inputProps: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
        rootAttr: ComponentAttributes
        componentProps: InputTagProps
    }
) => InputStore


const getDefaultInputStoreState = () => ({
    isTouched: false,
    isFocused: false
})

const addInputFieldAttributes: AddInputFieldAttributes = params => {
    const { inputProps, rootAttr, componentProps } = params;
    const { disabled, autofocus, theme, placeholder, attributes, inputAttributes, inputStore } = componentProps;

    const store = inputStore || useState(getDefaultInputStoreState())
    const [ state, setState ] = store;
    const { isFocused, isTouched } = state;

    
    isFocused && (rootAttr.className += ` ${theme._focused}`)
    isTouched && (rootAttr.className += ` ${theme._touched}`)
    
    disabled && (inputProps.disabled = disabled)
    if (inputProps.disabled) {
        rootAttr.className += ` ${theme._disabled}`
    } else {
        rootAttr.onFocus = () => {
            if (!isFocused) {
                state.isFocused = true;
                setState({ ...state })
            }
        }
    }
    
    
    rootAttr.onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!isTouched || isFocused) {
            state.isTouched ||= true;
            state.isFocused &&= false;

            inputProps.onBlur && inputProps.onBlur(e)
            setState({ ...state })
        }
    }
    
    placeholder && (inputProps.placeholder = placeholder)
    
    
    if (autofocus) {
        inputProps.ref = useRef<HTMLInputElement>(null)

        useEffect(() => {
            disabled || ((inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus())
        }, [ disabled ])
    }

    attributes && Object.assign(rootAttr, attributes)
    inputAttributes && Object.assign(inputProps, inputAttributes)


    return store
}


export { getDefaultInputStoreState }
export default addInputFieldAttributes
export type { InputTagProps }