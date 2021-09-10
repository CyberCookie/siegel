//TODO: apply arrow controls when focused
import React, { useState, useLayoutEffect, useRef } from 'react'

import isE from '../../../utils/is_exists'
import isTouchScreen from '../../../utils/is_touchscreen'
import { extractProps, applyRefApi, ComponentAttributes } from '../../ui_utils'
import addChildren from '../../children'
import type {
    MergedProps, Component,
    Props
} from './types'


const componentID = '-ui-select'

const _isTouchScreen = isTouchScreen()
const stopPropagationHandler = (e: React.MouseEvent) => { e.stopPropagation() }


function getOptions(props: MergedProps, setActive: React.Dispatch<React.SetStateAction<boolean>>) {
    const { options, selected, theme, onChange, closeOnSelect, filterSelected } = props

    const optionElements = []
    let selectedOption
    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        const { disabled, title, value, payload, className } = option

        let optionClassName = theme.option

        if (value === selected) {
            selectedOption = option

            if (filterSelected) continue
            else optionClassName += ` ${theme._option_active}`
        }
        className && (optionClassName += ` ${className}`)

        const optionProps: ComponentAttributes<HTMLDivElement> = {
            children: title,
            className: optionClassName
        }

        disabled
            ?   optionProps.className += ` ${theme._option_disabled}`
            :   optionProps.onMouseDown = (e: React.MouseEvent) => {
                    e.stopPropagation()
                    onChange(value, e, payload)
                    closeOnSelect && setActive(false)
                }


        optionElements.push( <div { ...optionProps } key={value} /> )
    }


    return {
        selectedOption,
        optionsElement: (
            <div className={theme.options} onMouseDown={stopPropagationHandler}
                children={optionElements} />
        )
    }
}

const Select: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Select.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, attributes, options, getDisplayValue, selected, dropdownIcon, label, disabled, placeholder, refApi,
        innerStore, resetIcon, onChange
    } = mergedProps

    const [ isActive, setActive ] = ((innerStore || useState(false)) as NonNullable<Props['innerStore']>)
    const isSelected = isE(selected)

    let className = mergedProps.className
    isActive && (className += ` ${theme._active}`)
    isSelected && (className += ` ${theme._filled}`)

    let selectRootProps: NonNullable<Props['attributes']> = {
        className,
        ref: useRef(null)
    }

    let optionsElement, selectedOption
    if (disabled) {
        selectRootProps.className += ` ${theme._disabled}`

        if (isSelected) {
            selectedOption = options.find(option => option.value == selected)
        }
    } else {
        const optionsData = getOptions(mergedProps, setActive)
        optionsElement = optionsData.optionsElement
        selectedOption = optionsData.selectedOption

        selectRootProps.onMouseDown = () => { setActive(!isActive) }
    }

    refApi && (applyRefApi(selectRootProps, mergedProps))
    attributes && (selectRootProps = Object.assign(selectRootProps, attributes))

    useLayoutEffect(() => {
        if (isActive) {
            const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
                (selectRootProps.ref as React.MutableRefObject<HTMLDivElement>)
                    .current.contains(e.target as Node) || setActive(false)
            }
            const eventOptions = { passive: true }

            _isTouchScreen
                ?   document.addEventListener('touchstart', handleOutsideClick, eventOptions)
                :   document.addEventListener('mousedown', handleOutsideClick, eventOptions)

            return () => {
                _isTouchScreen
                    ?   document.removeEventListener('touchstart', handleOutsideClick)
                    :   document.removeEventListener('mousedown', handleOutsideClick)
            }
        }
    }, [ isActive ])


    const displayValue = selectedOption
        ?   getDisplayValue
            ?   getDisplayValue(selectedOption)
            :   selectedOption.title
        :   placeholder


    const selectInput = <>
        <div className={theme.title}>
            <div className={theme.title_text} children={displayValue} />

            { resetIcon &&  (
                <div children={resetIcon} className={theme.reset}
                    onMouseDown={e => {
                        e.stopPropagation()
                        onChange(undefined, e)
                    }} />
            )}

            { dropdownIcon }
        </div>

        { optionsElement }
    </>


    return (
        <div { ...selectRootProps }>
            { label
                ?   <>
                        <div className={theme.label} children={label} />
                        <div className={theme.input_wrapper} children={selectInput} />
                    </>

                :   selectInput
            }

            { addChildren(selectRootProps, theme) }
        </div>
    )
}
Select.defaults = {
    theme: {
        root: '',
        children: '',
        label: '',
        title: '',
        reset: '',
        title_text: '',
        input_wrapper: '',
        options: '',
        option: '',
        _filled: '',
        _active: '',
        _disabled: '',
        _option_active: '',
        _option_disabled: ''
    },

    closeOnSelect: true,
    dropdownIcon: '',
    filterSelected: true
}
Select.ID = componentID


export { componentID }
export default Select
export type { Props }