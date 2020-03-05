import React from 'react'

import { extractProps } from '../ui_utils'
import { _Button } from './types'


const componentID = '-ui-button'

const Button: _Button = (props, withDefaults) => {
    let { className, onClick, type, value, disabled, attributes } = withDefaults
        ?   (props as _Button['defaults'] & typeof props)
        :   extractProps(Button.defaults, props)
    
    
    let buttonRootProps: typeof attributes = {
        type, className,
        children: value
    }
    disabled && (buttonRootProps.disabled = disabled)
    onClick && (buttonRootProps.onMouseDown = onClick)
    attributes && (buttonRootProps = Object.assign(buttonRootProps, attributes))
    
    
    return <button {...buttonRootProps} />
}
Button.defaults = {
    className: componentID,
    type: 'button',
}
Button.ID = componentID;


export { componentID }
export default Button