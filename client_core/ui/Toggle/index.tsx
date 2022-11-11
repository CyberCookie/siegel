import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'

import type { DivTagAttributes } from '../_internals/types'
import type { Component, Props, DefaultProps } from './types'


const _undef = undefined
const componentID = '-ui-toggle'

const Toggle = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _disabled: _undef,
            _toggled: _undef,
            children: _undef,
            label: _undef,
            toggle_area: _undef,
            toggler: _undef
        }
    },
    props => {

        const {
            theme, labelLeft, labelRight, value, toggleIcon, rootTagAttributes,
            payload, disabled, className, children,
            onChange, onMouseDown
        } = props


        let toggleRootProps: DivTagAttributes = {
            className: applyClassName(className, [
                [ theme._toggled, value ],
                [ theme._disabled, disabled ]
            ]),
            onMouseDown: !disabled && onChange
                ?   e => {
                        onMouseDown?.(e)
                        e.defaultPrevented || onChange(!value, e, payload)
                    }
                :   undefined
        }
        applyRefApi(toggleRootProps, props)
        toggleRootProps = resolveTagAttributes(toggleRootProps, rootTagAttributes)


        return (
            <div { ...toggleRootProps }>
                { labelLeft && <div className={ theme.label } children={ labelLeft } /> }

                <div className={ theme.toggle_area }>
                    <div className={ theme.toggler } children={ toggleIcon } />
                </div>

                { labelRight && <div className={ theme.label } children={ labelRight } /> }

                { addChildren(children, theme) }
            </div>
        )
    }
)


export default Toggle
export { componentID }
export type { Component, Props }