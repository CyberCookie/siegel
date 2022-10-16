import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props, DefaultProps } from './types'


const componentID = '-ui-button'

const Button = component<Props, DefaultProps>(
    componentID,
    { type: 'button' },
    props => {

        const {
            className, type, disabled, rootTagAttributes, refApi,
            value: children,
            onClick: onMouseDown
        } = props

        let buttonProps = { className, onMouseDown, type, disabled, children }
        refApi && applyRefApi(buttonProps, props)
        rootTagAttributes && (buttonProps = mergeTagAttributes(buttonProps, rootTagAttributes))


        return <button { ...buttonProps } />
    }
)


export default Button
export { componentID }
export type { Component, Props }