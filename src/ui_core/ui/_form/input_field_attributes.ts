//TODO: value through inputProps
//TODO: extend external store
import { useEffect, useRef, useState } from 'react'

import { ComponentAttributes } from '../ui_utils'


type InputTagProps = {
    theme: {
        _disabled: string
        _focused: string
        _touched: string
    }
    value?: string
    disabled?: boolean
    autofocus?: boolean
    placeholder?: string
    attributes?: ComponentAttributes
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
}

type InputState = {
    isTouched: boolean
    isFocused: boolean
}

type AddInputFieldAttributes = (
    inputProps: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>,
    rootProps: ComponentAttributes,
    props: InputTagProps,
    onBlur?: (state: InputState, e: React.FocusEvent<HTMLInputElement>) => void
) => [ InputState, React.Dispatch<React.SetStateAction<InputState>> ]


const addInputFieldAttributes: AddInputFieldAttributes = (inputProps, rootProps, props, onBlur) => {
    const { disabled, autofocus, theme, placeholder, attributes, inputAttributes } = props;

    const store = useState({
        isTouched: false,
        isFocused: false
    })
    const [ state, setState ] = store;
    const { isFocused, isTouched } = state;

    inputProps.ref = useRef<HTMLInputElement>(null)


    isFocused && (rootProps.className += ` ${theme._focused}`)
    isTouched && (rootProps.className += ` ${theme._touched}`)
    if (inputProps.disabled) {
        rootProps.className += ` ${theme._disabled}`
    }
    disabled || (rootProps.onFocus = () => {
        if (!isFocused) {
            state.isFocused = true;

            setState({ ...state })
        }
    })


    rootProps.onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!isTouched || isFocused) {
            state.isTouched ||= true;
            state.isFocused &&= false;
            
            onBlur && onBlur(state, e)
            setState({ ...state })
        }
    }

    placeholder && (inputProps.placeholder = placeholder)


    if (autofocus) {
        useEffect(() => {
            disabled || ((inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus())
        }, [ disabled ])
    }

    attributes && Object.assign(rootProps, attributes)
    inputAttributes && Object.assign(inputProps, inputAttributes)


    return store
}


export type { InputTagProps }
export default addInputFieldAttributes