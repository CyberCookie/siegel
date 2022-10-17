//TODO: add formatter mode

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'

import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import componentID from './id'

import type {
    Component, Props, DefaultProps, InnerInputAttributes, InputRef, DebounceStore
} from './types'


type DebounceState = DebounceStore[0]


const _undef = undefined

const getDefaultState = () => ({
    isTouched: false,
    isFocused: false
})
const getDefaultDebounceState = (state: Partial<DebounceState> = {}) => {
    state.debounceValue = _undef,
    state.debounceTimeoutID = _undef

    return state as DebounceState
}

const Input = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _filled: _undef,
            _error: _undef,
            _disabled: _undef,
            _focused: _undef,
            _touched: _undef,
            _readonly: _undef,
            children: _undef,
            textarea: _undef,
            label: _undef,
            label_text: _undef,
            field: _undef,
            error_text: _undef
        }
    },
    props => {

        const {
            value = '',
            theme, label, errorMsg, type, disabled, onBlur, rootTagAttributes, inputAttributes,
            onChange, onFocus, payload, store, autofocus, placeholder, regexp, mask, refApi, children,
            debounceMs, className
        } = props

        const innerStore = store || useState(getDefaultState())
        const [ state, setState ] = innerStore
        const { isFocused, isTouched } = state


        let debounceStore: DebounceStore
        if (debounceMs) {
            debounceStore = useState<DebounceState>( getDefaultDebounceState() )
            const { debounceTimeoutID } = debounceStore[0]

            useLayoutEffect(() => () => { clearTimeout(debounceTimeoutID) }, [
                debounceTimeoutID
            ])
        }

        const isReadonly = !disabled && !onChange
        const isTextarea = type == 'textarea'

        let inputProps: InnerInputAttributes = {
            disabled, placeholder, type,
            className: theme.field,
            readOnly: isReadonly,
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


        let inputRootProps: Props['rootTagAttributes'] = {
            className: applyClassName(className, [
                [ theme.textarea, isTextarea ],
                [ theme._error, !!errorMsg ],
                [ theme._filled, value.length > 0 || isExists(mask?.pattern) ],
                [ theme._focused, isFocused ],
                [ theme._touched, isTouched ],
                [ theme._disabled, disabled ],
                [ theme._readonly, isReadonly ]
            ]),
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


        if (!disabled && onChange) {
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
        }


        refApi && (applyRefApi(inputRootProps, props))
        rootTagAttributes && (inputRootProps = mergeTagAttributes(inputRootProps, rootTagAttributes))

        inputAttributes && (inputProps = mergeTagAttributes(inputProps, inputAttributes))

        mask?.processor(mask, inputProps as Parameters<typeof mask['processor']>[1])

        const InputTag: string = isTextarea ? type : 'input'
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