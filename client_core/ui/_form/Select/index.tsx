import React, { useState, useEffect, useRef } from 'react'

import isTouchScreen from '../../../utils/is_touchscreen'
import { extractProps, applyRefApi } from '../../ui_utils'
import type { ComponentAttributes } from '../../ui_utils'
import type{ MergedProps, _Select, Props } from './types'


const componentID = '-ui-select'

const _isTouchScreen = isTouchScreen()
const stopPropagationHandler = (e: React.MouseEvent) => { e.stopPropagation() }


function getOptions(props: MergedProps, setActive: React.Dispatch<React.SetStateAction<boolean>>) {
    const { options, selected, theme, onChange, closeOnSelect, filterSelected } = props;
    
    const result = []
    for (let i = 0; i < options.length; i++) {
        const { disabled, title, value, payload, className } = options[i]

        let optionClassName = theme.option;

        if (value === selected) {
            if (filterSelected) continue;
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
            
    
        result.push( <div {...optionProps} key={value} /> )
    }


    return result
}

const Select: _Select = (props, noDefaults) => {
    const [ isActive, setActive ] = useState(false)

    const mergedProps = noDefaults
        ?   extractProps(Select.defaults, props, false)
        :   (props as _Select['defaults'] & Props)

    const {
        theme, attributes, displayValue, dropdownIcon, label, disabled, placeholder, refApi
    } = mergedProps;
    
    let className = mergedProps.className;
    isActive && (className += ` ${theme._active}`)
    displayValue && (className += ` ${theme._filled}`)
    
    let selectRootProps: Props['attributes'] = {
        className,
        ref: useRef(null)
    }
    disabled
        ?   (selectRootProps.className += ` ${theme._disabled}`)
        :   (selectRootProps.onMouseDown = (e: React.MouseEvent) => {
                e.stopPropagation()
                e.preventDefault()
            
                setActive(!isActive)
            })
    refApi && (applyRefApi(selectRootProps, mergedProps))
    attributes && (selectRootProps = Object.assign(selectRootProps, attributes))

    useEffect(() => {
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
    }, [])
    

    const selectInput = <>
        <div className={theme.title}>
            <div className={theme.title_text} children={displayValue || placeholder} />
            { dropdownIcon }
        </div>

        { disabled || (
            <div className={theme.options} onMouseDown={stopPropagationHandler}
                children={getOptions(mergedProps, setActive)} />
        )}
    </>
    
    return (
        <div {...selectRootProps}>
            { label
                ?   <>
                        <div className={theme.label} children={label} />
                        <div className={theme.input_wrapper} children={selectInput} />
                    </>
                
                :   selectInput
            }
        </div>
    )
}
Select.defaults = {
    theme: {
        root: componentID,
        label: componentID + '_label',
        title: componentID + '_title',
        title_text: componentID + '_title_text',
        input_wrapper: componentID + '_input_wrapper',
        options: componentID + '_options',
        option: componentID + '_option',
        _filled: componentID + '__filled',
        _active: componentID + '__active',
        _disabled: componentID + '__disabled',
        _option_active: componentID + '_option__active',
        _option_disabled: componentID + '_option__disabled'
    },

    closeOnSelect: true,
    dropdownIcon: '',
    filterSelected: true
}
Select.ID = componentID;


export { componentID }
export default Select