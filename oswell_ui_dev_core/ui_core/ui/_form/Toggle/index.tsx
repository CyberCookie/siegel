import React from 'react'

import { extractProps } from '../../ui_utils'
import { _Toggle } from './types'


const componentID = '-ui-toggle'

const Toggle: _Toggle = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Toggle['defaults'] & typeof props)
        :   extractProps(Toggle.defaults, props)

    const { theme, labelLeft, labelRight, isToggled, onChange, toggleIcon, attributes } = mergedProps;
    
    let className = `${mergedProps.className} ${theme.toggle}`;
    isToggled && (className += ` ${theme.toggle_checked}`)

    let toggleRootProps = {
        className,
        onMouseDown: onChange
    }
    attributes && (toggleRootProps = Object.assign({}, attributes, toggleRootProps))


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
        toggle: componentID,
        toggle_checked: componentID + '__checked',
        label: componentID + '_label',
        toggle_area: componentID + '_toggle_area',
        toggler: componentID + '_toggler'
    }
}
Toggle.ID = componentID;


export { componentID }
export default Toggle