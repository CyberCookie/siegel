import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'


const componentID = '-ui-toggle'

const defaults: DefaultProps = {
    theme: {
        toggle: componentID,
        toggle_checked: componentID + '__checked',
        label: componentID + '_label',
        toggle_area: componentID + '_toggle_area',
        toggler: componentID + '_toggler'
    }
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const Toggle = (props: Props) => {
    let { theme, labelLeft, labelRight, isToggled, onToggle, className, toggleIcon } = extractProps(defaults, props)

    className += ` ${theme.toggle}`;
    isToggled && (className += ` ${theme.toggle_checked}`)


    return (
        <div className={className} onMouseDown={onToggle}>
            { labelLeft && <div className={theme.label} children={labelLeft} /> }

            <div className={theme.toggle_area}>
                <div className={theme.toggler} children={toggleIcon} />
            </div>

            { labelRight && <div className={theme.label} children={labelRight} /> }
        </div>
    )
}


export { setDefaults }
export default Toggle