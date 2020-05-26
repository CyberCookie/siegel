import React from 'react'

import { extractProps } from '../../ui_utils'
import { _Button, Props, DefaultProps } from './types'


const componentID = '-ui-button'

function getRootProps(mergedProps: Props & DefaultProps) {
    const { className, onClick, type, value, disabled, attributes } = mergedProps;

    let buttonRootProps: typeof attributes = {
        type, className,
        children: value
    }
    if (disabled) {
        buttonRootProps.disabled = disabled
    } else if (onClick) {
        buttonRootProps.onMouseDown = onClick
    }
    attributes && (buttonRootProps = Object.assign(buttonRootProps, attributes))


    return buttonRootProps
}

const Button: _Button = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Button.defaults, props)
        :   (props as _Button['defaults'] & typeof props)
    
    
    return <button {...getRootProps(mergedProps)} />
}
Button.defaults = {
    className: componentID,
    type: 'button',
}
Button.ID = componentID;


export { componentID }
// export { Props } from './types'
export default Button