import React from 'react'

import { extractProps, withDefaults } from '../ui_utils'
import { Props, _Checkbox } from './types'

import s from './styles.sass'


const componentID = '-ui-checkbox'

const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox: _Checkbox = (props, withDefaults) => {
    let { theme, className, onChange, attributes, label, value, disabled, payload } = withDefaults
        ?   (props as _Checkbox['defaults'] & typeof props)
        :   extractProps(Checkbox.defaults, props)
    
    let checkboxInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        checked: value,
        type: 'checkbox',
        className: `${s[componentID]} ${theme.checkbox}`,
        onChange: _onChange
    }

    onChange
        ?   (checkboxInputProps.onMouseDown = (e: React.MouseEvent) => onChange(!(e.target as HTMLInputElement).checked, e, payload))
        :   (checkboxInputProps.readOnly = true);

    disabled && (checkboxInputProps.disabled = true)
    
    let wrapperClassName = theme.wrapper;

    if (className) {
        let classToAdd = ` ${className}`

        label
            ?   (wrapperClassName += classToAdd)
            :   (checkboxInputProps.className += classToAdd)
    }

    attributes && (checkboxInputProps = Object.assign(checkboxInputProps, attributes))

    let CheckboxElement = <input {...checkboxInputProps} />


    return label
        ?   <label className={wrapperClassName}>
                <span className={theme.label} children={label} />

                { CheckboxElement }
            </label>
            
        :   CheckboxElement
}
Checkbox.defaults = {
    theme: {
        checkbox: componentID,
        label: componentID + '_label',
        wrapper: componentID + '_wrapper'
    },
    
    value: false
}
Checkbox.ID = componentID;


export { componentID }
export default Checkbox