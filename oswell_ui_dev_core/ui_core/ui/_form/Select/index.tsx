import React, { useState, useEffect, useRef } from 'react'

import isTouchScreen from '../../../utils/is_touchscreen'
import { extractProps } from '../../ui_utils'
import { Props, DefaultProps, _Select } from './types'


const componentID = '-ui-select'

const _isTouchScreen = isTouchScreen()

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

const Select: _Select = (props, withDefaults) => {
    const [ isActive, setActive ] = useState(false)

    const mergedProps = withDefaults
        ?   (props as _Select['defaults'] & typeof props)
        :   extractProps(Select.defaults, props)

    const { theme, attributes, displayValue, dropdownIcon, label } = mergedProps;
    
    let className = `${mergedProps.className} ${theme.select}`;
    isActive && (className += ` ${theme.select_active}`)
    
    let selectRootProps = {
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>),
        className,
        onMouseDown(e: React.MouseEvent) {
            e.stopPropagation()
            e.preventDefault()
    
            setActive(!isActive)
        }
    }
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
    
    
    return (
        <div {...selectRootProps}>
            { label && <div className={theme.label} children={label} /> }

            <div className={theme.title}>
                { displayValue }
                { dropdownIcon }
            </div>

            { isActive && (
                <div className={theme.options}
                    children={getOptions(mergedProps, setActive)} />
            )}
        </div>
    )
}
Select.defaults = {
    theme: {
        select: componentID,
        label: componentID + '_label',
        title: componentID + '_title',
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