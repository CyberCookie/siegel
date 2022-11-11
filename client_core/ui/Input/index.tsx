//TODO: add formatter mode

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import componentID from './id'

import type { DivTagAttributes } from '../_internals/types'
import type {
    Component, Props, DefaultProps, InputRef, DebounceStore,
    InnerInputAttributes
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
            onChange, onFocus, payload, store, autofocus, placeholder, regexp, mask, children,
            debounceMs, className, prefix, suffix
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
        const isError = isExists(errorMsg)

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


        let inputRootProps: DivTagAttributes = {
            className: applyClassName(className, [
                [ theme.textarea, isTextarea ],
                [ theme._error, isError ],
                [ theme._filled, value.length > 0 || isExists(mask?.pattern) ],
                [ theme._focused, isFocused ],
                [ theme._touched, isTouched ],
                [ theme._disabled, disabled ],
                [ theme._readonly, isReadonly ]
            ])
        }

        if (isFocused) {
            inputRootProps.onBlur = e => {
                onBlur?.(e)
                if (!e.defaultPrevented) {

                    if (onChange && debounceStore) {
                        const [{ debounceTimeoutID, debounceValue }, setDebounceState ] = debounceStore

                        if (isExists(debounceValue)) {
                            clearTimeout(debounceTimeoutID)
                            setDebounceState( getDefaultDebounceState() )

                            onChange(debounceValue, e, payload)
                        }
                    }

                    setState({
                        isFocused: false,
                        isTouched: true
                    })
                }
            }

        } else if ((suffix || prefix) && inputProps.value) {
            prefix && (inputProps.value = `${prefix}${inputProps.value}`)
            suffix && (inputProps.value += `${suffix}`)
        }


        if (!disabled && onChange) {
            isFocused || (inputRootProps.onFocus = e => {
                onFocus?.(e)
                e.defaultPrevented || (
                    setState({
                        isFocused: true,
                        isTouched: true
                    })
                )
            })

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


        applyRefApi(inputRootProps, props)
        inputRootProps = resolveTagAttributes(inputRootProps, rootTagAttributes)


        inputProps = resolveTagAttributes(inputProps, inputAttributes)

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

                { addChildren(children, theme) }

                { isError && <div className={ theme.error_text } children={ errorMsg } /> }
            </div>
        )
    }
)


export default Input
export { componentID, getDefaultState }
export type { Component, Props }