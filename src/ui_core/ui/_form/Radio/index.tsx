import React from 'react'

import { extractProps } from '../../ui_utils'
import type { _Radio, Option, MergedProps } from './types'


const componentID = '-ui-radio'

function getOptions(mergedProps: MergedProps) {
    const { options, theme, onChange, multiple, selected, disabled } = mergedProps;


    return options.map((option: Option) => {
        const { id, content, className } = option;

        let optionClassName = theme.option;
        className && (optionClassName += ` ${className}`)

        if ((multiple && (selected as Set<ID>).has(id)) || (!multiple && selected == id)) {
            optionClassName += ` ${theme.option__selected}`
        }


        return (
            <div key={id} className={optionClassName} children={content}
                onMouseDown={(e: React.MouseEvent) => { disabled || onChange(id, e) }} />
        )
    })
}

const Radio: _Radio = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Radio.defaults, props)
        :   (props as _Radio['defaults'] & typeof props)

    const { disabled, theme, attributes } = mergedProps;

    
    const rootProps = {
        className: mergedProps.className,
        children: getOptions(mergedProps)
    }
    disabled && (rootProps.className += ` ${theme._disabled}`)
    attributes && Object.assign(rootProps, attributes)


    return <div {...rootProps} />
}
Radio.defaults = {
    theme: {
        root: componentID,
        option: componentID + '_option',
        option__selected: componentID + '_option__selected',
        _disabled: componentID + '__disabled'
    }
}
Radio.ID = componentID;


export { componentID }
export default Radio