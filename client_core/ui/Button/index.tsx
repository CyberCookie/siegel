import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type { Component, MergedProps, Props } from './types'


const componentID = '-ui-button'

const Button: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Button.defaults, props, false)
        :   (props as MergedProps)

    const {
        value: children,
        onClick: onMouseDown,
        className, type, disabled, rootTagAttributes, refApi
    } = mergedProps


    let buttonProps = { className, onMouseDown, type, disabled, children }
    refApi && applyRefApi(buttonProps, mergedProps)
    rootTagAttributes && (buttonProps = mergeTagAttributes(buttonProps, rootTagAttributes))


    return <button { ...buttonProps } />
}
Button.defaults = {
    type: 'button'
}
Button.ID = componentID


export default Button
export { componentID }
export type { Component, Props }