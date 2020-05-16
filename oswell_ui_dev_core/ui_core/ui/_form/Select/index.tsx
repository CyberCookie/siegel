import React, { useState, useEffect, useRef } from 'react'

import isTouchScreen from '../../../utils/is_touchscreen'
import { extractProps } from '../../ui_utils'
import { Props, DefaultProps, _Select } from './types'


type SelectRootProps = {
    ref: React.MutableRefObject<HTMLDivElement>
    className?: string
    disabled?: boolean
    onMouseDown?: (e: React.MouseEvent) => void
}

const componentID = '-ui-select'

const _isTouchScreen = isTouchScreen()
const stopPropagationHandler = (e: React.MouseEvent) => { e.stopPropagation() }


function getOptions(props: DefaultProps & Props, setActive: React.Dispatch<React.SetStateAction<boolean>>) {
    const { options, selected, theme, onChange, closeOnSelect } = props;


    return options.map(option => {
        const { disabled, title, value, payload } = option;
    
        let optionClassName = theme.option;
        value === selected && (optionClassName += ` ${theme.option_active}`)
        disabled && (optionClassName += ` ${theme.option_disabled}`)
    
        return (
            <div key={value} children={title} className={optionClassName}
                onMouseDown={e => {
                    e.stopPropagation()
                    onChange(value, e, payload)
                    closeOnSelect && setActive(false)
                }} />
        )
    })
}

const Select: _Select = (props, noDefaults) => {
    const [ isActive, setActive ] = useState(false)

    const mergedProps = noDefaults
        ?   extractProps(Select.defaults, props)
        :   (props as _Select['defaults'] & typeof props)

    const { theme, attributes, displayValue, dropdownIcon, label, disabled } = mergedProps;
    
    let className = mergedProps.className;
    isActive && (className += ` ${theme.select_active}`)
    
    let selectRootProps: SelectRootProps = {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    }
    disabled
        ?   (selectRootProps.disabled = true)
        :   (selectRootProps.onMouseDown = (e: React.MouseEvent) => {
                e.stopPropagation()
                e.preventDefault()
            
                setActive(!isActive)
            });
    attributes && (selectRootProps = Object.assign(selectRootProps, attributes))

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            selectRootProps.ref.current.contains(e.target as Node) || setActive(false)
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
            { displayValue }
            { dropdownIcon }
        </div>

        { isActive && (
            <div className={theme.options} onMouseDown={stopPropagationHandler}
                children={getOptions(mergedProps, setActive)} />
        )}
    </>
    
    return (
        <div {...selectRootProps}>
            { label
                ?   <>
                        <div className={theme.label} children={label} />
                        <div className={theme.select_input} children={selectInput} />
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
        select_input: componentID + '_input',
        select_active: componentID + '__active',
        options: componentID + '_options',
        option: componentID + '_option',
        option_active: componentID + '_option__active',
        option_disabled: componentID + '_option__disabled'
    },

    closeOnSelect: true,
    dropdownIcon: ''
}
Select.ID = componentID;


export { componentID }
export default Select