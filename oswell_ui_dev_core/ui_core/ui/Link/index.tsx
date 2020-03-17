import React from 'react'

import { extractProps } from '../ui_utils'
import { _Link } from './types'


const componentID = '-ui-external_link'

const onMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { target, href } = e.currentTarget;
    window.open(href, target)
}

const onClick = (e: React.MouseEvent) => e.preventDefault()

const Link: _Link = (props, withDefaults) => {
    const { className, path, title, attributes } = withDefaults
        ?   (props as _Link['defaults'] & typeof props)
        :   extractProps(Link.defaults, props)
    
    let linkRootAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        onClick, onMouseDown, className,
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