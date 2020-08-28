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

type AddInputFieldAttributes = (
    inputProps: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>,
    rootProps: ComponentAttributes,
    props: InputTagProps
) => {
    isTouched: boolean,
    isFocused: boolean
}


const addInputFieldAttributes: AddInputFieldAttributes = (inputProps, rootProps, props) => {
    const { disabled, autofocus, theme, placeholder, value,
        attributes, inputAttributes } = props;

    const [ state, setState ] = useState({
        isTouched: false,
        isFocused: false
    })
    const { isFocused, isTouched } = state;

    inputProps.ref = useRef<HTMLInputElement>(null)


    if (inputProps.disabled) {
        rootProps.className += ` ${theme._disabled}`
    }
    isFocused && (rootProps.className += ` ${theme._focused}`)
    isTouched && (rootProps.className += ` ${theme._touched}`)


    rootProps.onFocus = () => {
        if (!isFocused) {
            state.isFocused = true;
            setState({ ...state })
        }
    }
    rootProps.onBlur = () => {
        if (!isTouched || isFocused) {
            isTouched || (state.isTouched = true)
            isFocused && (state.isFocused = false)
    
            setState({ ...state })
        }
    }
    inputProps.value = value;
    placeholder && (inputProps.placeholder = placeholder)


    if (autofocus) {
        useEffect(() => {
            if (!disabled) {
                (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current.focus()
            }
        }, [ disabled ])
    }

    attributes && Object.assign(rootProps, attributes)
    inputAttributes && Object.assign(inputProps, inputAttributes)


    return state
}


export { InputTagProps }
export default addInputFieldAttributes