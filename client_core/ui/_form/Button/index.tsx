import React from 'react'

import { extractProps } from '../../ui_utils'
import type { _Button } from './types'


const componentID = '-ui-button'

const Button: _Button = (props, noDefaults) => {
    const {
        value: children,
        onClick: onMouseDown,
        className, type, disabled, attributes
    } = noDefaults
        ?   extractProps(Button.defaults, props)
        :   (props as _Button['defaults'] & typeof props)
    

    const buttonProps = { className, onMouseDown, type, disabled, children }
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