import React from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type { Component, MergedProps, Props, MultiSelectProps, SingleSelectProps } from './types'


const componentID = '-ui-radio'

function getOptions(mergedProps: MergedProps) {
    const { options, theme, onChange, multiple, selected, disabled } = mergedProps


    return options.map((option: MergedProps['options'][number]) => {
        const { id, content, className, payload } = option

        let optionClassName = theme.option
        className && (optionClassName += ` ${className}`)

        if ((multiple && (selected as Set<string>).has(id)) || (!multiple && selected == id)) {
            optionClassName += ` ${theme.option__selected}`
        }


        return (
            <div key={ id } className={ optionClassName } children={ content }
                onMouseDown={ (e: React.MouseEvent) => { disabled || onChange(id, e, payload) } } />
        )
    })
}

const Radio: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Radio.defaults, props, false)
        :   (props as MergedProps)

    const { disabled, theme, attributes, refApi } = mergedProps


    const rootProps = {
        className: mergedProps.className,
        children: getOptions(mergedProps)
    }
    disabled && (rootProps.className += ` ${theme._disabled}`)
    refApi && (applyRefApi(rootProps, mergedProps))
    attributes && Object.assign(rootProps, attributes)


    return <div { ...rootProps } />
}
Radio.defaults = {
    theme: {
        root: '',
        option: '',
        option__selected: '',
        _disabled: ''
    }
}
Radio.ID = componentID


export { componentID }
export default Radio
export type { Props, MultiSelectProps, SingleSelectProps }