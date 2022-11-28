import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import getLabel from '../_internals/label'
import componentID from './id'

import type {
    Component, Props, DefaultProps, MergedProps,
    WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs,
    CheckboxInnerProps, IconWrapperInnerProps, LabelInnerProps,
    HandlerEvent
} from './types'

import styles from './styles.sass'


const _undef = undefined

function _onChange(e: React.FormEvent<HTMLInputElement>) {
    e.stopPropagation()
    e.preventDefault()
}

function modifyRootProps<P extends CheckboxInnerProps | LabelInnerProps | IconWrapperInnerProps>(
    rootProps: P,
    mergedProps: MergedProps,
    newAttributes?: CheckboxRootAttrs | WithLabelRootAttrs | WithIconRootAttrs
) {

    const {
        value, disabled, payload, className, theme,
        onChange, onMouseDown
    } = mergedProps

    let modClass = value ? theme._checked : ''

    if (disabled) modClass += ` ${theme._disabled}`
    else if (onChange) {
        rootProps.onMouseDown = (e: HandlerEvent) => {
            onMouseDown?.(e)
            e.defaultPrevented || onChange(!value, e, payload)
        }
    }

    rootProps.className += ` ${className} ${modClass}`
    applyRefApi(rootProps, mergedProps)


    return resolveTagAttributes(rootProps, newAttributes)
}

const Checkbox = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _checked: _undef,
            _disabled: _undef,
            checkbox: _undef,
            with_icon_wrapper: _undef,
            label: _undef,
            label_wrapper: _undef
        },
        value: false
    },
    props => {

        const {
            theme, onChange, label, value, disabled, icon,
            checkboxAttributes, rootTagAttributes
        } = props


        let _className = styles.checkbox
        theme.checkbox && (_className += ` ${theme.checkbox}`)

        let checkboxInputProps: CheckboxInnerProps = {
            disabled,
            checked: value,
            type: 'checkbox',
            className: _className,
            onChange: _onChange,
            readOnly: !onChange
        }
        if (!(label || icon)) {
            checkboxInputProps = modifyRootProps(checkboxInputProps, props, checkboxAttributes)
        }

        let CheckboxElement = <input { ...checkboxInputProps } />


        if (icon) {
            let iconWrapperProps: IconWrapperInnerProps = {
                className: theme.with_icon_wrapper
            }
            label || (iconWrapperProps = modifyRootProps(iconWrapperProps, props, rootTagAttributes))

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
                        { className: theme.label_wrapper || '' },
                        props,
                        rootTagAttributes
                    ),
                    {
                        className: theme.label,
                        children: label
                    }
                )
            :   CheckboxElement
    }
)


export default Checkbox
export { componentID }
export { Component, Props, WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs }