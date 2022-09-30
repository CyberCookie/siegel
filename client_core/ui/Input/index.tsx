//TODO: add formatter mode

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'

import isExists from '../../../common/is/exists'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import componentID from './id'

import type {
    Component, Props, InnerInputAttributes, InputRef, DebounceStore
} from './types'


type DebounceState = DebounceStore[0]


const getDefaultState = () => ({
    isTouched: false,
    isFocused: false
})
const getDefaultDebounceState = (state: Partial<DebounceState> = {}) => {
    state.debounceValue = undefined,
    state.debounceTimeoutID = undefined

    return state as DebounceState
}

const Input: Component = component(
    componentID,
    {
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
    },
    props => {

        const {
            value = '',
            theme, label, errorMsg, type, disabled, onBlur, rootTagAttributes, inputAttributes,
            onChange, onFocus, payload, store, autofocus, placeholder, regexp, mask, refApi, children,
            debounceMs
        } = props

        const innerStore = store || useState(getDefaultState())
        const [ state, setState ] = innerStore
        const { isFocused, isTouched } = state


        let debounceStore: DebounceStore
        if (debounceMs) {
            debounceStore = useState<DebounceState>( getDefaultDebounceState() )
            const { debounceTimeoutID } = debounceStore[0]

            useLayoutEffect(() => {
                return () => { clearTimeout(debounceTimeoutID) }
            }, [ debounceTimeoutID ])
        }


        let inputProps: InnerInputAttributes = {
            disabled, placeholder,
            className: theme.field,
            value: debounceStore! && isExists(debounceStore[0].debounceValue)
                ?   debounceStore[0].debounceValue
                :   value
        }
        if (autofocus || mask) {
            inputProps.ref = useRef() as InputRef

            autofocus && useEffect(() => {
                disabled || (inputProps.ref as InputRef).current.focus()
            }, [ disabled ])
        }


        let { className } = props
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

                    if (onChange && debounceStore) {
                        const [{ debounceTimeoutID, debounceValue }, setDebounceState ] = debounceStore

                        if (isExists(debounceValue)) {
                            clearTimeout(debounceTimeoutID)
                            setDebounceState( getDefaultDebounceState() )

                            onChange(debounceValue, e, payload)
                        }
                    }

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
                if (!regexp || regexp.test(value)) {
                    if (debounceStore) {
                        const [{ debounceTimeoutID }, setDebounceState ] = debounceStore

                        clearTimeout(debounceTimeoutID)

                        setDebounceState({
                            debounceValue: value,
                            debounceTimeoutID: (setTimeout as Window['setTimeout'])(() => {
                                setDebounceState( getDefaultDebounceState({}) )
                                onChange(value, e, payload)
                            }, debounceMs)
                        })

                    } else onChange(value, e, payload)
                }
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

        refApi && (applyRefApi(inputRootProps, props))
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
)


export default Input
export { componentID, getDefaultState }
export type { Component, Props }