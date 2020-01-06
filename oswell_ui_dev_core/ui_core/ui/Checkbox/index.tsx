import React,
    { ReactNode, InputHTMLAttributes } from 'react'

import styles from './styles.sass'

interface Props {
    theme?: UITheme,
    className?: string,
    onChange: (checked: boolean, e: React.MouseEvent) => void,
    checkboxAttr?: React.HTMLAttributes<HTMLInputElement>,
    disabled?: boolean,
    value: boolean,
    label: ReactNode
}


const componentID = '-ui-checkbox'

const defaults = {
    theme: {
        checkbox: componentID,
        label: componentID + '_label',
        wrapper: componentID + '_wrapper'
    },

    value: false
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const _onChange = (e: React.ChangeEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const Checkbox = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { className, onChange, checkboxAttr, label, value, disabled } = Object.assign({}, defaults, props)
    
    
    let _checkboxAttr: InputHTMLAttributes<HTMLInputElement> = Object.assign({}, checkboxAttr, {
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