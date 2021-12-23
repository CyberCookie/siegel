import React from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import getLabel from '../_internals/label'
import isExists from '../../utils/is/exists'
import componentID from './id'
import type {
    Component, MergedProps, CheckboxInputProps,
    Props
} from './types'

import styles from './styles.sass'


const innerRootClassName = styles[componentID + '_inner']

const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

function modifyRootProps(rootProps: CheckboxInputProps, mergedProps: MergedProps, isCheckboxElement?: boolean) {
    const { disabled, onChange, value, payload, className, attributes, checkboxAttributes, refApi, theme } = mergedProps

    let modClass = value ? theme._checked : ''

    if (disabled) modClass += ` ${theme._disabled}`
    else if (onChange) {
        rootProps.onMouseDown = (e: React.MouseEvent) => { onChange(!value, e, payload) }
    }

    rootProps.className += ` ${className} ${modClass}`
    refApi && applyRefApi(rootProps, mergedProps)

    const attributesToMerge = isCheckboxElement ? checkboxAttributes : attributes
    attributesToMerge && Object.assign(rootProps, attributes)
}

const Checkbox: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Checkbox.defaults, props, false)
        :   (props as MergedProps)

    const { theme, onChange, label, value, disabled, icon } = mergedProps

    const withLabel = isExists(label)


    const checkboxInputProps: CheckboxInputProps = {
        disabled,
        checked: value,
        type: 'checkbox',
        className: `${innerRootClassName} ${theme.checkbox}`,
        onChange: _onChange
    }
    withLabel || icon || modifyRootProps(checkboxInputProps, mergedProps, true)
    onChange || (checkboxInputProps.readOnly = true)

    let CheckboxElement = <input { ...checkboxInputProps } />


    if (icon) {
        const iconWrapperProps = { className: theme.with_icon_wrapper }
        withLabel || modifyRootProps(iconWrapperProps, mergedProps)

        CheckboxElement = (
            <div { ...iconWrapperProps }>
                { CheckboxElement }
                { icon }
            </div>
        )
    }

    if (withLabel) {
        const labelProps = { className: theme.label_wrapper }
        modifyRootProps(labelProps, mergedProps)

        return getLabel(CheckboxElement, labelProps, {
            className: theme.label,
            children: label
        })
    } else return CheckboxElement
}
Checkbox.defaults = {
    theme: {
        root: '',
        checkbox: '',
        with_icon_wrapper: '',
        label: '',
        label_wrapper: '',
        _checked: '',
        _disabled: ''
    },

    value: false
}
Checkbox.ID = componentID


export { componentID }
export default Checkbox
export type { Props }