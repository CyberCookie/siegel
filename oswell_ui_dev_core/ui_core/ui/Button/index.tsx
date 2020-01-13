import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'


const componentID = '-ui-button'

const defaults: DefaultProps = {
    className: componentID,
    type: 'button'
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const Button = (props: Props) => {
    let { className, onClick, type, value, disabled, wrapperAttr } = extractProps(defaults, props)

    let buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = Object.assign({}, wrapperAttr, {
        type, className,
        children: value
    })
    disabled && (buttonProps.disabled = disabled)
    onClick && (buttonProps.onMouseDown = onClick)


    return <button {...buttonProps} />
}


export { setDefaults }
export default Button