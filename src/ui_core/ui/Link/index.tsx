import React from 'react'

import { extractProps } from '../ui_utils'
import { _Link } from './types'


const componentID = '-ui-external_link'

const Link: _Link = (props, noDefaults) => {
    const { className, path, title, attributes } = noDefaults
        ?   extractProps(Link.defaults, props)
        :   (props as _Link['defaults'] & typeof props)
    
    let linkRootAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        className,
        target: '_blank',
        rel: 'noreferrer',
        href: path.startsWith('http') ? path : ('https://' + path)
    }
    title && (linkRootAttributes.children = title)

    attributes && (linkRootAttributes = Object.assign(linkRootAttributes, attributes))


    return <a {...linkRootAttributes} />
}
Link.defaults = {
    className: componentID
}
Link.ID = componentID


export { componentID }
export default Link