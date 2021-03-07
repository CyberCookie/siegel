//TODO: refactor
//TODO: apply root className

import React from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import isE from '../../../utils/is_exists'
import getLabel from '../label'
import componentID from './id'
import type { _Checkbox, WrapperProps } from './types'

import styles from './styles.sass'


const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox: _Checkbox = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Checkbox.defaults, props)
        :   (props as _Checkbox['defaults'] & typeof props)

    const {
        theme, className, onChange, checkboxAttributes, attributes, label, value, disabled,
        payload, icon, refApi
    } = mergedProps;

    function onCheckboxClick(e: React.MouseEvent) { onChange!(!value, e, payload) }

    
    const withLabel = isE(label)

    let checkboxInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        checked: value,
        type: 'checkbox',
        className: `${styles[componentID]} ${theme.checkbox}`,
        onChange: _onChange
    }
    
    let modClass = value ? theme._checked : ''
    const hasWrapperTags = withLabel ? label : icon;

    if (disabled) {
        modClass += ` ${theme._disabled}`
        checkboxInputProps.disabled = true
    } else if (onChange) {
        hasWrapperTags || (checkboxInputProps.onMouseDown = onCheckboxClick)
    } else {
        checkboxInputProps.readOnly = true
    }
    if (!hasWrapperTags) {
        checkboxInputProps.className += ` ${modClass}`
        refApi && applyRefApi(checkboxInputProps, mergedProps)
    }
    checkboxAttributes && (checkboxInputProps = Object.assign(checkboxInputProps, checkboxAttributes))

    let CheckboxElement = <input {...checkboxInputProps} />
    

    if (icon) {
        const iconWrapperProps: WrapperProps = { className: theme.with_icon_wrapper }
        if (!withLabel) {
            iconWrapperProps.className += ` ${modClass}`
            !disabled && onChange && (iconWrapperProps.onMouseDown = onCheckboxClick)
            refApi && applyRefApi(iconWrapperProps, mergedProps)
            attributes && Object.assign(iconWrapperProps, attributes)
        }
         
        CheckboxElement = (
            <div {...iconWrapperProps}>
                { CheckboxElement }
                { icon }
            </div>
        )
    }


    if (withLabel) {
        const labelProps: WrapperProps = {
            className: `${className} ${modClass}`
        }
        !disabled && onChange && (labelProps.onMouseDown = onCheckboxClick)
        refApi && applyRefApi(labelProps, mergedProps)
        attributes && Object.assign(labelProps, attributes)

        return getLabel(CheckboxElement, labelProps, {
            className: theme.label,
            children: label
        })
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