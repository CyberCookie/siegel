import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import type { Component, Props } from './types'


const componentID = '-ui-toggle'

const Toggle: Component = component(
    componentID,
    {
        theme: {
            root: '',
            _disabled: '',
            _toggled: '',
            children: '',
            label: '',
            toggle_area: '',
            toggler: ''
        }
    },
    props => {

        const {
            theme, labelLeft, labelRight, value, onChange, toggleIcon, rootTagAttributes,
            payload, disabled, className, refApi, children
        } = props


        let toggleRootProps: Props['rootTagAttributes'] = { className }

        value && (toggleRootProps.className += ` ${theme._toggled}`)

        if (disabled) {
            toggleRootProps.className += ` ${theme._disabled}`
        } else if (onChange) {
            toggleRootProps.onMouseDown = (e: React.MouseEvent) => {
                onChange(!value, e, payload)
            }
        }
        refApi && (applyRefApi(toggleRootProps, props))
        if (rootTagAttributes) {
            toggleRootProps = mergeTagAttributes(toggleRootProps, rootTagAttributes)
        }


        return (
            <div { ...toggleRootProps }>
                { labelLeft && <div className={ theme.label } children={ labelLeft } /> }

                <div className={ theme.toggle_area }>
                    <div className={ theme.toggler } children={ toggleIcon } />
                </div>

                { labelRight && <div className={ theme.label } children={ labelRight } /> }

                { children && addChildren(children, theme) }
            </div>
        )
    }
)


export default Toggle
export { componentID }
export type { Component, Props }