import React from 'react'

import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type {
    Component, Props, DefaultProps, MergedProps,
    MultiSelectProps, SingleSelectProps
} from './types'


const _undef = undefined
const componentID = '-ui-radio'

function getOptions(mergedProps: MergedProps) {
    const { options, theme, onChange, multiple, selected, disabled } = mergedProps


    return options.map((option: MergedProps['options'][number]) => {
        const { id, content, className, payload } = option

        const optionClassName = applyClassName(theme.option, [
            [ className, true ],
            [ theme.option__selected, multiple ? selected.has(id) : selected == id ]
        ])


        return (
            <div key={ id } className={ optionClassName } children={ content }
                onMouseDown={ disabled ? undefined : (e: React.MouseEvent) => { onChange(id, e, payload) } } />
        )
    })
}

const Radio = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            option: _undef,
            option__selected: _undef,
            _disabled: _undef
        }
    },
    props => {

        const { disabled, theme, className, rootTagAttributes, refApi } = props


        let rootProps = {
            className: applyClassName(className, [[ theme._disabled, disabled ]]),
            children: getOptions(props)
        }
        refApi && (applyRefApi(rootProps, props))
        rootTagAttributes && (rootProps = mergeTagAttributes(rootProps, rootTagAttributes))


        return <div { ...rootProps } />
    }
)


export default Radio
export { componentID }
export type { Component, Props, MultiSelectProps, SingleSelectProps }