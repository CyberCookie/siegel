import React, { useLayoutEffect, useState } from 'react'

import isExists from '../../utils/is/exists'
import extractProps from '../../ui/_internals/props_extract'
import applyRefApi from '../../ui/_internals/ref_apply'
import getFinalURL from '../get_final_url'
import type { Component, MergedProps } from './types'


const componentID = '-ui-internal_link'

const BASENAME_UPDATE_EVENT_TYPE = '_basename_update'

const NavLink: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(NavLink.defaults, props, false)
        :   (props as MergedProps)

    const {
        href, activeClassName, refApi,
        state = null
    } = mergedProps

    if (isExists(history.basename)) {
        const [ counter, setCounter ] = useState(0)

        useLayoutEffect(() => {
            function rerenderDueToNewBasename() {
                setCounter(counter + 1)
            }

            addEventListener(BASENAME_UPDATE_EVENT_TYPE, rerenderDueToNewBasename)
            return () => {
                removeEventListener(BASENAME_UPDATE_EVENT_TYPE, rerenderDueToNewBasename)
            }
        }, [])
    }


    const { pathname } = location
    const finalHref = getFinalURL(pathname, href)

    const finalProps = Object.assign({}, props, {
        onClick(e: React.MouseEvent) {
            props.onClick?.(e)

            if (!e.defaultPrevented) {
                e.preventDefault()
                history.push!(finalHref, state)
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

    refApi && (applyRefApi(finalProps, mergedProps))


    return <a { ...finalProps } />
}
NavLink.defaults = {}
NavLink.ID = componentID


export default NavLink
export { componentID, BASENAME_UPDATE_EVENT_TYPE }
export * from './types'