import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type {
    Component, MergedProps,
    Props
} from './types'


const componentID = '-ui-external_link'

const Link: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Link.defaults, props, false)
        :   (props as MergedProps)

    const { className, path, title, rootTagAttributes, refApi } = mergedProps

    let linkRootAttributes: Props['rootTagAttributes'] = {
        className,
        target: '_blank',
        rel: 'noreferrer',
        href: path.startsWith('http') ? path : ('https://' + path)
    }
    title && (linkRootAttributes.children = title)

    refApi && (applyRefApi(linkRootAttributes, mergedProps))
    rootTagAttributes && (linkRootAttributes = mergeTagAttributes(linkRootAttributes, rootTagAttributes))


    return <a { ...linkRootAttributes } />
}
Link.defaults = {}
Link.ID = componentID


export { componentID }
export default Link
export * from './types'