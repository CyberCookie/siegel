import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'

import isExists from '../../../common/is/exists'
import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import getInputLabeled from '../_internals/label'
import { setCaretPos, INPUT_TYPE } from './utils'

import type { DivTagAttributes } from '../_internals/types'
import type {
    Component, Props, DefaultProps, InputRef, DebounceStore,
    InnerInputAttributes
} from './types'


type DebounceState = DebounceStore[0]


const componentID = '-ui-input'

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
            _textarea: _undef,
            children: _undef,
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
        const prefixOrSuffix = prefix || suffix

        let inputProps: InnerInputAttributes = {
            disabled, placeholder, type,
            className: theme.field,
            readOnly: isReadonly,
            value: debounceStore! && isExists(debounceStore[0].debounceValue)
                ?   debounceStore[0].debounceValue
                :   value
        }
        if (autofocus || mask || prefixOrSuffix) {
            inputProps.ref = useRef(null)

            autofocus && useEffect(() => {
                disabled || (inputProps.ref as InputRef).current!.focus()
            }, [ disabled ])
        }


        let inputRootProps: DivTagAttributes = {
            className: applyClassName(className, [
                [ theme._textarea, isTextarea ],
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

        }

        if (prefixOrSuffix) {
            prefix && (inputProps.value = `${prefix}${inputProps.value}`)
            suffix && (inputProps.value += `${suffix}`)
        }

        if (!disabled && onChange) {
            isFocused || (inputRootProps.onFocus = e => {
                onFocus?.(e)
                if (!e.defaultPrevented) {
                    setState({
                        isFocused: true,
                        isTouched: true
                    })

                    if (prefixOrSuffix) {
                        const rootEl = e.currentTarget
                        setTimeout(() => {
                            const inputEl = rootEl.querySelector('input')!
                            const { selectionStart, selectionEnd, value } = inputEl

                            const allowedSelectionStart = prefix?.length || 0
                            const allowedSelectionEnd = value.length - (suffix?.length || 0)

                            const newSelectionStart = Math.max(selectionStart!, allowedSelectionStart)
                            const newSelectionEnd = Math.max(
                                allowedSelectionStart,
                                Math.min(selectionEnd!, allowedSelectionEnd)
                            )

                            if (newSelectionStart != selectionStart || newSelectionEnd != selectionEnd) {
                                inputEl.setSelectionRange(newSelectionStart, newSelectionEnd)
                            }
                        })
                    }
                }
            })

            inputProps.onChange = e => {
                const inputEl = e.target as HTMLInputElement

                let { value } = inputEl
                if (prefixOrSuffix) {
                    const { selectionStart } = inputEl

                    const { inputType } = e.nativeEvent as InputEvent
                    if (inputType == 'deleteByDrag' || inputType == 'insertFromDrop') return

                    const newData = (e.nativeEvent as InputEvent).data
                    const newDataLength = newData?.length || 0

                    const prefLength = prefix?.length || 0
                    const sufLength = suffix?.length || 0
                    const prevValueLength = props.value?.length || 0


                    const isDelete = inputType == INPUT_TYPE.DELETE_BACKWARD || inputType == INPUT_TYPE.DELETE_FORWARD


                    if (isDelete) {
                        const prevLength = prefLength + prevValueLength + sufLength
                        const charsDeleted = prevLength - value.length

                        const isPrefDeleted = prefLength > selectionStart!
                        const isSufDeleted = prefLength + prevValueLength < selectionStart! + charsDeleted

                        if (isPrefDeleted) {
                            const countCharsSubstr = selectionStart! + charsDeleted > prefLength
                                ?   selectionStart!
                                :   prefLength - charsDeleted

                            if (countCharsSubstr > 0) {
                                value = prefix + value.substring(countCharsSubstr)
                            }

                            setCaretPos(inputProps.ref as InputRef, prefLength)

                        } else if (isSufDeleted) {
                            const countCharsBeforeSuf = prefLength + prevValueLength
                            const countCharsSubstr = selectionStart! > countCharsBeforeSuf
                                ?   countCharsBeforeSuf
                                :   countCharsBeforeSuf - (countCharsBeforeSuf - selectionStart!)

                            value = value.substring(0, countCharsSubstr) + suffix

                            setCaretPos(inputProps.ref as InputRef, value.length - sufLength)
                        }
                    }


                    if (prefix) {

                        let shouldAdjustPosition
                        if (!isDelete) {

                            const prevCaretPos = selectionStart! - newDataLength
                            if (prefLength > prevCaretPos) {
                                const valueBeforeNewData = value.substring(0, prevCaretPos)
                                const valueAfterNewData = value.substring(selectionStart!)
                                value = valueBeforeNewData + valueAfterNewData

                                shouldAdjustPosition = true
                            }
                        }

                        if (value.startsWith(prefix)) {
                            value = value.substring(prefLength)
                        }

                        if (shouldAdjustPosition) {
                            value = newData + value
                            setCaretPos(inputProps.ref as InputRef, prefLength + newDataLength)
                        }
                    }

                    if (suffix) {

                        let shouldAdjustPosition
                        if (!isDelete) {

                            const prevCaretPos = selectionStart! - newDataLength
                            if (prefLength + prevValueLength < prevCaretPos) {
                                const valueBeforeNewData = value.substring(0, prevCaretPos - prefLength)
                                const valueAfterNewData = value.substring(selectionStart! - prefLength)
                                value = valueBeforeNewData + valueAfterNewData

                                shouldAdjustPosition = true
                            }
                        }

                        if (value.endsWith(suffix)) {
                            value = value.substring(0, value.length - suffix!.length)
                        }

                        if (shouldAdjustPosition) {
                            value += newData
                            setCaretPos(inputProps.ref as InputRef, prefLength + prevValueLength + newDataLength)
                        }
                    }
                }

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