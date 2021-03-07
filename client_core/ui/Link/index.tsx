import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type { _Link, Props } from './types'


const componentID = '-ui-external_link'

const Link: _Link = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Link.defaults, props, false)
        :   (props as _Link['defaults'] & typeof props)
    
    const { className, path, title, attributes, refApi } = mergedProps;

    let linkRootAttributes: Props['attributes'] = {
        className,
        target: '_blank',
        rel: 'noreferrer',
        href: path.startsWith('http') ? path : ('https://' + path)
    }
    title && (linkRootAttributes.children = title)

    refApi && (applyRefApi(linkRootAttributes, mergedProps))
    attributes && (linkRootAttributes = Object.assign(linkRootAttributes, attributes))


    return <a {...linkRootAttributes} />
}
Link.defaults = {
    className: componentID
}
Link.ID = componentID


export { componentID }
export default Link