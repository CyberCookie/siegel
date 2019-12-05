import React,
    { ButtonHTMLAttributes, MouseEventHandler } from 'react'

interface Props {
    type?: string,
    value?: number | string,
    disabled?: boolean,
    className?: string,
    wrapperAttr?: object,
    onClick?: MouseEventHandler
}

interface DefaultProps {
    className: string,
    type: string
}


const componentID = '-ui-button'

const defaults: DefaultProps = {
    className: componentID,
    type: 'button'
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const Button = (props: Props) => {
    let className = defaults.className;
    props.className && (className += ` ${props.className}`)
    
    let { onClick, type, value, disabled, wrapperAttr } = Object.assign({}, defaults, props)

    let buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = Object.assign({}, wrapperAttr, {
        type, className,
        children: value
    })
    disabled && (buttonProps.disabled = disabled)
    onClick && (buttonProps.onMouseDown = onClick)


    return <button {...buttonProps} />
}


export { setDefaults }
export default Button