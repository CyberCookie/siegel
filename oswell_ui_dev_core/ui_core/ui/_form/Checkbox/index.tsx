import React from 'react'

import { extractProps } from '../../ui_utils'
import { _Checkbox } from './types'

import s from './styles.sass'


const componentID = '-ui-checkbox'

const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox: _Checkbox = (props, withDefaults) => {
    const { theme, className, onChange, attributes, label, value, disabled, payload } = withDefaults
        ?   (props as _Checkbox['defaults'] & typeof props)
        :   extractProps(Checkbox.defaults, props)
    
    let checkboxInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        checked: value,
        type: 'checkbox',
        className: `${s[componentID]} ${theme.checkbox}`,
        onChange: _onChange
    }
    label || (checkboxInputProps.className += ` ${className}`)

    onChange
        ?   (checkboxInputProps.onMouseDown = (e: React.MouseEvent) => onChange(!(e.target as HTMLInputElement).checked, e, payload))
        :   (checkboxInputProps.readOnly = true);

    disabled && (checkboxInputProps.disabled = true)

    attributes && (checkboxInputProps = Object.assign(checkboxInputProps, attributes))

    const CheckboxElement = <input {...checkboxInputProps} />


    if (label) {
        const labelProps: {
            className?: string,
            onMouseDown?: (e: React.MouseEvent) => void
        } = { className }

        onChange && (labelProps.onMouseDown = e => {
            onChange(!value, e, payload)
        })

        
        return (
            <label {...labelProps}>
                <span className={theme.label} children={label} />
            
                { CheckboxElement }
            </label>
        )
    } else return CheckboxElement
}
Checkbox.defaults = {
    theme: {
        root: componentID + '_wrapper',
        checkbox: componentID,
        label: componentID + '_label'
    },
    
    value: false
}
Checkbox.ID = componentID;


export * from './types'
export { componentID }
export default Checkbox