import React from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import isE from '../../../utils/is_exists'
import getLabel from '../label'
import componentID from './id'
import type { _Checkbox, WrapperProps, MergedProps } from './types'

import styles from './styles.sass'


type CheckboxInputProps = React.InputHTMLAttributes<HTMLInputElement>


const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

function modifyRootProps(rootProps: WrapperProps | CheckboxInputProps, mergedProps: MergedProps, isCheckboxElement?: boolean) {
    const { disabled, onChange, value, payload, className, attributes, refApi, theme } = mergedProps;

    let modClass = value ? theme._checked : ''

    if (disabled) modClass += ` ${theme._disabled}`
    else if (onChange) {
        rootProps.onMouseDown = (e: React.MouseEvent) => { onChange(!value, e, payload) }
    }

    rootProps.className += ` ${className} ${modClass}`
    refApi && applyRefApi(rootProps, mergedProps)
    !isCheckboxElement && attributes && Object.assign(rootProps, attributes)
}

const Checkbox: _Checkbox = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Checkbox.defaults, props, false)
        :   (props as _Checkbox['defaults'] & typeof props)

    const { theme, onChange, checkboxAttributes, label, value, disabled, icon } = mergedProps;

    const withLabel = isE(label)

    
    let checkboxInputProps: CheckboxInputProps = {
        disabled,
        checked: value,
        type: 'checkbox',
        className: `${styles[componentID]} ${theme.checkbox}`,
        onChange: _onChange
    }
    withLabel || icon || modifyRootProps(checkboxInputProps, mergedProps, true)
    onChange || (checkboxInputProps.readOnly = true)
    checkboxAttributes && (checkboxInputProps = Object.assign(checkboxInputProps, checkboxAttributes))

    let CheckboxElement = <input {...checkboxInputProps} />
    

    if (icon) {
        const iconWrapperProps: WrapperProps = { className: theme.with_icon_wrapper }
        withLabel || modifyRootProps(iconWrapperProps, mergedProps)
         
        CheckboxElement = (
            <div {...iconWrapperProps}>
                { CheckboxElement }
                { icon }
            </div>
        )
    }

    if (withLabel) {
        const labelProps: WrapperProps = { className: theme.label_wrapper }
        modifyRootProps(labelProps, mergedProps)

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
        with_icon_wrapper: componentID + '_with_icon_wrapper',
        label: componentID + '_label',
        label_wrapper: componentID + '_label_wrapper',
        _checked: componentID + '__checked',
        _disabled: componentID + '__disabled'
    },
    
    value: false
}
Checkbox.ID = componentID;


export { componentID }
export default Checkbox