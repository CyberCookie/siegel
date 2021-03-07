import React from 'react'

import { extractProps, applyRefApi } from '../../ui_utils'
import type { _Toggle, Props } from './types'


const componentID = '-ui-toggle'

const Toggle: _Toggle = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Toggle.defaults, props, false)
        :   (props as _Toggle['defaults'] & typeof props)

    const {
        theme, labelLeft, labelRight, isToggled, onChange, toggleIcon, attributes,
        payload, disabled, className, refApi
    } = mergedProps;
    
        
    let toggleRootProps: Props['attributes'] = { className }

    isToggled && (toggleRootProps.className += ` ${theme._toggled}`)
    
    if (disabled) {
        toggleRootProps.className += ` ${theme._disabled}`
    } else if (onChange) {
        toggleRootProps.onMouseDown = (e: React.MouseEvent) => { onChange(!isToggled, e, payload) }
    }
    refApi && (applyRefApi(toggleRootProps, mergedProps))
    attributes && (toggleRootProps = Object.assign(toggleRootProps, attributes))


    return (
        <div {...toggleRootProps}>
            { labelLeft && <div className={theme.label} children={labelLeft} /> }

            <div className={theme.toggle_area}>
                <div className={theme.toggler} children={toggleIcon} />
            </div>

            { labelRight && <div className={theme.label} children={labelRight} /> }
        </div>
    )
}
Toggle.defaults = {
    theme: {
        root: componentID,
        _disabled: componentID + '__disabled',
        _toggled: componentID + '__toggled',
        label: componentID + '_label',
        toggle_area: componentID + '_toggle_area',
        toggler: componentID + '_toggler'
    }
}
Toggle.ID = componentID;


export { componentID }
export default Toggle