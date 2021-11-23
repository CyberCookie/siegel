import React from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import type {
    Component, MergedProps,
    Props
} from './types'


const componentID = '-ui-toggle'

const Toggle: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Toggle.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, labelLeft, labelRight, value, onChange, toggleIcon, attributes,
        payload, disabled, className, refApi
    } = mergedProps


    let toggleRootProps: Props['attributes'] = { className }

    value && (toggleRootProps.className += ` ${theme._toggled}`)

    if (disabled) {
        toggleRootProps.className += ` ${theme._disabled}`
    } else if (onChange) {
        toggleRootProps.onMouseDown = (e: React.MouseEvent) => { onChange(!value, e, payload) }
    }
    refApi && (applyRefApi(toggleRootProps, mergedProps))
    attributes && (toggleRootProps = Object.assign(toggleRootProps, attributes))


    return (
        <div { ...toggleRootProps }>
            { labelLeft && <div className={ theme.label } children={ labelLeft } /> }

            <div className={ theme.toggle_area }>
                <div className={ theme.toggler } children={ toggleIcon } />
            </div>

            { labelRight && <div className={ theme.label } children={ labelRight } /> }

            { addChildren(toggleRootProps, theme) }
        </div>
    )
}
Toggle.defaults = {
    theme: {
        root: '',
        children: '',
        _disabled: '',
        _toggled: '',
        label: '',
        toggle_area: '',
        toggler: ''
    }
}
Toggle.ID = componentID


export { componentID }
export default Toggle
export type { Props }