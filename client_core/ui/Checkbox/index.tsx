import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import getLabel from '../_internals/label'
import componentID from './id'

import type {
    Component, Props, MergedProps,
    WithIconRootAttrs, WithLabelRootAttrs, CheckboxRootAttrs,
    CheckboxInnerProps, IconWrapperInnerProps, LabelInnerProps
} from './types'

import styles from './styles.sass'


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

const Checkbox: Component = component(
    componentID,
    {
        theme: {
            root: '',
            _checked: '',
            _disabled: '',
            checkbox: '',
            with_icon_wrapper: '',
            label: '',
            label_wrapper: ''
        },
        value: false as boolean
    },
    props => {

        const {
            theme, onChange, label, value, disabled, icon, checkboxAttributes, rootTagAttributes
        } = props

        let checkboxInputProps: CheckboxInnerProps = {
            disabled,
            checked: value,
            type: 'checkbox',
            className: `${styles.checkbox} ${theme.checkbox}`,
            onChange: _onChange
        }
        onChange || (checkboxInputProps.readOnly = true)
        if (!label && !icon) {
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
                        { className: theme.label_wrapper },
                        props, rootTagAttributes
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