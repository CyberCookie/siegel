import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type {
    Component, Props, MergedProps,
    MultiSelectProps, SingleSelectProps
} from './types'


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

const Radio: Component = component(
    componentID,
    {
        theme: {
            root: '',
            option: '',
            option__selected: '',
            _disabled: ''
        }
    },
    props => {

        const { disabled, theme, rootTagAttributes, refApi } = props


        let rootProps = {
            className: props.className,
            children: getOptions(props)
        }
        disabled && (rootProps.className += ` ${theme._disabled}`)
        refApi && (applyRefApi(rootProps, props))
        rootTagAttributes && (rootProps = mergeTagAttributes(rootProps, rootTagAttributes))


        return <div { ...rootProps } />
    }
)


export default Radio
export { componentID }
export type { Component, Props, MultiSelectProps, SingleSelectProps }