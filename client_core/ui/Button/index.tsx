import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props, DefaultProps } from './types'


const componentID = '-ui-button'

const Button = component<Props, DefaultProps>(
    componentID,
    { type: 'button' },
    props => {

        const {
            className, type, disabled, rootTagAttributes,
            value: children,
            onClick: onMouseDown
        } = props

        let buttonProps: Props['rootTagAttributes'] = {
            className, onMouseDown, type, disabled, children
        }
        applyRefApi(buttonProps, props)
        buttonProps = resolveTagAttributes(buttonProps, rootTagAttributes)


        return <button { ...buttonProps } />
    }
)


export default Button
export { componentID }
export type { Component, Props }