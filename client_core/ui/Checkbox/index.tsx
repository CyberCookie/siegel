import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import getLabel from '../_internals/label'
import componentID from './id'
import type { ComponentAttributes } from '../_internals/types'
import type {
    Component, Props, MergedProps,
    WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs
} from './types'

import styles from './styles.sass'


type CheckboxInnerProps = ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
type LabelInnerProps = ComponentAttributes<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>
type IconWrapperInnerProps = ComponentAttributes<HTMLDivElement>


function _onChange(e: React.FormEvent<HTMLInputElement>) {
    e.stopPropagation()
    e.preventDefault()
}

function modifyRootProps<P extends CheckboxInnerProps | LabelInnerProps | IconWrapperInnerProps>(
    rootProps: P,
    mergedProps: MergedProps,
    newAttributes?: CheckboxRootAttrs | WithLabelRootAttrs | WithIconRootAttrs
) {

    const { disabled, onChange, value, payload, className, refApi, theme } = mergedProps

    let modClass = value ? theme._checked : ''

    if (disabled) modClass += ` ${theme._disabled}`
    else if (onChange) {
        rootProps.onMouseDown = (e: React.MouseEvent) => {
            onChange(!value, e, payload)
        }
    }

    rootProps.className += ` ${className} ${modClass}`
    refApi && applyRefApi(rootProps, mergedProps)


    return newAttributes
        ?   mergeTagAttributes(rootProps, newAttributes)
        :   rootProps as P
}

const Checkbox: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Checkbox.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, onChange, label, value, disabled, icon, checkboxAttributes, rootTagAttributes
    } = mergedProps


    let checkboxInputProps: CheckboxInnerProps = {
        disabled,
        checked: value,
        type: 'checkbox',
        className: `${styles.checkbox} ${theme.checkbox}`,
        onChange: _onChange
    }
    onChange || (checkboxInputProps.readOnly = true)
    if (!label && !icon) {
        checkboxInputProps = modifyRootProps(checkboxInputProps, mergedProps, checkboxAttributes)
    }

    let CheckboxElement = <input { ...checkboxInputProps } />


    if (icon) {
        let iconWrapperProps: IconWrapperInnerProps = {
            className: theme.with_icon_wrapper
        }
        label || (iconWrapperProps = modifyRootProps(iconWrapperProps, mergedProps, rootTagAttributes))

        CheckboxElement = (
            <div { ...iconWrapperProps }>
                { CheckboxElement }
                { icon }
            </div>
        )
    }


    return label
        ?   getLabel(
                CheckboxElement,
                modifyRootProps(
                    { className: theme.label_wrapper },
                    mergedProps, rootTagAttributes
                ),
                {
                    className: theme.label,
                    children: label
                }
            )
        :   CheckboxElement
}
Checkbox.defaults = {
    theme: {
        root: '',
        _checked: '',
        _disabled: '',
        checkbox: '',
        with_icon_wrapper: '',
        label: '',
        label_wrapper: ''
    },
    value: false
}
Checkbox.ID = componentID


export default Checkbox
export { componentID }
export { Component, Props, WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs }