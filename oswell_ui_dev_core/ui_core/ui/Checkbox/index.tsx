import React from 'react'

import { setDefaultProps, extractProps, PropsComponentThemed } from '../ui_utils'
import styles from './styles.sass'

type Props = {
    onChange: (checked: boolean, e: React.MouseEvent) => void,
    checkboxAttr?: React.HTMLAttributes<HTMLInputElement>,
    disabled?: boolean,
    value: boolean,
    label: React.ReactNode
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<PropsComponentThemed['theme']>,
    value: boolean
}

const componentID = '-ui-checkbox'

const defaults: DefaultProps = {
    theme: {
        checkbox: componentID,
        label: componentID + '_label',
        wrapper: componentID + '_wrapper'
    },

    value: false
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox = (props: Props) => {
    let { theme, className, onChange, checkboxAttr, label, value, disabled } = extractProps(defaults, props)
    
    let _checkboxAttr: React.InputHTMLAttributes<HTMLInputElement> = Object.assign({}, checkboxAttr, {
        checked: value,
        type: 'checkbox',
        className: `${styles.checkbox} ${theme.checkbox}`,
        onChange: _onChange
    })

    onChange
        ?   (_checkboxAttr.onMouseDown = (e: React.MouseEvent) => onChange(!(e.target as HTMLInputElement).checked, e))
        :   (_checkboxAttr.readOnly = true);

    disabled && (_checkboxAttr.disabled = true)
    
    let wrapperClassName = theme.wrapper;
    if (className) {
        let classToAdd = ` ${className}`;

        label
            ?   (wrapperClassName += classToAdd)
            :   (_checkboxAttr.className += classToAdd)
    }

    let CheckboxElement = <input {..._checkboxAttr} />


    return label
        ?   <label className={wrapperClassName}>
                <span className={theme.label} children={label} />

                { CheckboxElement }
            </label>
            
        :   CheckboxElement
}
Checkbox.id = componentID


export { setDefaults }
export default Checkbox