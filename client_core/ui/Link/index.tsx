import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props } from './types'


const componentID = '-ui-external_link'

const Link: Component = component(
    componentID,
    {},
    props => {

        const { className, path, title, rootTagAttributes, refApi } = props

        let linkRootAttributes: Props['rootTagAttributes'] = {
            className,
            target: '_blank',
            rel: 'noreferrer',
            href: path.startsWith('http') ? path : ('https://' + path)
        }
        title && (linkRootAttributes.children = title)

        refApi && (applyRefApi(linkRootAttributes, props))
        rootTagAttributes && (linkRootAttributes = mergeTagAttributes(linkRootAttributes, rootTagAttributes))


        return <a { ...linkRootAttributes } />
    }
)


export default Link
export { componentID }
export type { Component, Props }