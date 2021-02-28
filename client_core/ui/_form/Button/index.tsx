import React from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import type { _Button } from './types'


const componentID = '-ui-button'

const Button: _Button = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Button.defaults, props)
        :   (props as _Button['defaults'] & typeof props)
    
    const {
        value: children,
        onClick: onMouseDown,
        className, type, disabled, attributes, refApi
    } = mergedProps;


    const buttonProps = { className, onMouseDown, type, disabled, children }
    refApi && applyRefApi(buttonProps, mergedProps)
    attributes && Object.assign(buttonProps, attributes)


    return <button { ...buttonProps } />
}
Button.defaults = {
    className: componentID,
    type: 'button',
}
Button.ID = componentID;


export { componentID }
export default Button