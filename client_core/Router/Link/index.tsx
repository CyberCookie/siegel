import React from 'react'

import getFinalURL from '../get_final_url'
import type { LinkProps } from './types'


const A = (props: LinkProps) => {
    const { href, activeClassName } = props

    const { pathname } = location
    const finalHref = getFinalURL(pathname, href)

    const finalProps = Object.assign({}, props, {
        onClick(e: React.MouseEvent) {
            props.onClick?.(e)

            if (!e.defaultPrevented) {
                e.preventDefault()
                history.push!(finalHref)
            }
        },
        href: finalHref
    })
    if (activeClassName && pathname == finalHref) {
        finalProps.className
            ?   (finalProps.className += ` ${activeClassName}`)
            :   (finalProps.className = activeClassName)
    }
    delete finalProps['activeClassName']


    return <a { ...finalProps } />
}


export default A
export type { LinkProps }