import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props, DefaultProps } from './types'


const componentID = '-ui-external_link'

const Link = component<Props, DefaultProps>(
    componentID,
    {},
    props => {

        const { className, path, title, rootTagAttributes } = props

        let linkRootAttributes: Props['rootTagAttributes'] = {
            className,
            target: '_blank',
            rel: 'noreferrer',
            href: path.startsWith('http') ? path : ('https://' + path)
        }
        title && (linkRootAttributes.children = title)

        applyRefApi(linkRootAttributes, props)
        linkRootAttributes = resolveTagAttributes(linkRootAttributes, rootTagAttributes)


        return <a { ...linkRootAttributes } />
    }
)


export default Link
export { componentID }
export type { Component, Props }