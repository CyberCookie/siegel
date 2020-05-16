import React from 'react'

import { extractProps } from '../../ui_utils'
import { _Button } from './types'


const componentID = '-ui-button'

const Button: _Button = (props, noDefaults) => {
    const { className, onClick, type, value, disabled, attributes } = noDefaults
        ?   extractProps(Button.defaults, props)
        :   (props as _Button['defaults'] & typeof props)
    
    
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