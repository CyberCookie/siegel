import React from 'react'

import { extractProps } from '../../ui_utils'
import { _Checkbox } from './types'

import s from './styles.sass'


type WrapperProps = {
    className?: string
    onMouseDown?: (e: React.MouseEvent) => void
}

const componentID = '-ui-checkbox'

const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox: _Checkbox = (props, noDefaults) => {
    const { theme, className, onChange, checkboxAttributes, attributes, label, value, disabled,
        payload, icon } = noDefaults
        ?   extractProps(Checkbox.defaults, props)
        :   (props as _Checkbox['defaults'] & typeof props)

    function onCheckboxClick(e: React.MouseEvent) { onChange!(!value, e, payload) }

    
    let checkboxInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        checked: value,
        type: 'checkbox',
        className: `${s[componentID]} ${theme.checkbox}`,
        onChange: _onChange
    }
    
    let modClass = value ? theme._checked : ''
    const hasWrapperTags = label || icon;

    if (disabled) {
        modClass += ` ${theme._disabled}`
        checkboxInputProps.disabled = true
    } else if (onChange) {
        hasWrapperTags || (checkboxInputProps.onMouseDown = onCheckboxClick)
    } else {
        checkboxInputProps.readOnly = true
    }
    hasWrapperTags || (checkboxInputProps.className += ` ${modClass}`)
    checkboxAttributes && (checkboxInputProps = Object.assign(checkboxInputProps, checkboxAttributes))

    let CheckboxElement = <input {...checkboxInputProps} />
    

    if (icon) {
        const iconWrapperProps: WrapperProps = { className: theme.with_icon_wrapper }
        if (!label) {
            iconWrapperProps.className += ` ${modClass}`
            onChange && (iconWrapperProps.onMouseDown = onCheckboxClick)
            attributes && Object.assign(iconWrapperProps, attributes)
        }
         
        CheckboxElement = (
            <div {...iconWrapperProps}>
                { CheckboxElement }
                { icon }
            </div>
        )
    }


    if (label) {
        const labelProps: WrapperProps = {
            className: `${className} ${modClass}`
        }
        onChange && (labelProps.onMouseDown = onCheckboxClick)
        attributes && Object.assign(labelProps, attributes)

        
        return (
            <label {...labelProps}>
                <div className={theme.label} children={label} />
            
                { CheckboxElement }
            </label>
        )
    } else return CheckboxElement
}
Checkbox.defaults = {
    theme: {
        root: componentID + '_wrapper',
        checkbox: componentID,
        _checked: componentID + '__checked',
        _disabled: componentID + '__disabled',
        with_icon_wrapper: componentID + '_with_icon_wrapper',
        label: componentID + '_label'
    },
    
    value: false
}
Checkbox.ID = componentID;


export { componentID }
export default Checkbox