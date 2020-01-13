import React, { useState, useEffect, useRef } from 'react'

import isTouchScreen from '../../utils/is_touchscreen'
import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'


const componentID = '-ui-select'

const defaults: DefaultProps = {
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

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const _isTouchScreen = isTouchScreen()

function getOptions(props: DefaultProps & Props, setActive: React.Dispatch<React.SetStateAction<boolean>>) {
    let { options, selected, theme, onSelect, closeOnSelect } = props;


    return options.map(option => {
        let { disabled, data, title, id } = option;
    
        let optionClassName = theme.option;
        id === selected && (optionClassName += ` ${theme.option_active}`)
        disabled && (optionClassName += ` ${theme.option_disabled}`)
    
        return (
            <div key={id} children={title} className={optionClassName}
                onMouseDown={e => {
                    e.stopPropagation()
                    onSelect(id, data)
                    closeOnSelect && setActive(false)
                }} />
        )
    })
}


const Select = (props: Props) => {
    let [ isActive, setActive ] = useState(false)

    let mergedProps = extractProps(defaults, props)
    let { theme, className = '', attributes, displayValue, dropdownIcon, label } = mergedProps

    className += ` ${theme.select}`;
    isActive && (className += ` ${theme.select_active}`)
    
    let wrapperAttr = Object.assign({}, attributes, {
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>),
        className,
        onMouseDown(e: React.MouseEvent) {
            e.stopPropagation()
            e.preventDefault()
    
            setActive(!isActive)
        }
    })

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            wrapperAttr.ref.current.contains(e.target as Node) || setActive(false)
        }
        let eventOptions = { passive: true }

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
        <div {...wrapperAttr}>
            { label && <div className={theme.label} children={label} /> }

            <div className={theme.title}>
                { displayValue }
                { dropdownIcon }
            </div>

            <div className={theme.options}
                children={getOptions(mergedProps, setActive)} />
        </div>
    )
}


export { setDefaults }
export default Select