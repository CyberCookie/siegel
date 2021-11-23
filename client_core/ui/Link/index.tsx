import React from 'react'

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

    const { className, path, title, attributes, refApi } = mergedProps

    let linkRootAttributes: Props['attributes'] = {
        className,
        target: '_blank',
        rel: 'noreferrer',
        href: path.startsWith('http') ? path : ('https://' + path)
    }
    title && (linkRootAttributes.children = title)

    refApi && (applyRefApi(linkRootAttributes, mergedProps))
    attributes && (linkRootAttributes = Object.assign(linkRootAttributes, attributes))


    return <a { ...linkRootAttributes } />
}
Link.defaults = {}
Link.ID = componentID


export { componentID }
export default Link
export type { Props }